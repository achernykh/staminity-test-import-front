import "./analytics-chart.component.scss";
import { copy, IComponentController, IComponentOptions, IPromise, IScope } from "angular";
import { IReportPeriod, IReportRequestData } from "../../../../api/statistics/statistics.interface";
import { getSportsByBasicId } from "../../activity/activity.constants";
import StatisticsService from "../../core/statistics.service";
import {
    AnalyticsChartFilter,
    IAnalyticsChartSettings,
    periodByType
} from "../analytics-chart-filter/analytics-chart-filter.model";
import { AnalyticsCtrl } from "../analytics.component";
import { AnalyticsChart } from "./analytics-chart.model";
import { filter } from "../../share/utility/arrays";

class AnalyticsChartCtrl implements IComponentController {

    analytics: AnalyticsCtrl;
    chart: AnalyticsChart;
    filter: AnalyticsChartFilter;

    private descriptionParams: Object = {};

    private filterChange: number = null;
    private errorStack: string[] = [];

    onChangeFilter: () => IPromise<void>;
    onFullScreen: () => IPromise<void>;

    updateCount: number = 0;

    static $inject = ["$scope", "statistics", "$mdDialog", "$filter"];

    constructor (private $scope: IScope, private statistics: StatisticsService, private $mdDialog: any, private $filter: any) {

    }

    $onInit () {

    }

    $onChanges (changes): void {
        if ( (changes.hasOwnProperty("chart") && changes.filterChanges.isFirstChange()) ||
            (changes.hasOwnProperty("filterChanges") && !changes.filterChanges.isFirstChange() && this.chart.globalParams) ) {
            this.chart.clearMetrics();
            this.prepareTitleContext();
            this.prepareParams();
            this.prepareData();
        }
    }

    onSettings (env: Event) {
        //debugger;
        //this.config.openFrom = env;
        //this.$mdPanel.open(this.config);
        this.$mdDialog.show({
            controller: ["$scope", "$mdDialog", ($scope, $mdDialog) => {
                $scope.hide = () => $mdDialog.hide();
                $scope.cancel = () => $mdDialog.cancel();
                $scope.answer = (chart, update) => $mdDialog.hide({ chart, update });
            }],
            controllerAs: "$ctrl",
            template: `<md-dialog id="analytics-chart-settings" aria-label="Analytics Chart Settings">
                        <analytics-chart-settings
                                layout="column" class="analytics-chart-settings"
                                chart="$ctrl.chart"
                                global-filter="$ctrl.filter"
                                categories-by-owner="$ctrl.categories"
                                on-cancel="cancel()" on-save="answer(chart, update)">
                        </analytics-chart-settings>
                   </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: env,
            locals: {
                chart: this.chart,
                filter: this.filter,
                categoriesByOwner: this.analytics.filter.categoriesByOwner,
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: true,
            fullscreen: true,

        }).then((response) => this.updateSettings(response.chart, response.update), () => {});

    }

    descriptions (): string {
        //if (this.chart.globalParams) {
        return `${this.$filter("translate")("analytics." + this.chart.code + ".description", this.descriptionParams)}`;
        //} else {
        //return this.chart.localParams.descriptions();
        //}
    }

    private updateSettings (chart: AnalyticsChart, update: boolean) {
        this.chart = copy(chart);
        this.prepareTitleContext();
        if ( update ) {
            this.prepareParams();
            this.prepareData();
        }
        this.updateCount++;
    }

    update (param: IAnalyticsChartSettings<any>, value, protectedOption: boolean) {
        switch ( param.area ) {
            case "series": {
                param.ind.map((ind) =>
                    this.chart.charts[ind].series
                        .filter((s) => param.idx.indexOf(s.idx) !== -1)
                        .map((s) => s[param.name] = value),
                );
                break;
            }
            case "measures": {
                param.ind.map((ind) =>
                        this.chart.charts[ind].measures
                            .filter((s) => param.idx.indexOf(s.idx) !== -1)
                            .map((s) => Object.keys(param.change[value]).map((k) => s[k] = param.change[value][k])),
                    //.map(s => s[param.name] = value)
                );
                break;
            }
            case "params": {
                if ( protectedOption ) {

                } else {
                    param.ind.map((ind) => this.chart.charts[ind].params[param.name] = value);
                }
                this.prepareParams();
            }
        }

        if ( param.area === "params" || protectedOption ||
            Object.keys(param.change[value]).some((change) => ["seriesDateTrunc", "measureName", "unit"].indexOf(change) !== -1) ) {
            this.prepareData();
        }
        this.prepareTitleContext();
        this.onChangeFilter(); // сохраняем настройки в браузере
    }

    grow () {
        this.chart.layout.gridColumnEnd === 1 ? this.chart.layout.gridColumnEnd = 2 : this.chart.layout.gridColumnEnd = 1;
        //this.chart.layout.gridColumnEnd === 2 && this.chart.layout.gridRowEnd === 1 ? this.chart.layout.gridRowEnd = 2 : angular.noop();
        //this.chart.layout.gridColumnEnd === 2 && this.chart.layout.gridRowEnd === 2 ? this.chart.layout.gridRowEnd = 1 : angular.noop();
        this.updateCount++;
    }

    fullScreen () {
        this.chart.layout.fullScreen = !this.chart.layout.fullScreen;
        setTimeout(() => {
            this.updateCount++;
            this.$scope.$apply();
        }, 1);
    }

    private prepareTitleContext () {
        if ( this.chart.hasOwnProperty("descriptionParams") ) {
            this.chart.descriptionParams.map((c) => {
                this.descriptionParams[c.param] = c.area === 'params' ?
                    this.chart.charts[c.ind][c.area][c.param] :
                    this.chart.charts[c.ind][c.area].filter((s) => s.idx === c.idx)[0][c.param];
            });
        }
    }

    private prepareParams () {

        //let periodsParams = this.chart.filter.params.filter(p => p.area === 'params' && p.name === 'periods')[0];
        const globalParams: {
            users: number[];
            activityTypes: number[];
            periods: IReportPeriod[];
        } = {
            users: [],
            activityTypes: [],
            periods: [],
        };
        this.filter.activityTypes.model.map((id) => globalParams.activityTypes.push(...getSportsByBasicId(Number(id))));
        globalParams.users = [Number(this.filter.users.model)];
        globalParams.periods = this.filter.periods.model !== "customPeriod" ? periodByType(this.filter.periods.model) : this.filter.periods.data.model;

        // приоритет выбора параметров запроса
        // 1) локальные параметры
        // 2) глобальные параметры
        // 3) настройки графика
        // 4) null
        this.chart.charts.map((c, i) => c.params = Object.assign(c.params, {
            users:
                (this.chart.localParams && this.chart.localParams.users && this.chart.localParams.users.model) ||
                (c.params && c.params.users && c.params.users) ||
                globalParams.users || null,

            activityTypes:
                (this.chart.localParams && this.chart.localParams.activityTypes && this.chart.localParams.activityTypes.model) ||
                (c.params.activityTypes && c.params.activityTypes) ||
                globalParams.activityTypes || null,

            activityCategories: this.filter.activityCategories.model,

            periods:
                (this.chart.globalParams && globalParams.periods) ||
                (c.params.periods && c.params.periods) ||
                globalParams.periods || null,
        }));
    }

    private prepareData () {
        const request: IReportRequestData = {
            charts: this.chart.charts,
        };

        this.statistics.getMetrics(request).then((result) => {
            this.errorStack = [];
            if ( result && result.hasOwnProperty("charts") && !result["charts"].some((c) => c.hasOwnProperty("errorMessage")) ) {
                result["charts"].map((r, i) => this.chart.charts[i].metrics = r.metrics);
                this.updateCount++;
                this.$scope.$apply();

            } else if ( result["charts"].some((c) => c.hasOwnProperty("errorMessage")) ) {
                this.errorStack = result["charts"].filter((c) => c.hasOwnProperty("errorMessage")).map((c) => c.errorMessage);
            }
        }, (error) => this.errorStack.push(error))
            .then(_ => this.chart.calcData());
    }
}

const AnalyticsChartComponent: IComponentOptions = {
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
        analytics: "^stAnalytics",
    },
    controller: AnalyticsChartCtrl,
    template: require("./analytics-chart.component.html") as string,
};

export default AnalyticsChartComponent;
