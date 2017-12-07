import './training-season-chart.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import { ITrainingSeasonSettings } from "../training-season.settings";
import { TrainingSeasonData } from "../training-season-data/training-season-data.datamodel";
import { IChart } from "../../../../api/statistics/statistics.interface";
import { preparePeriodizationChart } from "./training-season-chart.function";

class TrainingSeasonChartCtrl implements IComponentController {

    data: TrainingSeasonData;
    update: number;
    onEvent: (response: Object) => IPromise<void>;

    // private
    chart: Array<IChart>;

    static $inject = ['TrainingSeasonSettings'];

    constructor (private settings: ITrainingSeasonSettings) {

    }

    $onInit() {

    }

    $onChanges (changes): void {
        if ((changes.hasOwnProperty('data') && this.data) ||
            (changes.hasOwnProperty('update') && !changes.update.isFirstChange())) {
            this.chart = [...preparePeriodizationChart(this.settings.chartTemplate, this.data.grid)];
        }
    }

}

export const TrainingSeasonChartComponent:IComponentOptions = {
    bindings: {
        data: '<',
        update: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingSeasonChartCtrl,
    template: require('./training-season-chart.component.html') as string
};