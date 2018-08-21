import "./analytics-chart-settings.component.scss";
import { copy, IComponentController, IComponentOptions, INgModelController, IPromise } from "angular";
import { activityTypes } from "../../activity/activity.constants";
import { AnalyticsChartFilter, IAnalyticsChartSettings } from "../analytics-chart-filter/analytics-chart-filter.model";
import { IAnalyticsChart } from "../analytics-chart/analytics-chart.interface";
import { AnalyticsService } from "../analytics.service";
import MessageService from "../../core/message.service";

class AnalyticsChartSettingsCtrl implements IComponentController {

    chart: IAnalyticsChart;

    private globalFilter: AnalyticsChartFilter;
    private localFilter: AnalyticsChartFilter;

    private globalParams: boolean = null;
    private settings: Array<IAnalyticsChartSettings<any>>;

    private update: boolean = false;
    private refresh: boolean = false;

    private settingsForm: INgModelController;
    private isChangeLocalParams: boolean = false;
    private isChangeSettings: boolean = false;

    onSave: (response: {chart: IAnalyticsChart, update: boolean}) => IPromise<void>;
    static $inject = ["$filter", 'AnalyticsService', 'message'];

    constructor (private $filter: any, private analyticsService: AnalyticsService, private messageService: MessageService) {}

    $onInit () {
        this.prepareLocalFilter("fromGlobal");
        /**if ( this.chart.hasOwnProperty("localParams") && !this.chart.localParams ) {
            this.prepareLocalFilter("fromGlobal");
        }

        if ( this.chart.hasOwnProperty("localParams") && this.chart.localParams ) {
            this.prepareLocalFilter("fromSettings");
        }

        this.globalParams = copy(this.chart.globalParams);**/
        this.settings = copy(this.chart.settings);
    }

    private prepareLocalFilter (mode: "fromSettings" | "fromGlobal" = "fromSettings") {
        if ( mode === "fromSettings" && this.chart.localParams ) {
            this.localFilter = this.chart.localParams as AnalyticsChartFilter;
        }

        if ( mode === "fromGlobal" ) {
            this.localFilter = new AnalyticsChartFilter(
                this.globalFilter.user,
                this.globalFilter.categories,
                this.chart.localParams,
                this.$filter);
            this.localFilter.setUsersModel(this.globalFilter.users.model);
            this.localFilter.setActivityTypes(this.globalFilter.activityTypes.model, "single", false);
            this.localFilter.setActivityTypesOptions(activityTypes);
            this.localFilter.setActivityCategories(this.globalFilter.activityCategories.model);
            this.localFilter.setPeriods(
                this.chart.localParams && this.chart.localParams.periods && this.chart.localParams.periods.model || this.globalFilter.periods.model,
                this.chart.localParams && this.chart.localParams.periods && this.chart.localParams.periods.data || this.globalFilter.periods.data);
        }
    }

    changeParamsPoint () {
        if ( !this.globalParams ) {
            this.prepareLocalFilter("fromGlobal");
        }
    }

    changeParams (param: string): void {
        this.localFilter.changeParam(param);
        let localModel: any = JSON.parse(JSON.stringify(this.localFilter[param].model));
        let globalModel: any = JSON.parse(JSON.stringify(this.globalFilter[param].model));

        /**console.debug('change', param, localModel, globalModel,
            localModel && localModel.length !== globalModel.length,
            param !== 'periods' ? localModel.some(v => globalModel.indexOf(v) === -1) : localModel !== globalModel);**/

        if (localModel && globalModel &&
            param === 'periods' ?
                localModel !== globalModel :
                localModel.length !== globalModel.length || localModel.some(v => globalModel.indexOf(v) === -1)) {
            this.chart.localParams = Object.assign(this.chart.localParams || {}, {[param]:  this.localFilter[param]});
            this.isChangeLocalParams = true;
        }
    }

    changeSettings (param: IAnalyticsChartSettings<any>, value) {
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
                            .filter((m) => param.idx.indexOf(m.idx) !== -1)
                            .map((m) => Object.keys(param.change[value]).map((k) => m[k] = param.change[value][k])),
                    //.map(s => s[param.name] = value)
                );
                break;
            }
        }

        if ( Object.keys(param.change[value]).some((change) => ["seriesDateTrunc", "unit", "measureName"].indexOf(change) !== -1) ) {
            this.refresh = true;
        }
        this.isChangeSettings = true;
    }

    getGroupCheckboxStatus (param: IAnalyticsChartSettings<any>, idx: number): boolean {
        return param.model[param.idx.indexOf(idx)];
    }

    setGroupCheckboxStatus (param: IAnalyticsChartSettings<any>, idx: number) {
        param.model[param.idx.indexOf(idx)] = !param.model[param.idx.indexOf(idx)];
        this.changeSettings(Object.assign({}, param, { idx: [idx] }), param.model[param.idx.indexOf(idx)]);
        this.settingsForm.$setDirty();
    }

    getCheckboxLabel (param: IAnalyticsChartSettings<any>, idx: number): string {
        return this.chart.charts[param.ind[0]].measures.filter((a) => a.idx === idx)[0][param.multiTextParam];
    }

    save () {
        /**if ( !this.globalParams ) {
            this.chart.charts[0].params = this.localFilter.chartParams();
            this.chart.localParams = this.localFilter;
        }**/
        let changes: any = {};
        if ( this.isChangeSettings ) { this.chart.settings = changes.settings = this.settings; }
        if ( this.isChangeLocalParams ) { changes.localParams = this.chart.localParams; }
        if (changes) {
            this.analyticsService.saveChartSettings(this.chart.code, {...changes})
                .then(_ => this.messageService.toastInfo('analyticsSaveChartSettingsComplete'),
                    e => e ? this.messageService.toastError(e) : this.messageService.toastError('analyticsSaveChartSettingsError'));
        }
        this.onSave({
            chart: Object.assign(this.chart, { globalParams: this.globalParams }),
            update: this.refresh || (this.localFilter && this.localFilter.change > 0),
        });
    }
}

const AnalyticsChartSettingsComponent: IComponentOptions = {
    bindings: {
        chart: "=",
        globalFilter: "=",
        categoriesByOwner: "=",
        onCancel: "&",
        onSave: "&",
    },
    require: {
        //analytics: '^analytics'
    },
    controller: AnalyticsChartSettingsCtrl,
    template: require("./analytics-chart-settings.component.html") as string,
};

export default AnalyticsChartSettingsComponent;
