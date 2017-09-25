import './analytics-chart.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {IAnalyticsChartFilterParam, IReportPeriodOptions} from "../analytics-chart-filter/analytics-chart-filter.model";
import {IAnalyticsChart} from "./analytics-chart.model";
import {IReportRequestData, IChart} from "../../../../api/statistics/statistics.interface";
import {IUserProfileShort} from "../../../../api/user/user.interface";
import {IActivityType} from "../../../../api/activity/activity.interface";
import {IActivityCategory} from "../../../../api/reference/reference.interface";
import StatisticsService from "../../core/statistics.service";

class AnalyticsChartCtrl implements IComponentController {

    public chart: IAnalyticsChart;
    public filter: {
        users: IAnalyticsChartFilterParam<IUserProfileShort>;
        activityTypes: IAnalyticsChartFilterParam<IActivityType>;
        activityCategories: IAnalyticsChartFilterParam<IActivityCategory>;
        periods: IAnalyticsChartFilterParam<IReportPeriodOptions>;
    };

    public onEvent: (response: Object) => IPromise<void>;

    public updateCount: number = 0;

    static $inject = ['statistics'];

    constructor(private statistics: StatisticsService) {

    }

    $onInit() {

    }


    $onChanges(changes): void {
        if(changes.hasOwnProperty('filterChanges') && !changes.filterChanges.isFirstChange()){
            this.prepareParams();
            this.prepareData();
        }
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

    private prepareParams() {
        // TODO merge filters & protected params
        this.chart.params = {
            users: this.filter.users.model.map(u => Number(u)),
            activityTypes: this.filter.activityTypes.model,
            activityCategories: null,
            periods: [JSON.parse(this.filter.periods.model)]
        };
    }

    private prepareData() {
        let request: IReportRequestData = {
            charts: [{
                params: this.chart.params,
                series: this.chart.series,
                measures: this.chart.measures
            }]
        };

        this.statistics.getMetrics(request).then(result => { }, error => { });
    }
}

const AnalyticsChartComponent:IComponentOptions = {
    bindings: {
        chart: '<',
        filter: '<',
        filterChanges: '<',
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