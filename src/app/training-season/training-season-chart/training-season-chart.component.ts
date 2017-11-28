import './training-season-chart.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';

class TrainingSeasonChartCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

export const TrainingSeasonChartComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingSeasonChartCtrl,
    template: require('./training-season-chart.component.html') as string
};