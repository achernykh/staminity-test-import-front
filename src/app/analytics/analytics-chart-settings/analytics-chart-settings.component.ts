import './analytics-chart-settings.component.scss';
import moment from 'moment/src/moment.js';
import {IComponentOptions, IComponentController, IPromise, copy, INgModelController} from 'angular';
import {IUserProfileShort} from "../../../../api/user/user.interface";
import {IActivityType} from "../../../../api/activity/activity.interface";
import {IActivityCategory} from "../../../../api/reference/reference.interface";
import {IReportPeriod, IChartMeasure, IChart} from "../../../../api/statistics/statistics.interface";
import {
    IAnalyticsChartSettings, IReportPeriodOptions,
    periodByType, AnalyticsChartFilter
} from "../analytics-chart-filter/analytics-chart-filter.model";
import {IAnalyticsChart} from "../analytics-chart/analytics-chart.model";
import {activityTypes, getSportsByBasicId} from "../../activity/activity.constants";

class AnalyticsChartSettingsCtrl implements IComponentController {

    public chart: IAnalyticsChart;

    private globalFilter: AnalyticsChartFilter;
    private localFilter: AnalyticsChartFilter;

    private globalParams: boolean = null;
    private settings: Array<IAnalyticsChartSettings<any>>;

    private update: boolean = false;
    private refresh: boolean = false;

    private settingsForm: INgModelController;

    public onSave: (response: {chart: IAnalyticsChart, update: boolean}) => IPromise<void>;
    static $inject = ['$filter'];

    constructor(private $filter: any) {

    }

    $onInit() {
        if(this.chart.hasOwnProperty('localParams') && !this.chart.localParams) {
            this.prepareLocalFilter();
        }

        if(this.chart.hasOwnProperty('localParams') && this.chart.localParams) {
            this.prepareLocalFilter('fromSettings');
        }

        this.globalParams = copy(this.chart.globalParams);
        this.settings = copy(this.chart.settings);
    }

    private prepareLocalFilter(mode: 'fromSettings' | 'fromGlobal' = 'fromSettings') {
        this.localFilter = new AnalyticsChartFilter(
            this.globalFilter.user,
            this.globalFilter.categories,
            this.chart.localParams,
            this.$filter);

        if(mode === 'fromGlobal') {
            this.localFilter.setUsersModel([this.globalFilter.users.model]);
            this.localFilter.setActivityTypes(this.globalFilter.activityTypes.model, 'basic', true);
            this.localFilter.setActivityTypesOptions(activityTypes);
            this.localFilter.setActivityCategories(this.globalFilter.activityCategories.model);
            this.localFilter.setPeriods(this.globalFilter.periods.model, this.globalFilter.periods.data);
        }
    }

    changeParamsPoint() {
        if(!this.chart.globalParams) {
            this.prepareLocalFilter('fromGlobal');
        }
    }

    change(param: IAnalyticsChartSettings<any>, value) {
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
                            .filter(m => param.idx.indexOf(m.idx) !== -1)
                            .map(m => Object.keys(param.change[value]).map(k => m[k] = param.change[value][k]))
                    //.map(s => s[param.name] = value)
                );
                break;
            }
        }

        if(Object.keys(param.change[value]).some(change => ['seriesDateTrunc','unit','measureName'].indexOf(change) !== -1)) {
            this.refresh = true;
        }
        this.update = true;
    }


    getGroupCheckboxStatus(param: IAnalyticsChartSettings<any>, idx: number): boolean {
        return param.model[param.idx.indexOf(idx)];
    }

    setGroupCheckboxStatus(param: IAnalyticsChartSettings<any>, idx: number){
        param.model[param.idx.indexOf(idx)] = !param.model[param.idx.indexOf(idx)];
        this.change(Object.assign({},param,{idx: [idx]}), param.model[param.idx.indexOf(idx)]);
        this.settingsForm.$setDirty();
    }

    getCheckboxLabel(param: IAnalyticsChartSettings<any>, idx: number): string {
        return this.chart.charts[param.ind[0]].measures.filter(a => a.idx === idx)[0][param.multiTextParam];
    }

    save() {
        if(!this.globalParams) {
            this.chart.charts[0].params = this.localFilter.chartParams();
            this.chart.localParams = this.localFilter.save();
        }
        if(this.update) {
            this.chart.settings = this.settings;
        }
        this.onSave({
            chart: Object.assign(this.chart, { globalParams: this.globalParams }),
            update: this.refresh || (this.localFilter && this.localFilter.change > 0)
        });
    }
}

const AnalyticsChartSettingsComponent:IComponentOptions = {
    bindings: {
        chart: '<',
        globalFilter: '<',
        categoriesByOwner: '<',
        onCancel: '&',
        onSave: '&'
    },
    require: {
        //analytics: '^analytics'
    },
    controller: AnalyticsChartSettingsCtrl,
    template: require('./analytics-chart-settings.component.html') as string
};

export default AnalyticsChartSettingsComponent;