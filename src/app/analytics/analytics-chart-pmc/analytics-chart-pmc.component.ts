import "./analytics-chart-pmc.component.scss";
import {copy, IComponentController, IComponentOptions, IPromise, IScope} from "angular";
import StatisticsService from "@app/core/statistics.service";
import {IAnalyticsChart} from "@app/analytics/analytics-chart/analytics-chart.interface";
import {IReportRequestData} from "@api/statistics/statistics.interface";

class AnalyticsChartPmcCtrl implements IComponentController {
    // bind
    chart: IAnalyticsChart;

    // private
    private filterChange: number = null;
    private errorStack: string[] = [];
    private updateCount: number = 0;
    private hasData: boolean = false;

    static $inject = ["$scope", "statistics", "$mdDialog", "$filter"];
    constructor(
        private $scope: IScope,
        private statisticsService: StatisticsService,
        private $mdDialog,
        private $filter){

    }

    $onInit (): void {
        this.prepareChartSettings();
        this.prepareChartData();
    }

    private prepareChartSettings (): void {
        this.chart = this.chart || require('../chart-templates/pmc.json') as IAnalyticsChart;
    }

    private prepareChartData() {
        const request: IReportRequestData = {
            charts: this.chart.charts,
        };

        this.statisticsService.getMetrics(request).then((result) => {
            this.errorStack = [];
            if (result && result.hasOwnProperty("charts") && !result["charts"].some((c) => c.hasOwnProperty("errorMessage"))) {
                result["charts"].map((r, i) => this.chart.charts[i].metrics = r.metrics);
                this.updateCount++;
                this.$scope.$apply();

            } else if (result["charts"].some((c) => c.hasOwnProperty("errorMessage"))) {
                this.errorStack = result["charts"].filter((c) => c.hasOwnProperty("errorMessage")).map((c) => c.errorMessage);
            }
        }, (error) => this.errorStack.push(error))
            .then(_ => this.hasData = this.chart.charts.some(c => c.metrics.length > 0))
            .then(_ => this.$scope.$applyAsync());
    }

}

export const AnalyticsChartPmcComponent: IComponentOptions = {
    bindings: {
        chart: "<",
        filter: "<",
        filterChanges: "<",
        panelChanges: "<",
        onChangeFilter: "&",
        onExpand: "&",
        onCollapse: "&",
        onFullScreen: "&",
    },
    require: {
        //analytics: "^analytics",
    },
    controller: AnalyticsChartPmcCtrl,
    template: require("./analytics-chart-pmc.component.html") as string,
};