import './analytics-chart-settings.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';

class AnalyticsChartSettingsCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

const AnalyticsChartSettingsComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: AnalyticsChartSettingsCtrl,
    template: require('./analytics-chart-settings.component.html') as string
};

export default AnalyticsChartSettingsComponent;