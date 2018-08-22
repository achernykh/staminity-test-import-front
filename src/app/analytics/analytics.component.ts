import "./analytics.component.scss";
import { IComponentController, IComponentOptions, IPromise, IScope } from "angular";
import { Subject } from "rxjs/Rx";
import { IActivityCategory } from "../../../api/reference/reference.interface";
import { IUserProfile, IUserProfileShort } from "../../../api/user/user.interface";
import { IAuthService } from "../auth/auth.service";
import { getUser, SessionService, StorageService } from "../core";
import StatisticsService from "../core/statistics.service";
import ReferenceService from "../reference/reference.service";
import { AnalyticsChartFilter } from "./analytics-chart-filter/analytics-chart-filter.model";
import { IAnalyticsChart } from "./analytics-chart/analytics-chart.interface";
import { AnalyticsChart } from "./analytics-chart/analytics-chart.model";
import { AnalyticsService } from "./analytics.service";

export class AnalyticsCtrl implements IComponentController {

    owner: IUserProfile; // владелец отчетов
    user: IUserProfile; // пользователь источник данных
    athletes: Array<IUserProfileShort>;
    categories: IActivityCategory[];
    charts: AnalyticsChart[];
    onEvent: (response: Object) => IPromise<void>;

    // public
    private globalFilter: AnalyticsChartFilter;

    // private
    private globalFilterChange: number = null;
    private isLoadingData: boolean = true;
    private chartTemplates: IAnalyticsChart[] = [];
    private chartUserSettings: any[];

    private readonly storage = {
        name: "#analytics",
        charts: "charts",
        filter: "filter",
    };

    private destroy: Subject<any> = new Subject();

    static $inject = ["$scope", 'AnalyticsService', "SessionService", "statistics", "storage", "ReferenceService", "analyticsDefaultSettings",
        "AuthService", "$filter", "$mdMedia", '$mdDialog'];

    constructor (private $scope: IScope,
                 private analyticsService: AnalyticsService,
                 private session: SessionService,
                 private statistics: StatisticsService,
                 private storageService: StorageService,
                 private reference: ReferenceService,
                 private defaultSettings: IAnalyticsChart[],
                 private auth: IAuthService,
                 private $filter: any,
                 private $mdMedia,
                 private $mdDialog) {

        session.getObservable()
            .takeUntil(this.destroy)
            .map(getUser)
            .subscribe(profile => {
                this.owner = profile;
                if ( this.owner.public.isCoach && this.owner.connections.hasOwnProperty('allAthletes') ) {
                    this.athletes = this.owner.connections.allAthletes.groupMembers;
                }
                //this.prepareData(); // change options for users
            });

        reference.categoriesChanges
            .takeUntil(this.destroy)
            .subscribe((categories) => {
                this.globalFilter.setCategoriesOption(categories);
                this.$scope.$apply();
            });
    }

    $onInit () {
        this.prepareData();
    }

    $onDestroy () {
        this.destroy.next();
        this.destroy.complete();
    }

    private prepareData () {
        this.analyticsService.getTemplates()
            .then(t => this.chartTemplates = t)
            .then(_ => this.prepareCharts())
            .then(_ => this.analyticsService.getChartSettings())
            .then(s => this.applyLocalSettings(s))
            .then(_ => this.prepareFilter(this.user, this.categories))
            .then(_ => this.isLoadingData = false);

        //this.prepareCharts(this.getSettings(this.storage.charts) || this.defaultSettings);
    }

    private applyLocalSettings (localSettings: any[]): void {
        localSettings.map(s =>
            this.charts.some(c => c.code === s.code) &&
            Object.assign(this.charts.filter(c => c.code === s.code)[0], s));
    }

    restoreSettings () {
        this.storageService.remove(`${this.user.userId}${this.storage.name}_${this.storage.charts}`);
        this.storageService.remove(`${this.user.userId}${this.storage.name}_${this.storage.filter}`);
        //this.prepareCharts(this.defaultSettings);
    }

    private getSettings (obj: string): any {
        return this.storageService.get(`${this.user.userId}${this.storage.name}_${obj}`);
    }

    private saveSettings () {
        this.storageService.set(`${this.user.userId}${this.storage.name}_${this.storage.charts}`, this.charts.map((c) => c.transfer()));
        this.storageService.set(`${this.user.userId}${this.storage.name}_${this.storage.filter}`, this.globalFilter.transfer());
    }

    private setPeriod (type: string, param: string = 'period'): void {
        this.globalFilter.periods.model = type;
        this.globalFilter.changeParam(param);
        this.globalFilterChange ++;
    }

    private prepareFilter (user: IUserProfile, categories: IActivityCategory[]) {
        this.globalFilter = new AnalyticsChartFilter(
            user,
            categories,
            null,//this.getSettings(this.storage.filter),
            this.$filter);
    }

    private prepareCharts () {
        this.charts = this.chartTemplates.map(t => new AnalyticsChart(
            t,
            //Object.assign(c, {isAuthorized: this.auth.isAuthorized(c.auth)}),
            this.user,
            this.globalFilter,
            this.$filter));
    }

    openMenu ($mdMenu, ev) {
        $mdMenu.open(ev);
    }
}

const AnalyticsComponent: IComponentOptions = {
    bindings: {
        owner: "<",
        user: "<",
        athletes: '<',
        categories: "<",
        onEvent: "&",
    },
    require: {
        //component: '^component'
    },
    controller: AnalyticsCtrl,
    template: require("./analytics.component.html") as string,
};

export default AnalyticsComponent;
