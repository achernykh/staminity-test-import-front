import {IComponentOptions, IComponentController, IQService, IFilterService, IPromise, INgModelController, copy} from 'angular';
import './assignment.component.scss';
import {IActivityMeasure, ICalcMeasures, IActivityIntervalPW} from "../../../../../api/activity/activity.interface";
import {isDuration, isPace, measurementUnit, measurementUnitDisplay, validators} from "../../../share/measure/measure.constants";
import moment from 'moment/src/moment.js';
import {ACTIVITY_TYPE, ACTIVITY_CATEGORY} from "../../../activity/activity.constants";
import {Activity} from "../../activity.datamodel";
import {ActivityHeaderCtrl} from "../../activity-header/activity-header.component";
import {CalendarItemActivityCtrl} from "../../../calendar-item/calendar-item-activity/calendar-item-activity.component";

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
    public onChange: (result: {plan: IActivityIntervalPW, actual: ICalcMeasures, valid: boolean}) => IPromise<void>;

    private selected:Array<number> = [];
    private assignmentForm: INgModelController;
    private percentComplete: Object = {};
    private valueType: {};
    private types: Array<Object> = ACTIVITY_TYPE;
    private categories: Array<Object> = ACTIVITY_CATEGORY;

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
    private filter: Array<string> = ['movingDuration','distance','heartRate', 'speed', 'power'];

    static $inject = ['$scope','$mdEditDialog','$q','$filter'];

    constructor(private $scope: any, private $mdEditDialog: any, private $q: IQService, private $filter: any) {
        // Пришлось добавить $scope, так как иначе при использования фильтра для ng-repeat в функции нет доступа к
        // this, а значит и нет доступа к массиву для фильтрации
        this.$scope.measure = ['movingDuration','distance','heartRate', 'speed'];
        this.valueType = {
            movingDuration: 'maxValue',
            distance: 'maxValue',
            heartRate: 'avgValue',
            speed: 'avgValue'
        };
        this.$scope.search = (measure) => this.$scope.measure.indexOf(measure.$key) !== -1;
    }

    $onInit() {
        console.log('assignment=', this);
    }

    isInterval(key) {
        return ['speed','heartRate','power'].indexOf(key) !== -1;
    }

    changeValue(key) {
        if(!!!key) {
            return;
        }

        let percent: number = null;
        let p = (this.plan[key].hasOwnProperty('value') && this.plan[key].value) ||
            (this.plan[key].hasOwnProperty('from') && this.plan[key]) || null;
        let a = this.actual[key][this.valueType[key]] || null;

        if(!!p && !!a ){
            let isInterval = p.hasOwnProperty('from');
            //TODO сделать метод для определния велечин с обратным счетом
            if(isInterval && key === 'speed') {
                percent = ((a <= p.to) && a/p.to) || ((a >= p.from) && a/p.from);
            } else {
                percent = (!isInterval && a/p) ||
                    ((isInterval && a <= p.from) && a/p.from) || ((isInterval && a >= p.to) && a/p.to);
            }
        } else { // если план или факт не введены, то очищаем расчет процента
            percent = null;
        };

        this.percentComplete[key] = percent;
        this.calculateCompletePercent();
        this.onChange({plan: this.plan, actual: this.actual, valid: this.assignmentForm.$valid});

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
    calculateCompletePercent() {

        this.actual.completePercent.value = Object.keys(this.percentComplete)
            .filter(m => this.percentComplete[m] >= 0)
                .map(m => this.percentComplete[m])
                .reduce((percent, value, i, arr) => (percent + value) / arr.length) * 100;

        //this.assignment.intervalW.completePercent.value.toFixed(0);

        console.log('set complete percent=', this.actual.completePercent.value);
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