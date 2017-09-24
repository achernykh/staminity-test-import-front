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
import {IAnalyticsChart} from "./analytics-chart/analytics-chart.model";
import {IUserProfile, IUserProfilePublic, IUserProfileShort} from "../../../api/user/user.interface";
import {Subject} from "rxjs/Rx";
import {activityTypes} from "../activity/activity.constants";
import {IActivityType} from "../../../api/activity/activity.interface";
import {
    IAnalyticsChartFilterParam, IReportPeriodOptions,
    PeriodOptions
} from "./analytics-chart-filter/analytics-chart-filter.model";
import {IActivityCategory} from "../../../api/reference/reference.interface";
import ReferenceService from "../reference/reference.service";
import {Owner, getOwner} from "../reference/reference.datamodel";
import { pipe, orderBy, prop, groupBy } from "../share/util.js";


export class AnalyticsCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;

    private filter: {
        users: IAnalyticsChartFilterParam<IUserProfileShort>;
        activityTypes: IAnalyticsChartFilterParam<IActivityType>;
        activityCategories: IAnalyticsChartFilterParam<IActivityCategory>;
        periods: IAnalyticsChartFilterParam<IReportPeriodOptions>;
    } = {
        users: null,
        activityTypes: null,
        activityCategories: null,
        periods: null
    };

    public user: IUserProfile;
    public categoriesByOwner: {[owner in Owner]: Array<IActivityCategory>};

    private destroy: Subject<any> = new Subject();

    static $inject = ['$scope','SessionService','statistics', 'ReferenceService', 'analyticsDefaultSettings'];

    private selectedChart = [0,1,2,3,4,5,6,7,8];

    private examples = [
        {
            name: '10.1_PMC_chart_four_measures',
            data: chart_example_01
        },
        {
            name: '10.2.1_Two_IChart_four_measures',
            data: chart_example_02
        },
        {
            name: '10.2.2_Two_IChart_four_measures',
            data: chart_example_03
        },
        {
            name: '10.2_Two_IChart_four_measures',
            data: chart_example_04
        },
        {
            name: '11_Cumulative_Duration_by_days',
            data: chart_example_05
        },
        {
            name: '12_HR-and-pace-by-days',
            data: chart_example_06
        },
        {
            name: 'Table',
            data: chart_example_07
        },
        {
            name: 'Donut',
            data: chart_example_08
        },
        {
            name: 'Pie',
            data: chart_example_09
        }

    ];

    constructor(private $scope: IScope,
                private session: ISessionService,
                private statistics: StatisticsService,
                private reference: ReferenceService,
                private defaultSettings: Array<IAnalyticsChart>) {

        session.getObservable()
            .takeUntil(this.destroy)
            .map(getUser)
            .subscribe(userProfile => {
                this.user = userProfile;
                this.prepareUsersFilter(userProfile);
            });

        reference.categoriesChanges
            .takeUntil(this.destroy)
            .subscribe(categories => {
                this.prepareCategoriesFilter(categories, this.user);
                this.$scope.$apply();
            });

        this.prepareSportTypesFilter();
        this.prepareCategoriesFilter(reference.categories, this.user);
        this.preparePeriodsFilter();


    }

    $onInit() {
        let chart: IChart = {
            params: {
                users: [this.session.getUser().userId],
                activityTypes: [2],
                periods: [{
                    startDate: '2017.01.01',
                    endDate: '2017.12.31'
                }]
            },
            series: [{
                label: "Месяцы",
                unit: "",
                xAxis: true,
                tooltipType: "icon",
                legend: false,
                currentPositionLine: true,
                idx: 0,
                measureSource: "...StartDate....",
                measureName: "day",
                dataType: "date",
                dateFormat: "MMM-YY",
                valueType: "value",
                seriesDateTrunc: "month",
                groupByIntervalLength: 1
            }],
            measures: [{
                label: "Расстояние",
                unit: "км",
                chartType: "bar",
                stacked: false,
                cumulative: false,
                smoothSettings: "null",
                tooltipType: "icon",
                legend: false,
                visible: true,
                avgValueLine: true,
                scaleVisible: true,
                calculateTotals: "",
                lineColor: "#449999",
                lineStyle: "dotted",
                fillType: "gradient",
                fillColor: "",
                gradient: [{
                    offset: "0%",
                    color: "#449999"
                }, {
                    offset: "100%",
                    color: "rgba(175, 191, 255, 0)"
                }],
                markerColor: "#449999",
                avgValueLineColor: "green",
                avgValueLineStyle: "dashed",
                idx: 1,
                measureName: "distance",
                dataType: "number",
                dateFormat: "",
                valueType: "value",
                measureSource: "..tbd...",
                aggMethod: "sum"
            }]
        };
    }

    $onDestroy() {
        this.destroy.next();
        this.destroy.complete();
    }

    private prepareUsersFilter(user: IUserProfile) {
        this.filter.users = {
            type: 'checkbox',
            area: 'params',
            name: 'users',
            model: null,
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

        this.filter.users.model = [this.filter.users.options[0].userId];
    }

    private prepareSportTypesFilter() {
        this.filter.activityTypes = {
            type: 'checkbox',
            area: 'params',
            name: 'activityTypes',
            model: null,
            options: activityTypes
        };
        this.filter.activityTypes.model = [this.filter.activityTypes.options[0].id];
    }

    private prepareCategoriesFilter(categoriesList: Array<IActivityCategory>, userProfile: IUserProfile) {

        this.filter.activityCategories = {
            type: 'checkbox',
            area: 'params',
            name: 'activityCategories',
            model: [],
            options: categoriesList
        };

        this.categoriesByOwner = pipe(
            orderBy(prop('sortOrder')),
            groupBy(getOwner(userProfile))
        ) (categoriesList);
    }

    private preparePeriodsFilter() {
        this.filter.periods = {
            type: 'date',
            area: 'params',
            name: 'periods',
            model: null,
            options: PeriodOptions()
        };
        this.filter.periods.model = JSON.stringify(this.filter.periods.options[0].period);
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