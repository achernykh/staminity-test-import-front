import './assignment-summary-non-structured.component.scss';
import {IComponentOptions, IComponentController, IPromise, INgModelController, IScope} from 'angular';
import {IActivityMeasure, ICalcMeasures, IActivityIntervalPW} from "../../../../../api/activity/activity.interface";
import {
    CalendarItemActivityCtrl,
    HeaderStructuredTab
} from "../../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import moment from 'moment/src/moment.js';
import {FtpState} from "../assignment/assignment.component";
import {IAuthService} from "../../../auth/auth.service";
import { IQuillConfig } from "@app/share/quill/quill.config";

const isFutureDay = (day) => moment(day, 'YYYY-MM-DD').startOf('day').diff(moment().startOf('day'), 'd') > 0;

class AssignmentSummaryNonStructuredCtrl implements IComponentController {

    private item: CalendarItemActivityCtrl;
    public onChange: (result: {plan: IActivityIntervalPW, actual: ICalcMeasures, form: INgModelController}) => IPromise<void>;

    private plan: IActivityIntervalPW;
    private actual: ICalcMeasures;
    public sport: string;
    public form: INgModelController;
    public ftpMode: number;

    public FTPMeasures: Array<string> = ['heartRate', 'speed', 'power'];
    public from: string = 'intensityLevelFrom' || 'intensityByFtpFrom';
    public to: string = 'intensityLevelTo' || 'intensityByFtpTo';
    private readonly index: any = [{from: 'intensityByFtpFrom', to: 'intensityByFtpTo'},{from: 'intensityLevelFrom', to: 'intensityLevelTo'}];

    private percentComplete: Object = {};

    private options: {
        rowSelection: boolean;
        multiSelect: boolean;
        autoSelect: boolean;
        decapitate: boolean;
        largeEditDialog: boolean;
        boundaryLinks: boolean;
        limitSelect: boolean;
        pageSelect: boolean;
    } = {
        rowSelection: false,
        multiSelect: false,
        autoSelect: false,
        decapitate: false,
        largeEditDialog: false,
        boundaryLinks: false,
        limitSelect: false,
        pageSelect: false
    };
    private query:Object = {
        order: 'code',
        limit: 5,
        page: 1
    };

    private readonly valueType = {
        movingDuration: 'value',
        duration: 'value',
        distance: 'value',
        heartRate: 'avgValue',
        speed: 'avgValue',
        power: 'avgValue'
    };

    private measuresBySport;

    private trustHTML: string;

    static $inject = ['$scope', 'AuthService', 'quillConfig'];

    constructor(
        private $scope: IScope,
        private AuthService: IAuthService,
        private quillConf: IQuillConfig) {
    }

    $onInit() {
        // расчет процента по позициям планогово задания в тренировке
        this.prepareData();
        this.prepareValues();
        this.ftpMode = (this.item.options.templateMode || this.item.activity.view.isTrainingPlan) ? FtpState.On : FtpState.Off;
        this.validateForm();
    }

    $postLink () {
        setTimeout(() => {
            this.validateForm();
            this.updateForm();
            this.$scope.$applyAsync();
        }, 100);
    }

    $onDestroy(): void {
        this.validateForm();
    }

    $onChanges(changes: any): void {
        if(changes.hasOwnProperty('change') && !changes.change.isFirstChange()) {
            this.plan = null;
            this.actual = null;
            this.prepareData();
            setTimeout(() => {
                this.validateForm();
                this.updateForm();
            }, 300);
        }
    }

    link(url) {
        window.open(url);
    }

    showRow(measure: string) {

        if (!this.item.activity.view.isView) {
            return true;
        }

        if (this.item.activity.status === 'coming' || this.item.activity.status === 'dismiss') {
            return measure === this.plan.durationMeasure || measure === this.plan.intensityMeasure;
        } else {
            return true;
        }
    }

    prepareData(): void {
        this.plan = this.item.activity.intervals.PW;
        this.actual = this.item.activity.intervals.W.calcMeasures;
        this.$scope.$applyAsync();
    }

    prepareValues() {
        if(this.ftpMode) {
            this.from = 'intensityByFtpFrom';
            this.to = 'intensityByFtpTo';
        } else {
            this.from = 'intensityLevelFrom';
            this.to = 'intensityLevelTo';
        }
        // для исторических данных, до перехода movingDuration -> duration
        let durationMeasure = this.plan.durationMeasure === 'movingDuration' ? 'movingDuration' : 'duration';
        this.measuresBySport = {
            swim: [durationMeasure,'distance', 'heartRate','speed'],
            bike: [durationMeasure,'distance','heartRate', 'speed','power'],
            run: [durationMeasure,'distance','heartRate', 'speed'],
            strength: [durationMeasure,'distance','heartRate'],
            transition: [durationMeasure,'distance','heartRate', 'speed'],
            ski: [durationMeasure,'distance','heartRate', 'speed'],
            rowing: [durationMeasure,'distance','heartRate', 'speed'],
            other: [durationMeasure,'distance','heartRate', 'speed'],
            default: [durationMeasure,'distance','heartRate', 'speed'],
        };
        this.measuresBySport[this.item.activity.header.sportBasic || 'default'].forEach(key => {
            this.percentComplete[key] = this.calcPercent(key) || null;
        });
    }

    ftpModeChange(mode: FtpState) {
        this.ftpMode = mode;
        this.item.ftpMode = mode;
        this.prepareValues();
    }

    isFTP() {
        return this.ftpMode === FtpState.On;
    }

    isInterval(key) {
        return ['speed','heartRate','power'].indexOf(key) !== -1;
    }

    getFTP(measure: string, sport: string = this.sport):number {
        let zones = this.item.options.owner.trainingZones;
        return (this.isInterval(measure) && 0) ||
            (zones.hasOwnProperty(measure) && zones[measure].hasOwnProperty(sport) && zones[measure][sport]['FTP']) ||
            (zones.hasOwnProperty(measure) && zones[measure].hasOwnProperty('default') && zones[measure]['default']['FTP']) || null;
    }

    changeValue(key: string, segment: 'actual' | 'plan' = null) {
        if(!!!key) {return;}
        if (segment === 'actual' && this.item.activity.hasActualData) {
            this.item.activity.intervals.W.actualDataIsCorrected = true;
        }
        this.clearTemplate();
        this.validateForm();
        this.ftpMode === FtpState.Off ? this.completeFtpMeasure(key) : this.completeAbsoluteMeasure(key);
        this.prepareDataForUpdate();
        this.percentComplete[key] = this.calcPercent(key); // обновляем view model
        this.plan.calcMeasures.completePercent.value = this.calculateCompletePercent(); // расчет итогового процента по тренировке
        this.updateForm();
    }

    completeAbsoluteMeasure(key) {
        this.plan[key][this.index[FtpState.Off]['from']] = this.plan[key][this.index[FtpState.On]['from']] * this.getFTP(key);
        this.plan[key][this.index[FtpState.Off]['to']] = this.plan[key][this.index[FtpState.On]['to']] * this.getFTP(key);
    }

    completeFtpMeasure(key) {
        this.plan[key][this.index[FtpState.On]['from']] = this.plan[key][this.index[FtpState.Off]['from']] / this.getFTP(key);
        this.plan[key][this.index[FtpState.On]['to']] = this.plan[key][this.index[FtpState.Off]['to']] / this.getFTP(key);
    }

    prepareDataForUpdate() {
        this.plan.durationMeasure =
            (!!this.plan.distance['durationValue'] && 'distance') ||
            (!!this.plan.duration['durationValue'] && 'duration') ||
            (!!this.plan.movingDuration['durationValue'] && 'movingDuration') || null;

        this.plan.durationValue =
            (this.plan[this.plan.durationMeasure] && this.plan[this.plan.durationMeasure]['durationValue']) || null;

        this.plan.intensityMeasure =
            ((this.plan.heartRate[this.index[FtpState.Off]['from']] || this.plan.heartRate[this.index[FtpState.On]['from']]) && 'heartRate') ||
            ((this.plan.speed[this.index[FtpState.Off]['from']] || this.plan.speed[this.index[FtpState.On]['from']]) && 'speed') ||
            ((this.plan.power[this.index[FtpState.Off]['from']] || this.plan.power[this.index[FtpState.On]['from']]) && 'power') || null;

        this.plan.intensityLevelFrom =
            (this.plan[this.plan.intensityMeasure] && this.plan[this.plan.intensityMeasure][this.index[FtpState.Off]['from']]) || null;
        this.plan.intensityLevelTo =
            (this.plan[this.plan.intensityMeasure] && this.plan[this.plan.intensityMeasure][this.index[FtpState.Off]['to']]) || null;

        this.plan.intensityByFtpFrom =
            (this.plan[this.plan.intensityMeasure] && this.plan[this.plan.intensityMeasure][this.index[FtpState.On]['from']]) || null;
        this.plan.intensityByFtpTo =
            (this.plan[this.plan.intensityMeasure] && this.plan[this.plan.intensityMeasure][this.index[FtpState.On]['to']]) || null;
    }

    calcPercent(key: string): number {

        let plan = (this.plan[key].hasOwnProperty('durationValue') && this.plan[key].durationValue) ||
            (this.plan[key][this.index[FtpState.Off]['from']] === this.plan[key][this.index[FtpState.Off]['to']] && this.plan[key][this.index[FtpState.Off]['from']]) ||
            (this.plan[key][this.index[FtpState.Off]['from']] !== this.plan[key][this.index[FtpState.Off]['to']] && this.plan[key]) || null;

        let actual = (this.actual.hasOwnProperty(key) && this.actual[key][this.valueType[key]]) || null;

        // для расчета процента необходимо наличие плана и факта по позиции
        if(!!plan && !!actual){
            if (typeof plan !== 'object') {
                return actual / plan;
            } else if (key === 'speed') { //TODO сделать метод для определния велечин с обратным счетом
                return  ((actual <= plan[this.index[FtpState.Off]['from']] && actual >= plan[this.index[FtpState.Off]['to']]) && 1) ||
                    ((actual <= plan[this.index[FtpState.Off]['to']]) && actual/plan[this.index[FtpState.Off]['to']]) ||
                    ((actual >= plan[this.index[FtpState.Off]['from']]) && actual/plan[this.index[FtpState.Off]['from']]);
            } else {
                return  ((actual >= plan[this.index[FtpState.Off]['from']] && actual <= plan[this.index[FtpState.Off]['to']]) && 1) ||
                    ((actual >= plan[this.index[FtpState.Off]['to']]) && actual/plan[this.index[FtpState.Off]['to']]) ||
                    ((actual <= plan[this.index[FtpState.Off]['from']]) && actual/plan[this.index[FtpState.Off]['from']]);
            }
        } else {
            return null;
        }
    }

    changeParam() {
        //console.debug('activity assignment quill change text ', this.item.activity.intervals.PW.trainersPrescription);
        setTimeout(()=>{
            this.clearTemplate();
            this.validateForm();
            this.updateForm();
            this.item.updateFilterParams();
        }, 100);
    }

    validateForm() {

        if (this.form.hasOwnProperty('plan_distance')) {
            this.form['plan_distance'].$setValidity('needDuration',
                this.form['plan_distance'].$modelValue > 0 ||
                this.form.hasOwnProperty('plan_duration') && this.form['plan_duration'].$modelValue > 0 ||
                this.form.hasOwnProperty('plan_movingDuration') && this.form['plan_movingDuration'].$modelValue > 0 ||
                this.form.hasOwnProperty('actual_distance') && this.form['actual_distance'].$modelValue > 0 ||
                this.form.hasOwnProperty('actual_duration') && this.form['actual_duration'].$modelValue > 0 ||
                this.form.hasOwnProperty('actual_movingDuration') && this.form['actual_movingDuration'].$modelValue > 0);

            if (this.form.hasOwnProperty('plan_duration')) {
                this.form['plan_duration'].$setValidity('needDuration',
                    this.form['plan_distance'].$modelValue > 0 ||
                    this.form.hasOwnProperty('plan_duration') && this.form['plan_duration'].$modelValue > 0 ||
                    this.form.hasOwnProperty('actual_distance') && this.form['actual_distance'].$modelValue > 0 ||
                    this.form.hasOwnProperty('actual_duration') && this.form['actual_duration'].$modelValue > 0);
            }

            if (this.form.hasOwnProperty('plan_movingDuration')) {
                this.form['plan_movingDuration'].$setValidity('needDuration',
                    this.form['plan_distance'].$modelValue > 0 ||
                    this.form.hasOwnProperty('plan_movingDuration') && this.form['plan_movingDuration'].$modelValue > 0 ||
                    this.form.hasOwnProperty('actual_distance') && this.form['actual_distance'].$modelValue > 0 ||
                    this.form.hasOwnProperty('actual_movingDuration') && this.form['actual_movingDuration'].$modelValue > 0);
            }

            // Пользователь может указать или расстояние, или время | время в движении
            this.form['plan_distance'].$setValidity('singleDuration',
                !(this.form['plan_distance'].$modelValue > 0 &&
                ((this.form['plan_duration'] && this.form['plan_duration'].$modelValue > 0) ||
                (this.form['plan_movingDuration'] && this.form['plan_movingDuration'].$modelValue > 0))));

            if (this.form.hasOwnProperty('plan_duration')) {
                this.form['plan_duration'].$setValidity('singleDuration',
                    !(this.form['plan_distance'].$modelValue > 0 && this.form['plan_duration'].$modelValue > 0));
            }

            if (this.form.hasOwnProperty('plan_movingDuration')) {
                this.form['plan_movingDuration'].$setValidity('singleDuration',
                    !(this.form['plan_distance'].$modelValue > 0 && this.form['plan_movingDuration'].$modelValue > 0));
            }

            // Пользователь может указать только один парметр интенсивности
            if (this.form['plan_heartRate'] && this.form['plan_speed']) {
                this.form['plan_heartRate'].$setValidity('singleIntensity',
                    !(this.form['plan_heartRate'].$modelValue[this.index[FtpState.Off]['from']] > 0 &&
                    this.form['plan_speed'].$modelValue[this.index[FtpState.Off]['from']] > 0));
                this.form['plan_speed'].$setValidity('singleIntensity',
                    !(this.form['plan_heartRate'].$modelValue[this.index[FtpState.Off]['from']] > 0 &&
                    this.form['plan_speed'].$modelValue[this.index[FtpState.Off]['from']] > 0));
            }
        }

        // Планировать в будущем может:
        // 1) пользователь с тарифом Премиум 2) тренер в календаре учеников
        if (this.form['dateStart']) {
            this.form['dateStart'].$setValidity('needPermissionForFeature',
                !isFutureDay(this.form['dateStart'].$modelValue) ||
                this.AuthService.isActivityPlan() ||
                this.item.activity.view.isTrainingPlan ||
                (!this.item.activity.auth.isOwner && this.AuthService.isActivityPlanAthletes()));

                //!this.item.isOwner || this.AuthService.isActivityPlan() ||
                //(this.item.isOwner && (!isFutureDay(this.form['dateStart'].$modelValue) || (this.form['dateStart'].$modelValue))));
        }

    }

    /**
     * Расчет процента выполнения тренировки
     * Процент берется как среднеарифметическое от план/факт выполнения. Для расчета берутся только значения
     * 1) которые есть в фильтре задания
     * 2) по которым есть план
     */
    calculateCompletePercent():number {

        return ((this.plan.durationMeasure && this.plan.intensityMeasure) &&
            this.percentComplete[this.plan.durationMeasure] * this.percentComplete[this.plan.intensityMeasure] ) ||
            (this.plan.durationMeasure && this.percentComplete[this.plan.durationMeasure]) ||
            (this.plan.intensityMeasure && this.percentComplete[this.plan.intensityMeasure]) || null;
    }

    changeStructuredMode(){
        this.item.structuredMode ? this.item.selectedTab = HeaderStructuredTab.Segments : angular.noop();
    }

    clearTemplate() {
        this.item.activity.header.template = null;
    }

    private updateForm() {
        this.onChange({plan: this.plan, actual: this.actual, form: this.form});
    }

}

const AssignmentSummaryNonStructuredComponent:IComponentOptions = {
    bindings: {
        sport: '<',
        form: '<', // item.assignmentForm
        editable: '<', // возможность редактирования
        ftpMode: '<', // режим ввода абсолютные/относительные значения интенсивности
        change: '<', // индикатор изменения данных
        onChange: '&'
    },
    require: {
        item: '^calendarItemActivity'
    },
    controller: AssignmentSummaryNonStructuredCtrl,
    template: require('./assignment-summary-non-structured.component.html') as string
};

export default AssignmentSummaryNonStructuredComponent;