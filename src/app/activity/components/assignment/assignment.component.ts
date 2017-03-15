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

    }
    isInterval(key) {
        return ['speed','heartRate','power'].indexOf(key) !== -1;
    }

    changeValue(key) {
        if(!!!key) {
            return;
        }
        this.validateForm();
        let percent: number = this.calcPercent(key); // расчет процента выполнения по позиции плана
        this.percentComplete[key] = percent; // обновляем view model

        this.plan.durationMeasure = (!!this.plan.distance.value && 'distance') ||
            (!!this.plan.movingDuration.value && 'movingDuration') || null;
        this.plan.durationValue =
            (this.plan[this.plan.durationMeasure] && this.plan[this.plan.durationMeasure].value) || null;

        this.plan.intensityMeasure = (!!this.plan.heartRate['from'] && 'heartRate') ||
            (!!this.plan.speed['from'] && 'speed') || (!!this.plan.power['from'] && 'power') || null;

        this.plan.intensityLevelFrom =
            (this.plan[this.plan.intensityMeasure] && this.plan[this.plan.intensityMeasure]['from']) || null;
        this.plan.intensityLevelTo =
            (this.plan[this.plan.intensityMeasure] && this.plan[this.plan.intensityMeasure]['to']) || null;
        debugger;
        this.plan.calcMeasures.completePercent.value = this.calculateCompletePercent(); // расчет итогового процента по тренировке
        this.onChange({plan: this.plan, actual: this.actual, form: this.assignmentForm});
    }

    calcPercent(key: string): number {

        let plan = (this.plan[key].hasOwnProperty('value') && this.plan[key].value) ||
            (this.plan[key]['from'] === this.plan[key]['to'] && this.plan[key]['from']) ||
            (this.plan[key]['from'] !== this.plan[key]['to'] && this.plan[key]) || null;

        let actual = (this.actual.hasOwnProperty(key) && this.actual[key][this.valueType[key]]) || null;

        // для расчета процента необходимо наличие плана и факта по позиции
        if(!!plan && !!actual){
            if (typeof plan !== 'object') {
                return actual / plan;
            } else if (key === 'speed') { //TODO сделать метод для определния велечин с обратным счетом
                return  ((actual <= plan.from && actual >= plan.to) && 1) ||
                        ((actual <= plan.to) && actual/plan.to) ||
                        ((actual >= plan.from) && actual/plan.from);
            } else {
                return  ((actual >= plan.from && actual <= plan.to) && 1) ||
                        ((actual >= plan.to) && actual/plan.to) ||
                        ((actual <= plan.from) && actual/plan.from);
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

        //console.log('check date',isFutureDay(this.assignmentForm['dateStart'].$modelValue),this.AuthService.isActivityPlan());
        //console.log('check role date',isFutureDay(this.assignmentForm['dateStart'].$modelValue) && this.AuthService.isActivityPlan());

        if (this.assignmentForm.hasOwnProperty('plan_distance')) {
            this.assignmentForm['plan_distance'].$setValidity('needDuration',
                this.assignmentForm['plan_distance'].$modelValue > 0 ||
                this.assignmentForm['plan_movingDuration'].$modelValue > 0 ||
                this.assignmentForm['actual_distance'].$modelValue > 0 ||
                this.assignmentForm['actual_movingDuration'].$modelValue > 0);

            this.assignmentForm['plan_movingDuration'].$setValidity('needDuration',
                this.assignmentForm['plan_distance'].$modelValue > 0 ||
                this.assignmentForm['plan_movingDuration'].$modelValue > 0 ||
                this.assignmentForm['actual_distance'].$modelValue > 0 ||
                this.assignmentForm['actual_movingDuration'].$modelValue > 0);

            /*this.assignmentForm['plan_heartRate'].$setValidity('needIntensity',
             this.assignmentForm['plan_heartRate'].$modelValue['from'] > 0 ||
             this.assignmentForm['plan_speed'].$modelValue['from'] > 0);

             this.assignmentForm['plan_speed'].$setValidity('needIntensity',
             this.assignmentForm['plan_heartRate'].$modelValue['from'] > 0 ||
             this.assignmentForm['plan_speed'].$modelValue['from'] > 0);*/

            // Пользователь может указать или расстояние, или время
            this.assignmentForm['plan_distance'].$setValidity('singleDuration',
                !(this.assignmentForm['plan_distance'].$modelValue > 0 && this.assignmentForm['plan_movingDuration'].$modelValue > 0));
            this.assignmentForm['plan_movingDuration'].$setValidity('singleDuration',
                !(this.assignmentForm['plan_distance'].$modelValue > 0 && this.assignmentForm['plan_movingDuration'].$modelValue > 0));

            // Пользователь может указать только один парметр интенсивности
            if (this.assignmentForm['plan_heartRate'] && this.assignmentForm['plan_speed']) {
                this.assignmentForm['plan_heartRate'].$setValidity('singleIntensity',
                    !(this.assignmentForm['plan_heartRate'].$modelValue['from'] > 0 &&
                    this.assignmentForm['plan_speed'].$modelValue['from'] > 0));
            }

            if (this.assignmentForm['plan_speed'] && this.assignmentForm['plan_heartRate']) {
                this.assignmentForm['plan_speed'].$setValidity('singleIntensity',
                    !(this.assignmentForm['plan_heartRate'].$modelValue['from'] > 0 &&
                    this.assignmentForm['plan_speed'].$modelValue['from'] > 0));
            }
        }

        this.assignmentForm['dateStart'].$setValidity('needPermissionForFeature',
            !isFutureDay(this.assignmentForm['dateStart'].$modelValue) ||
            (this.assignmentForm['dateStart'].$modelValue && this.AuthService.isActivityPlan()));

    }

    updateForm() {
        this.onChange({plan: this.plan, actual: this.actual, form: this.assignmentForm});
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
            this.percentComplete[this.plan.durationMeasure] * this.percentComplete[this.plan.intensityMeasure] ) || null;

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
        editable: '<',
        onChange: '&'
    },
    controller: ActivityAssignmentCtrl,
    template: require('./assignment.component.html') as string
};

export default ActivityAssignmentComponent;