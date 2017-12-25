import './training-season-data.component.scss';
import { IComponentOptions, IComponentController, IFilterService, copy, IScope } from 'angular';
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
    recalculate: number;
    onEvent: (response: Object) => Promise<void>;

    // private
    cycles: TrainingSeasonData;
    private selected: Array<any> = [];
    private schemes: Array<IPeriodizationScheme>;
    private update: number = 0;
    private itemOptions: ICalendarItemDialogOptions;

    static $inject = ['$scope', '$mdEditDialog', '$filter', 'TrainingSeasonService', 'PeriodizationService' ];

    constructor (
        private $scope: IScope,
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
            trainingPlanMode: false
        };
    }

    $onChanges (changes): void {
        if (changes.hasOwnProperty('data') && this.data) {
            this.schemes = [];
            this.schemes.push(this.data.season.periodizationScheme);
            this.cycles = copy(this.data);
            this.update ++;
            //this.prepareScheme();
        }
        if (changes.hasOwnProperty('recalculate') && this.recalculate) {
            this.cycles = copy(this.data);
            this.$scope.$applyAsync();
        }
    }

    private prepareScheme (): void {
        this.periodizationService.get()
            .then(result => this.schemes = result.arrayResult)
            // Если у пользователя нет Схемы периодизации, то добавляем ему для возможности редактирования
            .then(() => !this.schemes.some(s => s.id === this.cycles.season.periodizationScheme.id) &&
                this.schemes.push(this.cycles.season.periodizationScheme));
    }

    getMesocycles(): Array<IMesocycle> {
        if (this.schemes && this.cycles.season) {
            return this.schemes.filter(s => s.id === this.cycles.season.periodizationScheme.id)[0].mesocycles;
        }
    }

    getMesocycle (id: string | number): IMesocycle {
        if (this.schemes && id) {
            return this.schemes
                .filter(s => s.id === this.cycles.season.periodizationScheme.id)[0]
                .mesocycles.filter(m => m.id === Number(id))[0];
        }
    }

    change (cycle: Microcycle, pos?: number): void {
        if ( cycle.mesocycle.id ) {
            cycle.mesocycle = this.getMesocycle(cycle.mesocycle.id);
        } else { return; }

        //if ( pos >= 0) { this.recalcMesoWeekNumber(); }

        if ( cycle.id ) {
            this.trainingSeason.putItem(cycle.prepare())
                .then(result => cycle.applyRevision(result))
                .then(() => pos >= 0 && this.recalculateMesoWeekNumber())
                .then(() => this.update ++);
        } else {
            this.trainingSeason.postItem(this.cycles.season.id, cycle.prepare())
                .then(result => cycle.applyRevision(result))
                .then(() => pos >= 0 && this.recalculateMesoWeekNumber())
                .then(() => this.update ++);
        }
    }

    /**
     * Перечсчет параметра mesoWeekNumber - неделя в рамках мезоцикла (идущие подряд микроциклы с одним мезоциклом)
     * Выполняется пересчет по всем микроциклам и если номер недели меняется, то выполняется запрос на изменение
     * микроцикла
     */
    recalculateMesoWeekNumber (): void {
        this.cycles.grid.forEach( (cycle, i) => {
            let weekNumber: number = 1;
            let pos = copy(i);

            while (
                pos >= 1 &&
                this.cycles.grid[pos] &&
                this.cycles.grid[pos].mesocycle &&
                this.cycles.grid[pos].mesocycle.hasOwnProperty('id') &&
                this.cycles.grid[pos].mesocycle.id &&
                this.cycles.grid[pos - 1].mesocycle &&
                this.cycles.grid[pos - 1].mesocycle.hasOwnProperty('id') &&
                this.cycles.grid[pos].mesocycle.id === this.cycles.grid[pos-1].mesocycle.id) {

                weekNumber ++;
                pos --;
            }
            if (cycle.mesoWeekNumber !== weekNumber && cycle.id && cycle.mesocycle) {
                cycle.mesoWeekNumber = weekNumber;
                this.trainingSeason.putItem(cycle.prepare()).then(result => cycle.applyRevision(result));
            }
        });
    }

    getWeekCount (pos: number): number {
        let count: number = 1;
        while (pos !== 0 && this.cycles.grid[pos].mesocycle.id &&
            this.cycles.grid[pos].mesocycle.id === this.cycles.grid[pos-1].mesocycle.id) {
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
                cycle.durationValue = Number(input.$modelValue);
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
        recalculate: '<',
        onChangeCompetition: '&'
    },
    controller: TrainingSeasonDataCtrl,
    template: require('./training-season-data.component.html') as string
};
