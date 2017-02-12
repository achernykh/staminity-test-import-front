import {IComponentOptions, IComponentController, IQService, IFilterService, IPromise, copy} from 'angular';
import './assignment.component.scss';
import {IActivityMeasure, ICalcMeasures, IActivityIntervalPW} from "../../../../api/activity/activity.interface";
import {isDuration, isPace, measurementUnit, measurementUnitDisplay, validators} from "../../share/measure/measure.constants";
import moment from 'moment/src/moment.js';

class ActivityAssignmentCtrl implements IComponentController {

    public assignment: {
        intervalPW: ICalcMeasures;
        intervalW: ICalcMeasures;
    };
    public plan: IActivityIntervalPW;
    public actual: ICalcMeasures;
    public sport: string;
    public onChange: (result: {upd: {intervalPW: ICalcMeasures, intervalW: ICalcMeasures}}) => IPromise<void>;

    private selected:Array<number> = [];
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
    private filter: Array<string> = ['movingDuration','distance','heartRate', 'speed'];

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
        this.sport = 'run';
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
                this.onChange({upd: this.assignment});
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

        this.assignment.intervalW.completePercent.value = this.$scope.measure
                .filter(m => !!this.assignment.intervalPW[m][this.valueType[m]])
                .map(m => (!!this.assignment.intervalW[m][this.valueType[m]] &&
                    this.assignment.intervalW[m][this.valueType[m]] / this.assignment.intervalPW[m][this.valueType[m]]) || 0)
                .reduce((percent, value, i, arr) => (percent + value) / arr.length) * 100;

        this.assignment.intervalW.completePercent.value.toFixed(0);

        console.log('set complete percent=', this.assignment.intervalW.completePercent.value);
    }

}

const ActivityAssignmentComponent:IComponentOptions = {
    bindings: {
        plan: '<',
        actual: '<',
        sport: '<',
        onChange: '&'
    },
    controller: ActivityAssignmentCtrl,
    template: require('./assignment.component.html') as string
};

export default ActivityAssignmentComponent;