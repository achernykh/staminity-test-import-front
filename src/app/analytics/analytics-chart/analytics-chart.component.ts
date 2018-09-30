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
import {AnalyticsService} from "@app/analytics/analytics.service";
import {AnalyticsDialogService} from "@app/analytics/analytics-dialog.service";
import {IAnalyticsChartCompareSettings} from "@app/analytics/analytics-chart/analytics-chart.interface";

const prepareUsers = (param: string, athletes: IUserProfileShort[]): number[] => {
    switch (param) {
        case 'first5': return athletes.filter((a, i) => i < 5).map((a) => a.userId);
    }
};

class AnalyticsChartCtrl implements IComponentController {

    owner: IUserProfile;
    //analytics: AnalyticsCtrl;
    chart: AnalyticsChart;
    globalFilter: AnalyticsChartFilter;
    settingsChange: number;
    refresh: number;

    private descriptionParams: Object = {};
    private settings: Array<IAnalyticsChartSettings<any>>;
    private compareSettings: IAnalyticsChartCompareSettings;
    private filterChange: number = null;
    private errorStack: string[] = [];

    onChangeFilter: () => IPromise<void>;
    onFullScreen: () => IPromise<void>;

    updateCount: number = 0;

    static $inject = ["$scope", "statistics", "$mdDialog", "$filter", "AnalyticsService", "AnalyticsDialogService"];

    constructor (
        private $scope: IScope,
        private statistics: StatisticsService,
        private $mdDialog: any,
        private $filter: any,
        private analyticsService: AnalyticsService,
        private analyticsDialogService: AnalyticsDialogService) {

        this.analyticsService.item$
            .filter(m => m.value.code === this.chart.code || m.value.id === this.chart.id)
            .subscribe(message => {
                switch (message.action) {
                    case "I": case "U": {
                        //this.chart.update(message.value);
                        break;
                    }
                    case "D": {
                        this.chart = new AnalyticsChart(
                            this.chart.template, //Object.assign(c, {isAuthorized: this.auth.isAuthorized(c.auth)}),
                            this.chart.user,
                            this.globalFilter,
                            this.chart.$filter);
                        break;
                    }
                }
                this.loadData();
            });

    }

    $onInit () {

    }

    $onChanges (changes): void {
        /**if (changes.hasOwnProperty('settingsChange') && this.settingsChange > 0) {
            return;
        }**/
        if ((changes.hasOwnProperty("chart") && changes.chart.isFirstChange() && this.settingsChange === 0) ||
            (changes.hasOwnProperty("refresh") && this.refresh > 0)) {
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
        this.prepareCompareSettings();
        this.prepareTitleContext();
        this.prepareParams();
        this.prepareData();
        this.prepareMeasures();
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
                                settings="$ctrl.settings"
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
                settings: this.settings,
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
        //this.chart = copy(chart);
        /*this.prepareSettings();
        this.prepareCompareSettings();
        this.prepareTitleContext();
        if ( update ) {
            this.prepareParams();
            this.prepareData();
            this.prepareMeasures();
        }
        this.updateCount++;*/
    }

    grow () {
        this.chart.layout.gridColumnEnd === 1 ? this.chart.layout.gridColumnEnd = 2 : this.chart.layout.gridColumnEnd = 1;
        //this.chart.layout.gridColumnEnd === 2 && this.chart.layout.gridRowEnd === 1 ? this.chart.layout.gridRowEnd = 2 : angular.noop();
        //this.chart.layout.gridColumnEnd === 2 && this.chart.layout.gridRowEnd === 2 ? this.chart.layout.gridRowEnd = 1 : angular.noop();
        this.updateCount++;
    }

    fullScreen (e: Event) {
        this.analyticsDialogService.fullScreen(e, this.owner, this.chart ).then();
        /**this.chart.layout.fullScreen = !this.chart.layout.fullScreen;
        setTimeout(() => {
            this.updateCount++;
            this.$scope.$apply();
        }, 1);**/
    }

    private prepareCompareSettings (): void {
        this.compareSettings = this.chart.localCompareSettings || this.chart.compareSettings || null;
        if (this.compareSettings) {
            this.compareSettings.mode = (this.chart.localParams && this.chart.localParams.periods &&
                this.chart.localParams.periods.model) || this.globalFilter.periods.model;
        }
    }

    private prepareTitleContext () {
        if ( this.chart.hasOwnProperty("descriptionParams") ) {
            this.chart.descriptionParams.map((c) => {
                this.descriptionParams[c.param] = c.area === 'params' ?
                    this.chart.charts[c.ind][c.area][c.param] :
                    this.chart.charts[c.ind][c.area].filter((s) => s.idx === c.idx)[0][c.param];
            });
        }
        if ( this.compareSettings && this.compareSettings.type === 'periods' ) {
            this.descriptionParams['comparePeriod'] = comparePeriodType(this.compareSettings.mode);
        }
    }
    private prepareSettings (): void {
        if (!this.chart.settings) {return;}
        this.settings = copy(this.chart.settings);
        if (this.chart.localSettings && Array.isArray(this.chart.localSettings)) {
            this.chart.localSettings.map(ls =>
                this.settings.filter(gs =>
                    gs.text === ls.text)[0].model = ls.model);
        }
        this.settings.map(s => this.chart.changeSettings(s, s.model));
    }

    private prepareData (): void {
        if (!this.chart.data) {return;}
        this.chart.data.map(d => d.compile.value = null);
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
        if ( this.compareSettings && this.compareSettings.visible ) {
            this.chart.charts[this.chart.compareSettings.ind].params.periods =
                periodByType(comparePeriodType(this.compareSettings.mode));
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

    getLocalChanges (): number {
        let chParams: number = this.chart.localParams && Object.keys(this.chart.localParams).length || 0;
        let chSettings: number = this.chart.localSettings && this.chart.localSettings.length || 0;
        return chParams + chSettings;
    }

    private prepareMeasures () {
        const request: IReportRequestData = {charts: this.chart.charts,};
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
        settingsChange: '<',
        refresh: '<',
        panelChanges: "<",
        onClose: "&",
        onChangeFilter: "&",
        onExpand: "&",
        onCollapse: "&",
        onFullScreen: "&",
    },
    require: {
        //analytics: "^stAnalytics",
    },
    controller: AnalyticsChartCtrl,
    template: require("./analytics-chart.component.html") as string,
};

export default AnalyticsChartComponent;
