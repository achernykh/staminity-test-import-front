import './analytics-chart.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {IAnalyticsChartFilterParam} from "../analytics-chart-filter/analytics-chart-filter.model";
import {IAnalyticsChart} from "./analytics-chart.model";

class AnalyticsChartCtrl implements IComponentController {

    public chart: IAnalyticsChart;
    public onEvent: (response: Object) => IPromise<void>;

    public updateCount: number = 0;

    static $inject = [];

    constructor() {

    }

    $onInit() {

    }

    update(param: IAnalyticsChartFilterParam<any>, value) {
        switch(param.area) {
            case 'series': {
                this.chart.series[param.ind][param.name] = value;
                this.updateCount++;
                break;
            }
            case 'measures': {
                this.chart.measures[param.ind][param.name] = value;
                this.updateCount++;
                break;
            }
        }
    }
}

const AnalyticsChartComponent:IComponentOptions = {
    bindings: {
        chart: '<',
        onExpand: '&',
        onCollapse: '&',
        onFullScreen: '&'
    },
    require: {
        //component: '^component'
    },
    controller: AnalyticsChartCtrl,
    template: require('./analytics-chart.component.html') as string
};

export default AnalyticsChartComponent;