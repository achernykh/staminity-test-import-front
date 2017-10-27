import './analytics.component.scss';
import {IComponentOptions, IComponentController, IPromise, IScope, copy} from 'angular';
import StatisticsService from "../core/statistics.service";
import {IAnalyticsChart, AnalyticsChart} from "./analytics-chart/analytics-chart.model";
import {IUserProfile, IUserProfilePublic, IUserProfileShort} from "../../../api/user/user.interface";
import {Subject} from "rxjs/Rx";
import {
    IAnalyticsChartSettings, IReportPeriodOptions,
    PeriodOptions, AnalyticsChartFilter, IAnalyticsChartFilter
} from "./analytics-chart-filter/analytics-chart-filter.model";
import {IActivityCategory} from "../../../api/reference/reference.interface";
import ReferenceService from "../reference/reference.service";
import {StorageService, SessionService, getUser} from "../core";
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
                private session: SessionService,
                private statistics: StatisticsService,
                private storageService: StorageService,
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
        this.prepareData();
    }

    $onDestroy() {
        this.destroy.next();
        this.destroy.complete();
    }

    private prepareData() {
        this.prepareFilter(this.user, this.categories);
        this.prepareCharts(this.getSettings(this.storage.charts) || this.defaultSettings);
    }


    restoreSettings() {
        this.storageService.remove(`${this.user.userId}${this.storage.name}_${this.storage.charts}`);
        this.storageService.remove(`${this.user.userId}${this.storage.name}_${this.storage.filter}`);
        this.prepareCharts(this.defaultSettings);
    }

    private getSettings(obj: string): any {
        return this.storageService.get(`${this.user.userId}${this.storage.name}_${obj}`);
    }

    private saveSettings() {
        this.storageService.set(`${this.user.userId}${this.storage.name}_${this.storage.charts}`,this.charts.map(c => c.transfer()));
        this.storageService.set(`${this.user.userId}${this.storage.name}_${this.storage.filter}`,this.filter.transfer());
    }

    private prepareFilter(user: IUserProfile, categories: Array<IActivityCategory>) {
        this.filter = new AnalyticsChartFilter(
            user,
            categories,
            this.getSettings(this.storage.filter),
            this.$filter);
    }

    private prepareCharts(charts: Array<IAnalyticsChart>) {
        this.charts = charts.map(c => new AnalyticsChart(
            Object.assign(c, {isAuthorized: this.auth.isAuthorized(c.auth)}),
            this.user,
            this.filter,
            this.$filter));
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