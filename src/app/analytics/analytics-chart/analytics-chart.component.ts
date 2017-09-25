import './analytics-chart.component.scss';
import {IComponentOptions, IComponentController, IPromise, IScope} from 'angular';
import {IAnalyticsChartFilterParam, IReportPeriodOptions} from "../analytics-chart-filter/analytics-chart-filter.model";
import {IAnalyticsChart, AnalyticsChart} from "./analytics-chart.model";
import {IReportRequestData, IChart} from "../../../../api/statistics/statistics.interface";
import {IUserProfileShort} from "../../../../api/user/user.interface";
import {IActivityType} from "../../../../api/activity/activity.interface";
import {IActivityCategory} from "../../../../api/reference/reference.interface";
import StatisticsService from "../../core/statistics.service";

class AnalyticsChartCtrl implements IComponentController {

    public chart: AnalyticsChart;
    public filter: {
        users: IAnalyticsChartFilterParam<IUserProfileShort>;
        activityTypes: IAnalyticsChartFilterParam<IActivityType>;
        activityCategories: IAnalyticsChartFilterParam<IActivityCategory>;
        periods: IAnalyticsChartFilterParam<IReportPeriodOptions>;
    };

    public onEvent: (response: Object) => IPromise<void>;

    public updateCount: number = 0;

    static $inject = ['$scope','statistics'];

    constructor(private $scope: IScope, private statistics: StatisticsService) {

    }

    $onInit() {

    }


    $onChanges(changes): void {
        if((changes.hasOwnProperty('chart') && changes.filterChanges.isFirstChange()) ||
            (changes.hasOwnProperty('filterChanges') && !changes.filterChanges.isFirstChange())){
            this.prepareParams();
            this.prepareData();
        }
    }

    update(param: IAnalyticsChartFilterParam<any>, value) {
        switch(param.area) {
            case 'series': {
                param.ind.map(ind =>
                    this.chart.charts[ind].series
                        .filter(s => param.idx.indexOf(s.idx) !== -1)
                        .map(s => s[param.name] = value)
                );
                //this.chart.series[param.ind][param.name] = value;
                //this.updateCount++;
                break;
            }
            case 'measures': {
                param.ind.map(ind =>
                    this.chart.charts[ind].measures
                        .filter(s => param.idx.indexOf(s.idx) !== -1)
                        .map(s => s[param.name] = value)
                );
                //this.chart.measures[param.ind][param.name] = value;
                //this.updateCount++;
                break;
            }
        }

        if(param.area === 'params' || ['seriesDateTrunc','cumulative'].indexOf(param.name) !== -1) {
            this.prepareData();
        }
    }

    grow() {
        this.chart.layout.gridColumnEnd === 1 ? this.chart.layout.gridColumnEnd = 2 : this.chart.layout.gridColumnEnd = 1;
        //this.chart.layout.gridColumnEnd === 2 && this.chart.layout.gridRowEnd === 1 ? this.chart.layout.gridRowEnd = 2 : angular.noop();
        //this.chart.layout.gridColumnEnd === 2 && this.chart.layout.gridRowEnd === 2 ? this.chart.layout.gridRowEnd = 1 : angular.noop();
        this.updateCount++;
    }

    private prepareParams() {
        // TODO merge filters & protected params

        this.chart.charts.map(c => c.params = {
            users: this.filter.users.model.map(u => Number(u)),
            activityTypes: this.filter.activityTypes.model,
            activityCategories: null,
            periods: [JSON.parse(this.filter.periods.model)]
        });
    }

    private prepareData() {
        let request: IReportRequestData = {
            charts: this.chart.charts
        };

        this.statistics.getMetrics(request).then(result => {
            if(result && result.hasOwnProperty('charts') && !result['charts'].some(c => c.hasOwnProperty('errorMessage'))) {
                result['charts'].map((r,i) => this.chart.prepareMetrics(i, r.metrics));
                this.updateCount++;
                this.$scope.$apply();

            }
        }, error => { });
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