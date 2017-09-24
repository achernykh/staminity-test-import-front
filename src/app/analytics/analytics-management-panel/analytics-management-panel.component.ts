import './analytics-management-panel.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {AnalyticsCtrl} from "../analytics.component";
import {IAnalyticsChartFilterParam, IReportPeriodOptions} from "../analytics-chart-filter/analytics-chart-filter.model";
import {IUserProfileShort} from "../../../../api/user/user.interface";
import {IActivityType} from "../../../../api/activity/activity.interface";
import {IActivityCategory} from "../../../../api/reference/reference.interface";

class AnalyticsManagementPanelCtrl implements IComponentController {

    public data: any;
    private filter: {
        users: IAnalyticsChartFilterParam<IUserProfileShort>;
        activityTypes: IAnalyticsChartFilterParam<IActivityType>;
        activityCategories: IAnalyticsChartFilterParam<IActivityCategory>;
        periods: IAnalyticsChartFilterParam<IReportPeriodOptions>;
    };

    private analytics: AnalyticsCtrl;
    public onChange: (response: Object) => IPromise<void>;

    static $inject = ['$filter'];

    constructor(private $filter: any) {

    }

    $onInit() {

    }

    change(filter: string) {
        switch (filter) {
            case 'activityType':
                this.filter.activityTypes.model = this.filter.activityTypes.model.map(v => Number(v));
                break;
        }
        this.onChange({});
    }

    usersSelectedText():string {
        if(this.filter.users.model && this.filter.users.model.length > 0) {
            return `${this.$filter('username')(
                this.filter.users.options.filter(u => u.userId === Number(this.filter.users.model[0]))[0])}      
                ${this.filter.users.model.length > 1 ?
                    this.$filter('translate')('analytics.filter.more',{num: this.filter.users.model.length - 1}) : ''}`;

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
            return `${this.$filter('translate')('analytics.param.' +
                this.filter.periods.options.filter(p => p.period.startDate === JSON.parse(this.filter.periods.model).startDate &&
                    p.period.endDate === JSON.parse(this.filter.periods.model).endDate)[0].name)}`;

        } else {
            return this.$filter('translate')('analytics.filter.periods.empty');
        }
    }
}

const AnalyticsManagementPanelComponent:IComponentOptions = {
    bindings: {
        charts: '<',
        filter: '<',
        onChange: '&'
    },
    require: {
        analytics: '^analytics'
    },
    controller: AnalyticsManagementPanelCtrl,
    template: require('./analytics-management-panel.component.html') as string
};

export default AnalyticsManagementPanelComponent;