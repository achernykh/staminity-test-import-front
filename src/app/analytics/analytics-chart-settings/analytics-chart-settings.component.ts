import './analytics-chart-settings.component.scss';
import moment from 'moment/src/moment.js';
import {IComponentOptions, IComponentController, IPromise, copy} from 'angular';
import {IUserProfileShort} from "../../../../api/user/user.interface";
import {IActivityType} from "../../../../api/activity/activity.interface";
import {IActivityCategory} from "../../../../api/reference/reference.interface";
import {IReportPeriod, IChartMeasure, IChart} from "../../../../api/statistics/statistics.interface";
import {
    IAnalyticsChartFilterParam, IReportPeriodOptions,
    periodByType
} from "../analytics-chart-filter/analytics-chart-filter.model";
import {IAnalyticsChart} from "../analytics-chart/analytics-chart.model";

class AnalyticsChartSettingsCtrl implements IComponentController {

    public chart: IAnalyticsChart;

    private globalFilter: {
        users: IAnalyticsChartFilterParam<IUserProfileShort>;
        activityTypes: IAnalyticsChartFilterParam<IActivityType>;
        activityCategories: IAnalyticsChartFilterParam<IActivityCategory>;
        periods: IAnalyticsChartFilterParam<IReportPeriodOptions>;
    };

    private settings: Array<IAnalyticsChartFilterParam<any>>;

    private update: boolean = false;

    public onSave: (response: {chart: IAnalyticsChart, update: boolean}) => IPromise<void>;
    static $inject = ['$filter'];

    constructor(private $filter: any) {

    }

    $onInit() {
        if(!this.chart.globalParams && this.chart.hasOwnProperty('localParams') && !this.chart.localParams) {
            this.chart.localParams = copy(this.globalFilter);
        }
    }

    changeParamsPoint() {
        if(!this.chart.globalParams) {
            this.chart.localParams = copy(this.globalFilter);
        }
    }

    change(param: IAnalyticsChartFilterParam<any>, value) {
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
                switch (param.name) {
                    case 'users': case 'activityTypes':
                        value = value.map(v => Number(v));
                        break;
                    case 'periods': {
                        if(this.chart.localParams.periods.model === 'customPeriod') {
                            let period: Array<IReportPeriod>;
                            if(!this.chart.localParams.periods.startDate && !this.chart.localParams.periods.endDate){
                                period = periodByType('thisYear');
                                [this.chart.localParams.periods.startDate, this.chart.localParams.periods.endDate] =
                                    [new Date(moment().startOf('year')), new Date()];
                            }
                            value = [{
                                startDate: moment(this.chart.localParams.periods.startDate).format('YYYYMMDD'),
                                endDate: moment(this.chart.localParams.periods.endDate).format('YYYYMMDD')
                            }];
                        } else {
                            value = periodByType(value);
                        }
                        break;
                    }
                }
                this.chart.charts[0].params[param.name] = value;
                this.prepareDescription();
            }
        }

        if(param.area === 'params' ||
            Object.keys(param.change[value]).some(change => ['seriesDateTrunc','cumulative','measureName'].indexOf(change) !== -1)) {
            this.update = true;
        }
        //this.prepareTitleContext();
    }

    private prepareDescription() {
        this.chart.paramsDescription =
            `${this.$filter('translate')('analytics.filter.periods.placeholder')}: 
                ${this.chart.localParams.periods.model !== 'customPeriod' ?
                this.$filter('translate')('analytics.params.' + this.chart.localParams.periods.model) :
                this.$filter('date')(moment(this.chart.charts[0].params.periods[0].startDate).toDate(),'shortDate') + '-' +
                this.$filter('date')(moment(this.chart.charts[0].params.periods[0].endDate).toDate(),'shortDate')}, 
            ${this.$filter('translate')('analytics.filter.activityTypes.placeholder')}: ${this.activityTypesSelectedText()}`;
    }

    usersSelectedText():string {
        if(this.chart.localParams.users.model && this.chart.localParams.users.model.length > 0) {
            return `${this.$filter('username')(
                this.chart.localParams.users.options.filter(u => u.userId === Number(this.chart.localParams.users.model[0]))[0])}      
                ${this.chart.localParams.users.model.length > 1 ?
                this.$filter('translate')('analytics.filter.more',{num: this.chart.localParams.users.model.length - 1}) : ''}`;

        } else {
            return this.$filter('translate')('analytics.filter.users.empty');
        }

    }

    activityTypesSelectedText():string {
        if(this.chart.localParams.activityTypes.model && this.chart.localParams.activityTypes.model.length > 0) {
            return `${this.$filter('translate')('sport.' +
                this.chart.localParams.activityTypes.options.filter(t => t.id === Number(this.chart.localParams.activityTypes.model[0]))[0].code)}
                ${this.chart.localParams.activityTypes.model.length > 1 ?
                this.$filter('translate')('analytics.filter.more',{num: this.chart.localParams.activityTypes.model.length - 1}) : ''}`;
        } else {
            return this.$filter('translate')('analytics.filter.activityTypes.empty');
        }
    }

    activityCategoriesSelectedText():string {
        if(this.chart.localParams.activityCategories.model && this.chart.localParams.activityCategories.model.length > 0) {
            return `${this.$filter('categoryCode')(
                this.chart.localParams.activityCategories.options.filter(c => c.id === this.chart.localParams.activityCategories.model[0])[0])}
                ${this.chart.localParams.activityCategories.model.length > 1 ?
                this.$filter('translate')('analytics.filter.more',{num: this.chart.localParams.activityCategories.model.length - 1}) : ''}`;
        } else {
            return this.$filter('translate')('analytics.filter.activityCategories.empty');
        }
    }


    periodsSelectedText(): string {
        if(this.chart.localParams.periods.model) {
            return `${this.$filter('translate')('analytics.params.' + this.chart.localParams.periods.model)}`;
        } else {
            return this.$filter('translate')('analytics.filter.periods.empty');
        }
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