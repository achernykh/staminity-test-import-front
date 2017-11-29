import {copy, IComponentController, IComponentOptions, IPromise, IScope} from "angular";
import {IActivityType} from "../../../../api/activity/activity.interface";
import {IActivityCategory} from "../../../../api/reference/reference.interface";
import { IChart, IReportPeriod, IReportRequestData } from "../../../../api/statistics/statistics.interface";
import {IUserProfileShort} from "../../../../api/user/user.interface";
import {getSportsByBasicId} from "../../activity/activity.constants";
import StatisticsService from "../../core/statistics.service";
import {
    AnalyticsChartFilter, IAnalyticsChartSettings,
    IReportPeriodOptions, periodByType,
} from "../analytics-chart-filter/analytics-chart-filter.model";
import {AnalyticsCtrl} from "../analytics.component";
import "./analytics-chart.component.scss";
import {AnalyticsChart, IAnalyticsChart} from "./analytics-chart.model";

class AnalyticsChartCtrl implements IComponentController {

    public analytics: AnalyticsCtrl;
    public chart: AnalyticsChart;
    public filter: AnalyticsChartFilter;

    private context: Object = {};

    private filterChange: number = null;
    private errorStack: string[] = [];

    public onChangeFilter: () => IPromise<void>;
    public onFullScreen: () => IPromise<void>;

    public updateCount: number = 0;

    static $inject = ["$scope","statistics","$mdDialog","$filter"];

    constructor(private $scope: IScope, private statistics: StatisticsService, private $mdDialog: any, private $filter: any) {

    }

    $onInit() {

    }


    $onChanges(changes): void {
        if((changes.hasOwnProperty("chart") && changes.filterChanges.isFirstChange()) ||
            (changes.hasOwnProperty("filterChanges") && !changes.filterChanges.isFirstChange() && this.chart.globalParams)){
            this.chart.clearMetrics();
            this.prepareTitleContext();
            this.prepareParams();
            this.prepareData();
        }
    }

    onSettings(env: Event) {
        //debugger;
        //this.config.openFrom = env;
        //this.$mdPanel.open(this.config);
        this.$mdDialog.show({
            controller: ["$scope","$mdDialog", ($scope, $mdDialog) => {
                $scope.hide = () => $mdDialog.hide();
                $scope.cancel = () => $mdDialog.cancel();
                $scope.answer = (chart,update) => $mdDialog.hide({chart: chart,update: update});
            }],
            controllerAs: "$ctrl",
            template:
                `<md-dialog id="analytics-chart-settings" aria-label="Analytics Chart Settings">
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

    descriptions(): string {
        if (this.chart.globalParams) {
            return `${this.$filter("translate")("analytics." + this.chart.code + ".description", this.context)}`;
        } else {
            return this.chart.localParams.descriptions();
        }
    }

    private updateSettings(chart: AnalyticsChart, update: boolean) {
        this.chart = copy(chart);
        this.prepareTitleContext();
        if(update){
            this.prepareParams();
            this.prepareData();
        }
        this.updateCount++;
    }

    update(param: IAnalyticsChartSettings<any>, value, protectedOption: boolean) {
        switch(param.area) {
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
                if(protectedOption) {

                } else {
                    param.ind.map((ind) => this.chart.charts[ind].params[param.name] = value);
                }
                this.prepareParams();
            }
        }

        if(param.area === "params" || protectedOption ||
            Object.keys(param.change[value]).some((change) => ["seriesDateTrunc","measureName","unit"].indexOf(change) !== -1)) {
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
        if(this.chart.hasOwnProperty("context")) {
            this.chart.context.map((c) => {
                this.context[c.param] = this.chart.charts[c.ind][c.area].filter((s) => s.idx === c.idx)[0][c.param];
            });
        }
    }

    private prepareParams() {

        //let periodsParams = this.chart.filter.params.filter(p => p.area === 'params' && p.name === 'periods')[0];
        let globalParams: {
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
        globalParams.periods = this.filter.periods.model !== "customPeriod" ? periodByType(this.filter.periods.model) : this.filter.periods.model;

        this.chart.charts.map((c,i) => c.params = {
            users:
                (this.chart.globalParams && globalParams.users) ||
                (c.params.users && c.params.users) ||
                (this.chart.localParams.users.model && this.chart.localParams.users.model) || null,

            activityTypes:
                (this.chart.globalParams && globalParams.activityTypes) ||
                (c.params.activityTypes && c.params.activityTypes) || null,

            activityCategories: this.filter.activityCategories.model,

            periods: (this.chart.globalParams && globalParams.periods) ||
                (c.params.periods && c.params.periods) || null,

        });
    }

    private prepareData() {
        let request: IReportRequestData = {
            charts: this.chart.charts,
        };

        this.statistics.getMetrics(request).then((result) => {
            this.errorStack = [];
            if(result && result.hasOwnProperty("charts") && !result["charts"].some((c) => c.hasOwnProperty("errorMessage"))) {
                result["charts"].map((r,i) => this.chart.prepareMetrics(i, r.metrics));
                this.updateCount++;
                this.$scope.$apply();

            } else if(result["charts"].some((c) => c.hasOwnProperty("errorMessage"))) {
                this.errorStack = result["charts"].filter((c) => c.hasOwnProperty("errorMessage")).map((c) => c.errorMessage);
            }
        }, (error) => this.errorStack.push(error));
    }
}

const AnalyticsChartComponent:IComponentOptions = {
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
        analytics: "^analytics",
    },
    controller: AnalyticsChartCtrl,
    template: require("./analytics-chart.component.html") as string,
};

export default AnalyticsChartComponent;