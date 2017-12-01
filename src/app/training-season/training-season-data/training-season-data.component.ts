import './training-season-data.component.scss';
import { IComponentOptions, IComponentController, IPromise } from 'angular';
import { TrainingSeasonData } from "./training-season-data.datamodel";
import { TrainingSeason } from "@app/training-season/training-season/training-season.datamodel";

class TrainingSeasonDataCtrl implements IComponentController {

    public data: TrainingSeasonData;
    public onEvent: (response: Object) => IPromise<void>;

    // private
    private selected: Array<any> = [];
    private readonly mesocycles: Array<{ code: string; color: string }> = [
        {
            code: 'base',
            color: '#000000'
        },
        {
            code: 'build',
            color: '#000000'
        },
        {
            code: 'prepare',
            color: '#000000'
        },
        {
            code: 'transition',
            color: '#000000'
        }
    ];

    static $inject = [ '$mdEditDialog' ];

    constructor (private $mdEditDialog: any) {

    }

    $onInit () {

    }

    getWeekCount (pos: number): number {
        let count: number = 1;

        while (pos !== 0 && this.data.grid[pos].mesocycle === this.data.grid[pos-1].mesocycle) {
            count ++;
            pos --;
        }

        return count;
    }

    editDurationValue (event: Event, cycle: any): void {

        event.stopPropagation(); // in case autoselect is enabled

        let editDialog = {
            modelValue: cycle.durationValue,
            placeholder: 'Add a comment',
            save: function (input) {
                if (input.$modelValue === 'Donald Trump') {
                    input.$invalid = true;
                    //return Promise.reject();
                    throw new Error('');
                }
                if (input.$modelValue === 'Bernie Sanders') {
                    return cycle.durationValue = 'FEEL THE BERN!';
                }
                cycle.durationValue = input.$modelValue;
            },
            targetEvent: event,
            title: 'Add a comment',
            validators: {
                'type': 'number'//,
                //'md-maxlength': 30
            }
        };

        let promise: Promise<any>;
        //promise = this.$mdEditDialog.large(editDialog);
        promise = this.$mdEditDialog.small(editDialog);

        promise.then(function (ctrl) {
            let input = ctrl.getInput();
            input.$viewChangeListeners.push(function () {
                input.$setValidity('test', input.$modelValue !== 'test');
            });
        });
    }
}

export const TrainingSeasonDataComponent: IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingSeasonDataCtrl,
    template: require('./training-season-data.component.html') as string
};
