import {IComponentOptions, IComponentController, IQService, IFilterService} from 'angular';
import './assignment.component.scss';
import {IActivityMeasure} from "../../../../api/activity/activity.interface";
import {isDuration, isPace, measurementUnit, measurementUnitDisplay, validators} from "../../share/measure.constants";
import moment from 'moment/src/moment.js';

class ActivityAssignmentCtrl implements IComponentController {

    private assignement: {
        intervalPW: Array<IActivityMeasure>;
        intervalW: Array<IActivityMeasure>;
    };
    private sport: string;
    private selected:Array<number> = [];
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
        largeEditDialog: true,
        boundaryLinks: false,
        limitSelect: false,
        pageSelect: false
    };
    private query:Object = {
        order: 'code',
        limit: 5,
        page: 1
    };
    private filter: Array<string> = ['heartRate', 'speed', 'cadence', 'elevationGain'];

    static $inject = ['$mdEditDialog','$q','$filter'];

    constructor(private $mdEditDialog: any, private $q: IQService, private $filter: any) {

    }

    $onInit() {
        this.assignement = {
            intervalPW : [
                {
                    code: 'movingDuration',
                    value: 60*60
                },
                {
                    code: 'distance',
                    value: 10*1000
                },
                {
                    code: 'heartRate',
                    value: null
                },
                {
                    code: 'speed',
                    value: null
                }
            ],
            intervalW: [
                {
                    code: 'movingDuration',
                    value: 62*60
                },
                {
                    code: 'distance',
                    value: 11*1000
                },
                {
                    code: 'heartRate',
                    value: 175
                },
                {
                    code: 'speed',
                    value: 3
                }
            ],
        };

        this.sport = 'run';
    }

    percentComplete(value1,value2) {
        return ((!!value1 && !!value2) && (value2 / value1) * 100) || null;
    }

    editComment (event, assignment) {
        event.stopPropagation(); // in case autoselect is enabled

        let editDialog = {
            modelValue: this.$filter('measureEdit')(assignment.code, assignment.value, this.sport),
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
                assignment.value = this.$filter('measureSave')(assignment.code,input.$modelValue, this.sport);
            },

            targetEvent: event,
            //title: 'Add a comment',
            type: isDuration(measurementUnitDisplay(this.sport, assignment.code)) ||
                isPace(measurementUnitDisplay(this.sport, assignment.code)) ? 'time' : 'number',
            validators: validators(this.sport, assignment.code)
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

}

const ActivityAssignmentComponent:IComponentOptions = {
    bindings: {
        assignement: '<',
        sport: '<'
    },
    controller: ActivityAssignmentCtrl,
    template: require('./assignment.component.html') as string
};

export default ActivityAssignmentComponent;