import './analytics.component.scss';
import {IComponentOptions, IComponentController, IPromise, IScope} from 'angular';
import {chart_example_01} from '../share/universal-chart/data/10.1_PMC_chart_four_measures.js';
import {chart_example_02} from '../share/universal-chart/data/10.2.1_Two_IChart_four_measures.js';
import {chart_example_03} from '../share/universal-chart/data/10.2.2_Two_IChart_four_measures.js';
import {chart_example_04} from '../share/universal-chart/data/10.2_Two_IChart_four_measures.js';
import {chart_example_05} from '../share/universal-chart/data/11_Cumulative_Duration_by_days.js';
import {chart_example_06} from '../share/universal-chart/data/12_HR-and-pace-by-days.js';
import {chart_example_07} from '../share/universal-chart/data/16-Table-with-4-series.js';
import {chart_example_08} from '../share/universal-chart/data/donutChart.js';
import {chart_example_09} from '../share/universal-chart/data/pieChart.js';
import {IReportRequestData, IChart} from "../../../api/statistics/statistics.interface";
import {ISessionService, getUser} from "../core/session.service";
import StatisticsService from "../core/statistics.service";
import {IAnalyticsChart, AnalyticsChart} from "./analytics-chart/analytics-chart.model";
import {IUserProfile, IUserProfilePublic, IUserProfileShort} from "../../../api/user/user.interface";
import {Subject} from "rxjs/Rx";
import {activityTypes, getSportBasic} from "../activity/activity.constants";
import {IActivityType} from "../../../api/activity/activity.interface";
import {
    IAnalyticsChartFilterParam, IReportPeriodOptions,
    PeriodOptions
} from "./analytics-chart-filter/analytics-chart-filter.model";
import {IActivityCategory} from "../../../api/reference/reference.interface";
import ReferenceService from "../reference/reference.service";
import {Owner, getOwner} from "../reference/reference.datamodel";
import { pipe, orderBy, prop, groupBy } from "../share/util.js";
import {IStorageService} from "../core/storage.service";


export class AnalyticsCtrl implements IComponentController {

    public data: any;
    public charts: Array<AnalyticsChart>;
    public onEvent: (response: Object) => IPromise<void>;

    private filter: {
        users: IAnalyticsChartFilterParam<IUserProfileShort>;
        activityTypes: IAnalyticsChartFilterParam<IActivityType>;
        activityCategories: IAnalyticsChartFilterParam<IActivityCategory>;
        periods: IAnalyticsChartFilterParam<string>;
    } = {
        users: null,
        activityTypes: null,
        activityCategories: null,
        periods: null
    };

    private filterChanges: number = null;

    private prepareComplete: boolean = false;

    public user: IUserProfile;
    public categoriesByOwner: {[owner in Owner]: Array<IActivityCategory>};

    private destroy: Subject<any> = new Subject();

    static $inject = ['$scope','SessionService','statistics', 'storage', 'ReferenceService', 'analyticsDefaultSettings'];

    constructor(private $scope: IScope,
                private session: ISessionService,
                private statistics: StatisticsService,
                private storage: IStorageService,
                private reference: ReferenceService,
                private defaultSettings: Array<IAnalyticsChart>) {

        session.getObservable()
            .takeUntil(this.destroy)
            .map(getUser)
            .subscribe(userProfile => {
                this.user = userProfile;
                this.prepareData();
            });

        reference.categoriesChanges
            .takeUntil(this.destroy)
            .subscribe(categories => {
                this.prepareData();
                this.$scope.$apply();
            });
    }

    $onInit() {
    }

    $onDestroy() {
        this.destroy.next();
        this.destroy.complete();
    }

    private prepareData() {

        if(this.prepareComplete) {
            return;
        }

        let storageCharts: any = null;
        let storageFilters: {
            users: IAnalyticsChartFilterParam<IUserProfileShort>;
            activityTypes: IAnalyticsChartFilterParam<IActivityType>;
            activityCategories: IAnalyticsChartFilterParam<IActivityCategory>;
            periods: IAnalyticsChartFilterParam<IReportPeriodOptions>;
        } = null;

        storageCharts = this.getSettings('charts'); //&& this.getSettings('charts').map(c => new AnalyticsChart(c, this.user));
        storageFilters = this.getSettings('filter');

        this.prepareCharts(storageCharts || this.defaultSettings);
        this.prepareUsersFilter(this.user, storageFilters && storageFilters.users.model);
        this.prepareSportTypesFilter(storageFilters && storageFilters.activityTypes.model);
        this.prepareCategoriesFilter(this.reference.categories, this.user, storageFilters && storageFilters.activityCategories.model);
        this.preparePeriodsFilter(storageFilters && storageFilters.periods.model);
        this.saveSettings('charts');
        this.saveSettings('filter');
        this.prepareComplete = true;
    }

    changeGlobalFilter() {
        this.filterChanges++;
    }

    restoreSettings() {
        this.storage.remove(`${this.user.userId}#analytics_charts`);
        this.storage.remove(`${this.user.userId}#analytics_filter`);
        this.filter = {
            users: null,
            activityTypes: null,
            activityCategories: null,
            periods: null
        };
        this.prepareComplete = false;

        let storageCharts: any = null;
        let storageFilters: {
            users: IAnalyticsChartFilterParam<IUserProfileShort>;
            activityTypes: IAnalyticsChartFilterParam<IActivityType>;
            activityCategories: IAnalyticsChartFilterParam<IActivityCategory>;
            periods: IAnalyticsChartFilterParam<IReportPeriodOptions>;
        } = null;

        this.prepareCharts(this.defaultSettings);
        this.prepareUsersFilter(this.user);
        this.prepareSportTypesFilter();
        this.prepareCategoriesFilter(this.reference.categories, this.user);
        this.preparePeriodsFilter();
        this.saveSettings('charts');
        this.saveSettings('filter');
        this.prepareComplete = true;
    }

    private getSettings(obj: string): any {
        return this.storage.get(`${this.user.userId}#analytics_${obj}`);
    }

    private saveSettings(obj: string) {
        this.storage.set(`${this.user.userId}#analytics_${obj}`,this[obj]);
    }

    private prepareCharts(charts: Array<IAnalyticsChart>) {
        this.charts = charts.map(c => new AnalyticsChart(c, this.user));
    }

    private prepareUsersFilter(user: IUserProfile, restore?: any) {
        this.filter.users = {
            type: 'checkbox',
            area: 'params',
            name: 'users',
            text: 'users',
            model: restore || null,
            options: []
        };

        this.filter.users.options.push({
            userId: user.userId,
            public: user.public
        });

        if(user.public.isCoach && user.connections.hasOwnProperty('allAthletes')) {
            this.filter.users.options.push(...user.connections.allAthletes.groupMembers.map(a => ({
                    userId: a.userId,
                    public: a.public
                })));
        }

        if(!this.filter.users.model) {
            this.filter.users.model = this.filter.users.options[0].userId;
        }
    }

    private prepareSportTypesFilter(restore?: any) {
        this.filter.activityTypes = {
            type: 'checkbox',
            area: 'params',
            name: 'activityTypes',
            text: 'activityTypes',
            model: restore || null,
            options: getSportBasic()
        };
        if(!this.filter.activityTypes.model){
            this.filter.activityTypes.model = [this.filter.activityTypes.options[0].id];
        }
    }

    private prepareCategoriesFilter(categoriesList: Array<IActivityCategory>, userProfile: IUserProfile, restore?: any) {

        this.filter.activityCategories = {
            type: 'checkbox',
            area: 'params',
            name: 'activityCategories',
            text: 'activityCategories',
            model: restore || [],
            options: categoriesList
        };

        this.categoriesByOwner = pipe(
            orderBy(prop('sortOrder')),
            groupBy(getOwner(userProfile))
        ) (categoriesList);
    }

    private preparePeriodsFilter(model?: any) {
        this.filter.periods = {
            type: 'date',
            area: 'params',
            name: 'periods',
            text: 'periods',
            model: model || null,
            options: ['thisYear','thisMonth','thisWeek','customPeriod']
        };
        if(!this.filter.periods.model){
            this.filter.periods.model = this.filter.periods.options[0];
        }
    }
}

const AnalyticsComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: AnalyticsCtrl,
    template: require('./analytics.component.html') as string
};

export default AnalyticsComponent;