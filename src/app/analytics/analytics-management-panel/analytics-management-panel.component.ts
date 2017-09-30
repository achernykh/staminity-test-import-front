import './analytics-management-panel.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {AnalyticsCtrl} from "../analytics.component";
import {
    IAnalyticsChartFilterParam, IReportPeriodOptions,
    periodByType
} from "../analytics-chart-filter/analytics-chart-filter.model";
import {IUserProfileShort} from "../../../../api/user/user.interface";
import {IActivityType} from "../../../../api/activity/activity.interface";
import {IActivityCategory} from "../../../../api/reference/reference.interface";
import {IReportPeriod} from "../../../../api/statistics/statistics.interface";
import moment from 'moment/src/moment.js';

class AnalyticsManagementPanelCtrl implements IComponentController {

    public data: any;
    private filter: {
        users: IAnalyticsChartFilterParam<IUserProfileShort>;
        activityTypes: IAnalyticsChartFilterParam<IActivityType>;
        activityCategories: IAnalyticsChartFilterParam<IActivityCategory>;
        periods: IAnalyticsChartFilterParam<IReportPeriodOptions>;
    };

    private panel: 'filters' | 'settings' | 'hide' = 'filters';
    private startDate: Date;
    private endDate: Date;

    private analytics: AnalyticsCtrl;
    public onChangeFilter: () => IPromise<void>;
    public onChangeCharts: () => IPromise<void>;

    static $inject = ['$filter'];

    constructor(private $filter: any) {

    }

    $onInit() {

    }

    change(filter: string) {
        switch (filter) {
            case 'users': {
                this.filter.users.model = this.filter.users.model.map(v => Number(v));
                break;
            }
            case 'activityType':
                this.filter.activityTypes.model = this.filter.activityTypes.model.map(v => Number(v));
                break;
        }
        if(filter === 'periods' && this.filter.periods.model === 'customPeriod'){
            let period: Array<IReportPeriod>;
            if(!this.startDate && !this.endDate){
                period = periodByType('thisYear');
                [this.startDate, this.endDate] = [new Date(moment().startOf('year')), new Date()];
            }
            this.filter.periods.data = [{
                startDate: moment(this.startDate).format('YYYYMMDD'),
                endDate: moment(this.endDate).format('YYYYMMDD')
            }];
        }
        this.onChangeFilter();
    }

    usersSelectedText():string {
        if(this.filter.users.model) {
            return `${this.$filter('username')(
                this.filter.users.options.filter(u => u.userId === Number(this.filter.users.model))[0])}`;
        } else {
            return this.$filter('translate')('analytics.filter.users.empty');
        }

    }

    activityTypesSelectedText():string {
        if(this.filter.activityTypes.model && this.filter.activityTypes.model.length > 0) {
            return `${this.$filter('translate')('sport.' +
                this.filter.activityTypes.options.filter(t => t.id === Number(this.filter.activityTypes.model[0]))[0].code)}
                ${this.filter.activityTypes.model.length > 1 ?
                    this.$filter('translate')('analytics.filter.more',{num: this.filter.activityTypes.model.length - 1}) : ''}`;
        } else {
            return this.$filter('translate')('analytics.filter.activityTypes.empty');
        }
    }

    activityCategoriesSelectedText():string {
        if(this.filter.activityCategories.model && this.filter.activityCategories.model.length > 0) {
            return `${this.$filter('categoryCode')(
                this.filter.activityCategories.options.filter(c => c.id === this.filter.activityCategories.model[0])[0])}
                ${this.filter.activityCategories.model.length > 1 ?
                    this.$filter('translate')('analytics.filter.more',{num: this.filter.activityCategories.model.length - 1}) : ''}`;
        } else {
            return this.$filter('translate')('analytics.filter.activityCategories.empty');
        }
    }


    periodsSelectedText(): string {
        if(this.filter.periods.model) {
            return `${this.$filter('translate')('analytics.params.' + this.filter.periods.model)}`;
        } else {
            return this.$filter('translate')('analytics.filter.periods.empty');
        }
    }
}

const AnalyticsManagementPanelComponent:IComponentOptions = {
    bindings: {
        charts: '<',
        filter: '<',
        onChangeFilter: '&',
        onChangeCharts: '&'
    },
    require: {
        analytics: '^analytics'
    },
    controller: AnalyticsManagementPanelCtrl,
    template: require('./analytics-management-panel.component.html') as string
};

export default AnalyticsManagementPanelComponent;