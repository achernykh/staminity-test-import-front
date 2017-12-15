import './training-season-data.component.scss';
import { IComponentOptions, IComponentController, IFilterService } from 'angular';
import { TrainingSeasonData } from "./training-season-data.datamodel";
import { TrainingSeason } from "@app/training-season/training-season/training-season.datamodel";
import { IMesocycle, IMicrocycle, IPeriodizationScheme } from "../../../../api/seasonPlanning/seasonPlanning.interface";
import { TrainingSeasonService } from "../training-season.service";
import { Microcycle } from "../training-season/training-season-microcycle.datamodel";
import { PeriodizationService } from "../../methodology/periodization/periodization.service";
import { IUserProfile } from "@api/user";
import { ICalendarItemDialogOptions } from "@app/calendar-item/calendar-item-dialog.interface";
import { FormMode } from "../../application.interface";

class TrainingSeasonDataCtrl implements IComponentController {

    data: TrainingSeasonData;
    currentUser: IUserProfile;
    owner: IUserProfile;
    onEvent: (response: Object) => Promise<void>;

    // private
    private selected: Array<any> = [];
    private schemes: Array<IPeriodizationScheme>;
    private update: number = 0;
    private itemOptions: ICalendarItemDialogOptions;

    static $inject = [ '$mdEditDialog', '$filter', 'TrainingSeasonService', 'PeriodizationService' ];

    constructor (
        private $mdEditDialog: any,
        private $filter: IFilterService,
        private trainingSeason: TrainingSeasonService,
        private periodizationService: PeriodizationService) {

    }

    $onInit () {
        this.itemOptions = {
            currentUser: this.currentUser,
            owner: this.owner,
            popupMode: true,
            formMode: FormMode.View,
            trainingPlanMode: false,
            planId: null
        };

    }

    $onChanges (changes): void {
        if (changes.hasOwnProperty('data') && !changes.data.isFirstChange() && this.data) {
            this.update ++;
            this.prepareScheme();
        }
    }

    private prepareScheme (): void {
        this.periodizationService.get()
            .then(result => this.schemes = result.arrayResult)
            // Если у пользователя нет Схемы периодизации, то добавляем ему для возможности редактирования
            .then(() => !this.schemes.some(s => s.id === this.data.season.periodizationScheme.id) &&
                this.schemes.push(this.data.season.periodizationScheme));
    }

    getMesocycles(): Array<IMesocycle> {
        if (this.schemes && this.data.season) {
            return this.schemes.filter(s => s.id === this.data.season.periodizationScheme.id)[0].mesocycles;
        }
    }

    getMesocycle (id: string | number): IMesocycle {
        if (this.schemes && id) {
            return this.schemes
                .filter(s => s.id === this.data.season.periodizationScheme.id)[0]
                .mesocycles.filter(m => m.id === Number(id))[0];
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

        this.update ++;
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
            placeholder: this.$filter('translate')(`trainingSeason.inputPlaceholder.${cycle.durationMeasure}`),
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
        currentUser: '<',
        owner: '<',
        onEvent: '&'
    },
    controller: TrainingSeasonDataCtrl,
    template: require('./training-season-data.component.html') as string
};
