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
    IAnalyticsChartSettings, IReportPeriodOptions,
    PeriodOptions, AnalyticsChartFilter, IAnalyticsChartFilter
} from "./analytics-chart-filter/analytics-chart-filter.model";
import {IActivityCategory} from "../../../api/reference/reference.interface";
import ReferenceService from "../reference/reference.service";
import {Owner, getOwner} from "../reference/reference.datamodel";
import { pipe, orderBy, prop, groupBy } from "../share/util.js";
import {IStorageService} from "../core/storage.service";
import {IAuthService} from "../auth/auth.service";


export class AnalyticsCtrl implements IComponentController {

    public user: IUserProfile;
    public categories: Array<IActivityCategory>;
    public charts: Array<AnalyticsChart>;
    public onEvent: (response: Object) => IPromise<void>;

    public filter: AnalyticsChartFilter;

    private globalFilterChange: number = null;

    private readonly storage = {
        name: '#analytics',
        charts: 'charts',
        filter: 'filter'
    };

    private destroy: Subject<any> = new Subject();

    static $inject = ['$scope','SessionService','statistics', 'storage', 'ReferenceService', 'analyticsDefaultSettings',
        'AuthService', '$filter'];

    constructor(private $scope: IScope,
                private session: ISessionService,
                private statistics: StatisticsService,
                private storageService: IStorageService,
                private reference: ReferenceService,
                private defaultSettings: Array<IAnalyticsChart>,
                private auth: IAuthService,
                private $filter: any) {

        session.getObservable()
            .takeUntil(this.destroy)
            .map(getUser)
            .subscribe(userProfile => {
                //this.user = userProfile;
                //this.prepareData(); // change options for users
            });

        reference.categoriesChanges
            .takeUntil(this.destroy)
            .subscribe(categories => {
                this.filter.setCategoriesOption(categories);
                this.$scope.$apply();
            });
    }

    $onInit() {

        this.prepareCharts(this.getSettings(this.storage.charts) || this.defaultSettings);
        this.filter = new AnalyticsChartFilter(
            this.user,
            this.categories,
            this.getSettings(this.storage.filter),
            this.$filter);
    }

    $onDestroy() {
        this.destroy.next();
        this.destroy.complete();
    }

    restoreSettings() {
        this.storageService.remove(`${this.user.userId}#${this.storage.name}_${this.storage.charts}`);
        this.storageService.remove(`${this.user.userId}#analytics_filter`);
        //this.prepareComplete = false;

        let storageCharts: any = null;
        let storageFilters: IAnalyticsChartFilter;

        this.prepareCharts(this.defaultSettings);
        this.saveSettings('charts');
        this.saveSettings('filters');
        //this.prepareComplete = true;
    }

    private getSettings(obj: string): any {
        return this.storageService.get(`${this.user.userId}#${this.storage.name}_${obj}`);
    }

    private saveSettings(obj: string) {
        this.storageService.set(`${this.user.userId}#${this.storage.name}_${obj}`,this[obj]);
    }

    private prepareCharts(charts: Array<IAnalyticsChart>) {
        this.charts = charts.map(c => new AnalyticsChart(Object.assign(c, {isAuthorized: this.auth.isAuthorized(c.auth)}), this.user));
    }
}

const AnalyticsComponent:IComponentOptions = {
    bindings: {
        user: '<',
        categories: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: AnalyticsCtrl,
    template: require('./analytics.component.html') as string
};

export default AnalyticsComponent;