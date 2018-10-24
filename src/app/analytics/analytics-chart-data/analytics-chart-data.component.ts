import './analytics-chart-data.component.scss';
import {IComponentOptions, IComponentController} from 'angular';

class AnalyticsChartDataCtrl implements IComponentController {

    // bind
    data: any;
    onEvent: (response: Object) => Promise<void>;

    // private

    // inject
    static $inject = [];

    constructor() {

    }

    $onInit(): void {

    }
}

export const AnalyticsChartDataComponent:IComponentOptions = {
    bindings: {
        data: '<',
        update: '<',
        descriptionParams: '<',
        onEvent: '&'
    },
    controller: AnalyticsChartDataCtrl,
    template: require('./analytics-chart-data.component.html') as string
};