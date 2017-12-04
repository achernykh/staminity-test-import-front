import './training-season-data.component.scss';
import { IComponentOptions, IComponentController, IPromise } from 'angular';
import { TrainingSeasonData } from "./training-season-data.datamodel";
import { TrainingSeason } from "@app/training-season/training-season/training-season.datamodel";
import { IMesocycle, IMicrocycle, IPeriodizationScheme } from "../../../../api/seasonPlanning/seasonPlanning.interface";
import { TrainingSeasonService } from "../training-season.service";
import { Microcycle } from "../training-season/training-season-microcycle.datamodel";
import { PeriodizationService } from "../../methodology/periodization.service";

class TrainingSeasonDataCtrl implements IComponentController {

    public data: TrainingSeasonData;
    public onEvent: (response: Object) => IPromise<void>;

    // private
    private selected: Array<any> = [];
    private schemes: Array<IPeriodizationScheme>;

    static $inject = [ '$mdEditDialog', 'TrainingSeasonService', 'PeriodizationService' ];

    constructor (
        private $mdEditDialog: any,
        private trainingSeason: TrainingSeasonService,
        private periodizationService: PeriodizationService) {

    }

    $onInit () {
        this.periodizationService.get().then(result => this.schemes = result.arrayResult);
    }

    getMesocycles(): Array<IMesocycle> {
        if (this.schemes && this.data.season) {
            return this.schemes.filter(s => s.id === this.data.season.periodizationScheme.id)[0].mesocycles;
        }
    }

    change (cycle: Microcycle): void {
        if ( !cycle.mesocycle.id ) { return; }

        if ( cycle.id ) {
            this.trainingSeason.putItem(cycle.prepare())
                .then(result => cycle.applyRevision(result));
        } else {
            this.trainingSeason.postItem(this.data.season.id, cycle.prepare())
                .then(result => cycle.applyRevision(result));
        }
    }

    getWeekCount (pos: number): number {
        let count: number = 1;

        while (pos !== 0 && this.data.grid[pos].mesocycle.id &&
            this.data.grid[pos].mesocycle.id === this.data.grid[pos-1].mesocycle.id) {
            count ++;
            pos --;
        }

        return count;
    }

    editDurationValue (event: Event, cycle: any): void {

        let _this = this;
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
                _this.change(cycle);
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
