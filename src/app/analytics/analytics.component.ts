import './analytics.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
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
import {ISessionService} from "../core/session.service";
import StatisticsService from "../core/statistics.service";
import {IAnalyticsChart} from "./analytics-chart/analytics-chart.model";

class AnalyticsCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = ['SessionService','statistics', 'analyticsDefaultSettings'];

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

    constructor(private session: ISessionService,
                private statistics: StatisticsService,
                private defaultSettings: Array<IAnalyticsChart>) {

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
        let request: IReportRequestData = {
            charts: [chart]
        };

        this.statistics.getMetrics(request).then(result => { }, error => { });
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