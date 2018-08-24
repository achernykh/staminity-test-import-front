import "./analytics-chart.component.scss";
import { copy, IComponentController, IComponentOptions, IPromise, IScope } from "angular";
import { IReportPeriod, IReportRequestData } from "../../../../api/statistics/statistics.interface";
import { getSportsByBasicId } from "../../activity/activity.constants";
import StatisticsService from "../../core/statistics.service";
import { AnalyticsChartFilter, IAnalyticsChartSettings } from "../analytics-chart-filter/analytics-chart-filter.model";
import { AnalyticsCtrl } from "../analytics.component";
import { AnalyticsChart } from "./analytics-chart.model";
import { periodByType, comparePeriodType } from "../analytics-chart-filter/analytics-chart-filter.function";
import { isArray } from "@reactivex/rxjs/dist/cjs/util/isArray";
import { IUserConnections, IUserProfile, IUserProfileShort } from "../../../../api/user/user.interface";

const prepareUsers = (param: string, athletes: IUserProfileShort[]): number[] => {
    switch (param) {
        case 'first5': return athletes.filter((a, i) => i < 5).map((a) => a.userId);
    }
};

class AnalyticsChartCtrl implements IComponentController {

    owner: IUserProfile;
    analytics: AnalyticsCtrl;
    chart: AnalyticsChart;
    globalFilter: AnalyticsChartFilter;

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
        if ( changes.hasOwnProperty("chart") && changes.chart.isFirstChange() ) {
            this.loadData();
        }
        if ( changes.hasOwnProperty("globalFilterChange") && !changes.globalFilterChange.isFirstChange() &&
            this.isGlobalAndLocalFilterDifferent() ) {
            this.loadData();
        }
    }

    loadData (): void {
        this.chart.clearMetrics();
        this.prepareSettings();
        this.prepareTitleContext();
        this.prepareParams();
        this.prepareData();
    }

    isGlobalAndLocalFilterDifferent (): boolean {
        return (!this.chart.localParams || (this.chart.localParams && this.chart.localParams.users && this.chart.localParams.users.model !== this.globalFilter.users.model)) ||
            (!this.chart.localParams || (this.chart.localParams && this.chart.localParams.periods && this.chart.localParams.periods.model !== this.globalFilter.periods.model));
    }

    onSettings (env: Event) {
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
                filter: this.globalFilter,
                categoriesByOwner: this.globalFilter.categoriesByOwner,
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
        this.prepareSettings();
        this.prepareTitleContext();
        if ( update ) {
            this.prepareParams();
            this.prepareData();
        }
        this.updateCount++;
    }
/**
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
**/
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

    private prepareSettings (): void {
        if ( !this.chart.settings ) { return; }
        this.chart.settings.map(s => this.chart.changeSettings(s, s.model));
    }

    private prepareParams () {
        // приоритет выбора параметров запроса
        // 1) локальные параметры
        // 2) глобальные параметры
        // 3) настройки графика
        // 4) null
        const params: {
            users: number[];
            activityTypes: number[];
            periods: IReportPeriod[];
            activityCategories: any;
        } = {
            users: this.getUsers() || null,
            activityTypes: this.getActivityTypes(),
            periods: this.getPeriods() || null,
            activityCategories: this.globalFilter.activityCategories.model
        };

        this.chart.charts.map((c, i) => Object.keys(c.params).map(k => c.params[k] = params[k] || c.params[k])); // = Object.assign(c.params, params));

        // Если фильтр пользователей задан переменной
        this.chart.charts.map(c =>
            c.params.hasOwnProperty('users') && !isArray(c.params.users) &&
            (c.params.users = prepareUsers(c.params.users as string, this.owner.connections.allAthletes && this.owner.connections.allAthletes.groupMembers)));

        // Если есть ichart для сравнения
        if ( this.chart.compareSettings && this.chart.compareSettings.visible ) {
            this.chart.charts[this.chart.compareSettings.ind].params.periods =
                periodByType(comparePeriodType(this.chart.compareSettings.mode));
        }

    }

    getPeriods (): IReportPeriod[] {
        if ( this.chart.localParams && this.chart.localParams.periods && this.chart.localParams.periods.model ) {
            return this.chart.localParams.periods.model !== "customPeriod" ? periodByType(this.chart.localParams.periods.model) : this.chart.localParams.periods.data.model;
        } else {
            return this.globalFilter.periods.model !== "customPeriod" ? periodByType(this.globalFilter.periods.model) : this.globalFilter.periods.data.model;
        }
    }

    getUsers (): any {
        if ( this.chart.localParams && this.chart.localParams.users ) {
            return this.chart.localParams.users;
        } else {
            return [Number(this.globalFilter.users.model)];
        }
    }

    getActivityTypes (): any {
        if ( this.chart.localParams && this.chart.localParams.activityTypes ) {
            return this.chart.localParams.activityTypes;
        } else if ( this.globalFilter.activityTypes && this.globalFilter.activityTypes.model ) {
            let types: number[] = [];
            this.globalFilter.activityTypes.model.map(id => types.push(...getSportsByBasicId(Number(id))));
            return types;
        } else { return null; }
    }

    getLocalParamChanges (): number {
        return this.chart.localParams && Object.keys(this.chart.localParams).length || null;
    }

    private prepareData () {
        const request: IReportRequestData = {
            charts: this.chart.charts,
        };

        this.statistics.getMetrics(request).then((result) => {
            this.errorStack = [];
            if ( result && result.hasOwnProperty("charts") && !result["charts"].some((c) => c.hasOwnProperty("errorMessage")) ) {
                result["charts"].map((r, i) => this.chart.charts[i].metrics = r.metrics);
            } else if ( result["charts"].some((c) => c.hasOwnProperty("errorMessage")) ) {
                this.errorStack = result["charts"]
                    .filter((c) => c.hasOwnProperty("errorMessage")).map((c) => c.errorMessage);
            }
        }, (error) => this.errorStack.push(error))
            .then(_ => this.chart.calcData())
            .then(_ => this.updateCount++)
            .then(_ => this.$scope.$applyAsync());
    }
}

const AnalyticsChartComponent: IComponentOptions = {
    bindings: {
        owner: '=',
        chart: "<",
        globalFilter: "<",
        globalFilterChange: "<",
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
