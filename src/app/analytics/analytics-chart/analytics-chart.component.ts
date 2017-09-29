import './analytics-chart.component.scss';
import {IComponentOptions, IComponentController, IPromise, IScope} from 'angular';
import {
    IAnalyticsChartFilterParam, IReportPeriodOptions,
    periodByType
} from "../analytics-chart-filter/analytics-chart-filter.model";
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
        periods: IAnalyticsChartFilterParam<string>;
    };

    private context: Object = {};

    private filterChange: number = null;
    private errorStack: Array<string> = [];

    public onChangeFilter: () => IPromise<void>;
    public onFullScreen: () => IPromise<void>;

    public updateCount: number = 0;

    static $inject = ['$scope','statistics'];

    constructor(private $scope: IScope, private statistics: StatisticsService) {

    }

    $onInit() {

    }


    $onChanges(changes): void {
        if((changes.hasOwnProperty('chart') && changes.filterChanges.isFirstChange()) ||
            (changes.hasOwnProperty('filterChanges') && !changes.filterChanges.isFirstChange())){
            this.prepareTitleContext();
            this.prepareParams();
            this.prepareData();
        }
    }

    update(param: IAnalyticsChartFilterParam<any>, value, protectedOption: boolean) {
        switch(param.area) {
            case 'series': {
                param.ind.map(ind =>
                    this.chart.charts[ind].series
                        .filter(s => param.idx.indexOf(s.idx) !== -1)
                        .map(s => s[param.name] = value)
                );
                break;
            }
            case 'measures': {
                param.ind.map(ind =>
                    this.chart.charts[ind].measures
                        .filter(s => param.idx.indexOf(s.idx) !== -1)
                        .map(s => Object.keys(param.change[value]).map(k => s[k] = param.change[value][k]))
                        //.map(s => s[param.name] = value)
                );
                break;
            }
            case 'params': {
                if(protectedOption) {

                } else {
                    param.ind.map(ind => this.chart.charts[ind].params[param.name] = value);
                }
                this.prepareParams();
            }
        }

        if(param.area === 'params' || protectedOption ||
            Object.keys(param.change[value]).some(change => ['seriesDateTrunc','cumulative','measureName'].indexOf(change) !== -1)) {
            this.prepareData();
        }
        this.prepareTitleContext();
        this.onChangeFilter(); // сохраняем настройки в браузере
    }

    grow() {
        this.chart.layout.gridColumnEnd === 1 ? this.chart.layout.gridColumnEnd = 2 : this.chart.layout.gridColumnEnd = 1;
        //this.chart.layout.gridColumnEnd === 2 && this.chart.layout.gridRowEnd === 1 ? this.chart.layout.gridRowEnd = 2 : angular.noop();
        //this.chart.layout.gridColumnEnd === 2 && this.chart.layout.gridRowEnd === 2 ? this.chart.layout.gridRowEnd = 1 : angular.noop();
        this.updateCount++;
    }

    fullScreen() {
        this.chart.layout.fullScreen = !this.chart.layout.fullScreen;
        setTimeout(() => {
                this.updateCount++;
                this.$scope.$apply();
            }, 1);
    }

    private prepareTitleContext() {
        if(this.chart.hasOwnProperty('context')) {
            this.chart.context.map(c => {
                this.context[c.param] = this.chart.charts[c.ind][c.area].filter(s => s.idx === c.idx)[0][c.param];
            });
        }
    }

    private prepareParams() {

        let periodsParams = this.chart.filter.params.filter(p => p.area === 'params' && p.name === 'periods')[0];

        // Обновляем значение фильтров по заблокированным локальным фильтрам
        Object.keys(this.filter)
            .filter(f => this.chart.filter.params.some(p => p.area === 'params' && p.name === f))
            .map(f => {
                let param = this.chart.filter.params.filter(p => p.area === 'params' && p.name === f)[0];
                if(param.protected) {
                    param.model = this.filter[f].model;
                    this.filterChange++;
                }
            });

        this.chart.charts.map((c,i) => c.params = {
            users: this.filter.users.model.map(u => Number(u)),
            activityTypes: this.filter.activityTypes.model,
            activityCategories: this.filter.activityCategories.model,
            periods: (!periodsParams.protected && periodByType(periodsParams.model)) ||
                (angular.isArray(this.filter.periods.data) && this.filter.periods.data) ||
                periodByType(this.filter.periods.model) || this.chart.charts[i].params.periods
        });
    }

    private prepareData() {
        let request: IReportRequestData = {
            charts: this.chart.charts
        };

        this.statistics.getMetrics(request).then(result => {
            this.errorStack = [];
            if(result && result.hasOwnProperty('charts') && !result['charts'].some(c => c.hasOwnProperty('errorMessage'))) {
                result['charts'].map((r,i) => this.chart.prepareMetrics(i, r.metrics));
                this.updateCount++;
                this.$scope.$apply();

            } else if(result['charts'].some(c => c.hasOwnProperty('errorMessage'))) {
                this.errorStack = result['charts'].filter(c => c.hasOwnProperty('errorMessage')).map(c => c.errorMessage);
            }
        }, error => { });
    }
}

const AnalyticsChartComponent:IComponentOptions = {
    bindings: {
        chart: '<',
        filter: '<',
        filterChanges: '<',
        onChangeFilter: '&',
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