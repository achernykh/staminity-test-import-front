import {IComponentOptions, IComponentController, IQService, IFilterService, IPromise, INgModelController, copy} from 'angular';
import './assignment.component.scss';
import {IActivityMeasure, ICalcMeasures, IActivityIntervalPW} from "../../../../../api/activity/activity.interface";
import {isDuration, isPace, measurementUnit, measurementUnitDisplay, validators} from "../../../share/measure/measure.constants";
import {Activity} from "../../activity.datamodel";
import {ActivityHeaderCtrl} from "../../activity-header/activity-header.component";
import {CalendarItemActivityCtrl} from "../../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import moment from 'moment/src/moment.js';
import {IAuthService} from "../../../auth/auth.service";

const isFutureDay = (day) => moment(day, 'YYYY-MM-DD').startOf('day').diff(moment().startOf('day'), 'd') > 0;

export enum FtpState {
    On,
    Off
}

class ActivityAssignmentCtrl implements IComponentController {

    private item: CalendarItemActivityCtrl;
    public activity: Activity;
    public assignment: {
        intervalPW: ICalcMeasures;
        intervalW: ICalcMeasures;
    };
    public plan: IActivityIntervalPW;
    public actual: ICalcMeasures;
    public sport: string;
    public form: INgModelController;
    public ftpMode: number = FtpState.Off;
    public FTPMeasures: Array<string> = ['heartRate', 'speed', 'power'];
    public from: string = 'intensityLevelFrom' || 'intensityByFtpFrom';
    public to: string = 'intensityLevelTo' || 'intensityByFtpTo';
    private readonly index: any = [{from: 'intensityByFtpFrom', to: 'intensityByFtpTo'},{from: 'intensityLevelFrom', to: 'intensityLevelTo'}];
    private readonly structuredMeasure: any = {
        movingDuration: {
            length: 'movingDurationLength',
            approx: 'movingDurationApprox'
        },
        distance: {
            length: 'distanceLength',
            approx: 'distanceApprox'
        }
    };

    public onChange: (result: {plan: IActivityIntervalPW, actual: ICalcMeasures, form: INgModelController}) => IPromise<void>;

    private selected:Array<number> = [];
    private assignmentForm: INgModelController;
    private percentComplete: Object = {};
    private valueType: {};

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
    //private filter: Array<string> = ['movingDuration','distance','heartRate', 'speed', 'power'];

    static $inject = ['$scope','$mdEditDialog','$q','$filter','AuthService'];

    constructor(
        private $scope: any,
        private $mdEditDialog: any,
        private $q: IQService,
        private $filter: any,
        private AuthService: IAuthService) {
        // Пришлось добавить $scope, так как иначе при использования фильтра для ng-repeat в функции нет доступа к
        // this, а значит и нет доступа к массиву для фильтрации
        this.$scope.measure = {
            swim: ['movingDuration','distance', 'heartRate','speed'],
            bike: ['movingDuration','distance','heartRate', 'speed','power'],
            run: ['movingDuration','distance','heartRate', 'speed'],
            strength: ['movingDuration','distance','heartRate'],
            transition: ['movingDuration','distance','heartRate', 'speed'],
            ski: ['movingDuration','distance','heartRate', 'speed'],
            other: ['movingDuration','distance','heartRate', 'speed'],
            default: ['movingDuration','distance','heartRate', 'speed'],
        };
        //
        this.valueType = {
            movingDuration: 'value',
            distance: 'value',
            heartRate: 'avgValue',
            speed: 'avgValue',
            power: 'avgValue'
        };
        this.$scope.search = (measure) => this.$scope.measure[this.item.activity.sportBasic || 'default'].indexOf(measure.$key) !== -1;
    }

    $onInit() {
        // расчет процента по позициям планогово задания в тренировке
        this.$scope.measure[this.item.activity.sportBasic || 'default'].forEach(key => {
            this.percentComplete[key] = this.calcPercent(key) || null;
        });

        this.prepareValues();

    }

    prepareValues() {
        if(this.ftpMode) {
            this.from = 'intensityByFtpFrom';
            this.to = 'intensityByFtpTo';
            /*Object.keys(this.plan)
                .filter(m => this.FTPMeasures.indexOf(m) !== -1)
                .forEach(m => this.plan[m][this.from] ? this.plan[m] = this.convertToFTP(m,this.plan[m]) : ()=>{});*/

            /*Object.keys(this.actual)
                .filter(m => this.FTPMeasures.indexOf(m) !== -1)
                .forEach(m => this.actual[m][this.from] ? this.actual[m] = this.convertToFTP(m,this.actual[m],false) : ()=>{});*/

            //this.$scope.$apply();
        } else {
            this.from = 'intensityLevelFrom';
            this.to = 'intensityLevelTo';
        }
    }

    ftpModeChange(mode: FtpState) {
        this.ftpMode = mode;
        this.prepareValues();
    }

    isFTP() {
        return this.ftpMode === FtpState.On;
    }

    isInterval(key) {
        return ['speed','heartRate','power'].indexOf(key) !== -1;
    }

    getFTP(measure: string, sport: string = this.sport):number {
        let zones = this.item.user.trainingZones;
        return (this.isInterval(measure) && 0) ||
            (zones.hasOwnProperty(measure) && zones[measure].hasOwnProperty(sport) && zones[measure][sport]['FTP']) ||
            (zones.hasOwnProperty(measure) && zones[measure].hasOwnProperty('default') && zones[measure]['default']['FTP']) || null;
    }

    changeValue(key) {
        if(!!!key) {
            return;
        }

        //debugger;

        this.validateForm();
        this.ftpMode === FtpState.Off ? this.completeFtpMeasure(key) : this.completeAbsoluteMeasure(key);
        this.prepareDataForUpdate();
        this.percentComplete[key] = this.calcPercent(key); // обновляем view model
        this.plan.calcMeasures.completePercent.value = this.calculateCompletePercent(); // расчет итогового процента по тренировке
        this.onChange({plan: this.plan, actual: this.actual, form: this.form});
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
        this.plan.durationMeasure = (!!this.plan.distance['durationValue'] && 'distance') ||
            (!!this.plan.movingDuration['durationValue'] && 'movingDuration') || null;

        this.plan.durationValue =
            (this.plan[this.plan.durationMeasure] && this.plan[this.plan.durationMeasure]['durationValue']) || null;

        this.plan.intensityMeasure = (!!this.plan.heartRate[this.index[FtpState.Off]['from']] && 'heartRate') ||
            (!!this.plan.speed[this.index[FtpState.Off]['from']] && 'speed') ||
            (!!this.plan.power[this.index[FtpState.Off]['from']] && 'power') || null;

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
        setTimeout(()=>{
            this.validateForm();
            this.updateForm();
        }, 100);
    }

    validateForm() {

        //console.log('check date',isFutureDay(this.form['dateStart'].$modelValue),this.AuthService.isActivityPlan());
        //console.log('check role date',isFutureDay(this.form['dateStart'].$modelValue) && this.AuthService.isActivityPlan());

        if (this.form.hasOwnProperty('plan_distance')) {
            this.form['plan_distance'].$setValidity('needDuration',
                this.form['plan_distance'].$modelValue > 0 ||
                this.form['plan_movingDuration'].$modelValue > 0 ||
                this.form['actual_distance'].$modelValue > 0 ||
                this.form['actual_movingDuration'].$modelValue > 0);

            this.form['plan_movingDuration'].$setValidity('needDuration',
                this.form['plan_distance'].$modelValue > 0 ||
                this.form['plan_movingDuration'].$modelValue > 0 ||
                this.form['actual_distance'].$modelValue > 0 ||
                this.form['actual_movingDuration'].$modelValue > 0);

            /*this.form['plan_heartRate'].$setValidity('needIntensity',
             this.form['plan_heartRate'].$modelValue[this.from] > 0 ||
             this.form['plan_speed'].$modelValue[this.from] > 0);

             this.form['plan_speed'].$setValidity('needIntensity',
             this.form['plan_heartRate'].$modelValue[this.from] > 0 ||
             this.form['plan_speed'].$modelValue[this.from] > 0);*/

            // Пользователь может указать или расстояние, или время
            this.form['plan_distance'].$setValidity('singleDuration',
                !(this.form['plan_distance'].$modelValue > 0 && this.form['plan_movingDuration'].$modelValue > 0));
            this.form['plan_movingDuration'].$setValidity('singleDuration',
                !(this.form['plan_distance'].$modelValue > 0 && this.form['plan_movingDuration'].$modelValue > 0));

            // Пользователь может указать только один парметр интенсивности
            if (this.form['plan_heartRate'] && this.form['plan_speed']) {
                this.form['plan_heartRate'].$setValidity('singleIntensity',
                    !(this.form['plan_heartRate'].$modelValue[this.index[FtpState.Off]['from']] > 0 &&
                    this.form['plan_speed'].$modelValue[this.index[FtpState.Off]['from']] > 0));
            }

            if (this.form['plan_speed'] && this.form['plan_heartRate']) {
                this.form['plan_speed'].$setValidity('singleIntensity',
                    !(this.form['plan_heartRate'].$modelValue[this.index[FtpState.Off]['from']] > 0 &&
                    this.form['plan_speed'].$modelValue[this.index[FtpState.Off]['from']] > 0));
            }
        }

        this.form['dateStart'].$setValidity('needPermissionForFeature',
            !isFutureDay(this.form['dateStart'].$modelValue) ||
            (this.form['dateStart'].$modelValue && this.AuthService.isActivityPlan()));

    }

    updateForm() {
        this.onChange({plan: this.plan, actual: this.actual, form: this.form});
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

}

const ActivityAssignmentComponent:IComponentOptions = {
    require: {
        item: '^calendarItemActivity'
    },
    bindings: {
        plan: '<',
        actual: '<',
        sport: '<',
        form: '<',
        editable: '<',
        onChange: '&'
    },
    controller: ActivityAssignmentCtrl,
    template: require('./assignment.component.html') as string
};

export default ActivityAssignmentComponent;