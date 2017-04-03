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

enum FtpState {
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
            swim: ['movingDuration','distance', 'speed'],
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

    convertToFTP(measure, data, interval: boolean = true){
        debugger;
        let FTP = this.getFTP(measure, this.sport);
        return interval ? Object.assign(data, {
            [this.from]: data[this.from] * 100 / FTP,
            [this.to]: data[this.to] * 100 / FTP
        }) : data * 100 / FTP;
    }

    convertFromFTP(){

    }

    getFTP(measure: string, sport: string = this.sport):number {
        let zones = this.item.currentUser.trainingZones;
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
        this.plan.durationMeasure = (!!this.plan.distance.value && 'distance') ||
            (!!this.plan.movingDuration.value && 'movingDuration') || null;
        this.plan.durationValue =
            (this.plan[this.plan.durationMeasure] && this.plan[this.plan.durationMeasure].value) || null;

        this.plan.intensityMeasure = (!!this.plan.heartRate[this.from] && 'heartRate') ||
            (!!this.plan.speed[this.from] && 'speed') || (!!this.plan.power[this.from] && 'power') || null;

        this.plan.intensityLevelFrom =
            (this.plan[this.plan.intensityMeasure] && this.plan[this.plan.intensityMeasure][this.from]) || null;
        this.plan.intensityLevelTo =
            (this.plan[this.plan.intensityMeasure] && this.plan[this.plan.intensityMeasure][this.to]) || null;
    }

    calcPercent(key: string): number {

        let plan = (this.plan[key].hasOwnProperty('durationValue') && this.plan[key].durationValue) ||
            (this.plan[key][this.from] === this.plan[key][this.to] && this.plan[key][this.from]) ||
            (this.plan[key][this.from] !== this.plan[key][this.to] && this.plan[key]) || null;

        let actual = (this.actual.hasOwnProperty(key) && this.actual[key][this.valueType[key]]) || null;

        // для расчета процента необходимо наличие плана и факта по позиции
        if(!!plan && !!actual){
            if (typeof plan !== 'object') {
                return actual / plan;
            } else if (key === 'speed') { //TODO сделать метод для определния велечин с обратным счетом
                return  ((actual <= plan[this.from] && actual >= plan[this.to]) && 1) ||
                        ((actual <= plan[this.to]) && actual/plan[this.to]) ||
                        ((actual >= plan[this.from]) && actual/plan[this.from]);
            } else {
                return  ((actual >= plan[this.from] && actual <= plan[this.to]) && 1) ||
                        ((actual >= plan[this.to]) && actual/plan[this.to]) ||
                        ((actual <= plan[this.from]) && actual/plan[this.from]);
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
                    !(this.form['plan_heartRate'].$modelValue[this.from] > 0 &&
                    this.form['plan_speed'].$modelValue[this.from] > 0));
            }

            if (this.form['plan_speed'] && this.form['plan_heartRate']) {
                this.form['plan_speed'].$setValidity('singleIntensity',
                    !(this.form['plan_heartRate'].$modelValue[this.from] > 0 &&
                    this.form['plan_speed'].$modelValue[this.from] > 0));
            }
        }

        this.form['dateStart'].$setValidity('needPermissionForFeature',
            !isFutureDay(this.form['dateStart'].$modelValue) ||
            (this.form['dateStart'].$modelValue && this.AuthService.isActivityPlan()));

    }

    updateForm() {
        this.onChange({plan: this.plan, actual: this.actual, form: this.form});
    }

    measurePercentComplete() {

    }

    editComment (event, assignment) {
        event.stopPropagation(); // in case autoselect is enabled

        console.log('change item = ', event, assignment);

        let editDialog = {
            modelValue: this.$filter('measureEdit')(assignment.sourceMeasure, assignment[this.valueType[assignment.sourceMeasure]], this.sport),
            clickOutsideToClose: true,
            placeholder: assignment.code,
            save: (input) => {
                /*if(input.$modelValue === 'Donald Trump') {
                    input.$invalid = true;
                    return this.$q.reject();
                }
                if(input.$modelValue === 'Bernie Sanders') {
                    return assignment.comment = 'FEEL THE BERN!';
                }*/
                debugger;
                assignment[this.valueType[assignment.code]] = this.$filter('measureSave')(assignment.code,input.$modelValue, this.sport);
                //if (event.target.className.search('intervalW') !== -1) {
                    this.calculateCompletePercent();
                //}
                //this.onChange({upd: this.assignment});
            },

            targetEvent: event,
            //title: 'Add a comment',
            type: isDuration(measurementUnitDisplay(this.sport, assignment.sourceMeasure)) ||
                isPace(measurementUnitDisplay(this.sport, assignment.sourceMeasure)) ? 'time' : 'number',
            validators: validators(this.sport, assignment.sourceMeasure)
        };

        let promise;

        if(this.options.largeEditDialog) {
            promise = this.$mdEditDialog.large(editDialog);
        } else {
            promise = this.$mdEditDialog.small(editDialog);
        }

        promise.then(function (ctrl) {
            var input = ctrl.getInput();

            input.$viewChangeListeners.push(function () {
                input.$setValidity('test', input.$modelValue !== 'test');
            });
        });
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
            (!this.plan.intensityMeasure && this.percentComplete[this.plan.durationMeasure]) || null;

        /*let percent: Array<number> = Object.keys(this.percentComplete)
            .filter(m => !!this.percentComplete[m])
            .map(m => this.percentComplete[m]);

        if (percent && percent.length) {
            return percent.reduce((percent, value, i, arr) => {
                console.log('calculateCompletePercent', percent, value, arr);
                return (percent + value) / arr.length;
            });
        }*/
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