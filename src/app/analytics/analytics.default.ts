import {IAnalyticsChart, AnalyticsChartLayout} from "./analytics-chart/analytics-chart.model";
import {PeriodOptions} from "./analytics-chart-filter/analytics-chart-filter.model";

export const DefaultAnalyticsSettings: Array<IAnalyticsChart> = [
    /**
     * 1. Фактическое время тренировок
     * Фильтры:
     * а) атлет
     * Признаки:
     * а) нарастояющим итогом - да/нет
     * б) группировка по дням / по неделям / по месяцам
     */
    {
        order: 1,
        active: true,
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'actualMovingDuration.title',
        description: 'actualMovingDuration.description',
        filter: {
            enabled: true,
            params: [
                {
                    ind: [0],
                    type: 'date',
                    area: 'params',
                    name: 'period',
                    model: {
                        name: 'thisYear',
                        period: {
                            startDate: null,
                            endDate: null
                        }
                    },
                    options: PeriodOptions(),
                    protected: true
                },
                {
                    ind: [0],
                    idx: [0],
                    type: 'radio',
                    area: 'series',
                    name: 'seriesDateTrunc',
                    model: 'week',
                    options: ['day','week','month']
                },
                {
                    ind: [0],
                    idx: [1],
                    type: 'radio',
                    area: 'measures',
                    name: 'cumulative',
                    model: false,
                    options: [false,true]
                },
            ]
        },
        layout: new AnalyticsChartLayout(1,1),
        charts: [{
            params: {
                users: null,//[this.session.getUser().userId],
                activityTypes: null,//[2],
                periods: null
            },
            series : [{
                label : "Период",
                unit : "",
                xAxis : true,
                tooltipType : "label",
                tooltipLabel : "Период",
                legend: false,
                currentPositionLine: true,
                idx: 0,
                measureSource: "activity.startDate",
                seriesDateTrunc: 'week',
                measureName: "Weeks",
                dataType: "date",
                dateFormat: "DD.MM",
                valueType: "value",
                groupByIntervalLength: 1
            }],
            measures : [{
                label: "Время",
                unit: "",
                chartType: "bar",
                stacked: false,
                cumulative: false,
                smoothSettings: "null",
                tooltipType: "icon",
                minValue: 0,
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
                measureSource: "activity.actual.measure",
                measureName: "duration",
                dataType: "number",
                dateFormat: "",
                valueType: "value",
                aggMethod: "sum"
            }]
        }]
    },
    /**
     * 2. Фактическое расстояние по тренировкам
     * Фильтры:
     * а) атлет
     * Признаки:
     * а) нарастояющим итогом - да/нет
     * б) группировка по дням / по неделям / по месяцам
     */
    {
        order: 2,
        active: true,
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'actualDistance.title',
        description: 'actualDistance.description',
        filter: {
            enabled: true,
            params: [
                {
                    ind: [0],
                    type: 'date',
                    area: 'params',
                    name: 'period',
                    model: {
                        name: 'thisYear',
                        period: {
                            startDate: null,
                            endDate: null
                        }
                    },
                    options: PeriodOptions()
                },
                {
                    ind: [0],
                    idx: [0],
                    type: 'radio',
                    area: 'series',
                    name: 'seriesDateTrunc',
                    model: 'week',
                    options: ['day','week','month']
                },
                {
                    ind: [0],
                    idx: [1],
                    type: 'radio',
                    area: 'measures',
                    name: 'cumulative',
                    model: 'false',
                    options: ['false','true']
                },

            ]
        },
        layout: new AnalyticsChartLayout(1,1),
        charts: [{
            params: {
                users: null,//[this.session.getUser().userId],
                activityTypes: null,//[2],
                periods: null
            },
            series : [{
                label: "Период",
                unit: "",
                xAxis: true,
                tooltipType: "label",
                tooltipLabel: "Период",
                legend: false,
                currentPositionLine: true,
                idx: 0,
                measureSource: "activity.startDate",
                seriesDateTrunc: 'week',
                measureName: "Weeks",
                dataType: "date",
                dateFormat: "DD.MM",
                valueType: "value",
                groupByIntervalLength: 1
            }],
            measures : [{
                label: "Расстояние",
                unit: "",
                chartType: "bar",
                stacked: false,
                cumulative: false,
                smoothSettings: "null",
                tooltipType: "icon",
                minValue: 0,
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
                    "offset": "0%",
                    "color": "#449999"
                }, {
                    "offset": "100%",
                    "color": "rgba(175, 191, 255, 0)"
                }],
                markerColor: "#449999",
                avgValueLineColor: "green",
                avgValueLineStyle: "dashed",
                idx: 1,
                measureSource: "activity.actual.measure",
                measureName: "distance",
                dataType: "number",
                dateFormat: "",
                valueType: "value",
                aggMethod: "sum"
            }]
        }]
    },
     /*
     Показатели по периодам
     Расстояние, Средний пульс, средний темп, TL
     */
    {

        order: 3,
        active: true,
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'DistanceHRPaceTL.title',
        description: 'DistanceHRPaceTL.description',
        filter: {
            enabled: true,
            params: [
                {
                    ind: [0],
                    type: 'date',
                    area: 'params',
                    name: 'period',
                    model: {
                        name: 'thisYear',
                        period: {
                            startDate: null,
                            endDate: null
                        }
                    },
                    options: PeriodOptions()
                },
                {
                    ind: [0],
                    idx: [0],
                    type: 'radio',
                    area: 'series',
                    name: 'seriesDateTrunc',
                    model: 'day',
                    options: ['day', 'week', 'month', 'quarter']
                }

            ]
        },
        layout: new AnalyticsChartLayout(2,1),
        charts: [{
            params: {
                users: null,//[this.session.getUser().userId],
                activityTypes: null,//[2],
                periods: null
            },
            options: {
                "tooltip": {
                    "combined": true
                },
                "legend": {
                    "vertical-align": "top",
                    "horizontal-align": "right"
                },
                "currentPositionLine": {
                    "enabled": true,
                    "radius": 4,
                    "opacity": 1
                }
            },
            series: [{
                "label": "Период",
                "unit": "",
                "xAxis": true,
                "tooltipType": "label",
                "tooltipLabel": "Период",
                "legend": false,
                "currentPositionLine": true,
                "idx": 0,
                "measureSource": "activity.startDate",
                "measureName": "Days",
                "dataType": "date",
                "dateFormat": "DD.MM",
                "valueType": "value",
                "seriesDateTrunc": "day",
                "groupByIntervalLength": 1
            }],
            measures: [
                {
                    "label": "Расстояние",
                    "unit": "км",
                    "chartType": "bar",
                    "stacked": false,
                    "cumulative": false,
                    "smoothSettings": "null",
                    "tooltipType": "icon",
                    "minValue": 0,
                    "legend": false,
                    "visible": true,
                    "avgValueLine": false,
                    "scaleVisible": true,
                    "calculateTotals": "",
                    "lineColor": "#449999",
                    "lineStyle": "dotted",
                    "fillType": "gradient",
                    "fillColor": "",
                    "gradient": [{
                        "offset": "0%",
                        "color": "#449999"
                    }, {
                        "offset": "100%",
                        "color": "rgba(175, 191, 255, 0)"
                    }],
                    "markerColor": "#449999",
                    "avgValueLineColor": "green",
                    "avgValueLineStyle": "dashed",
                    "idx": 1,
                    "measureSource": "activity.actual.measure",
                    "measureName": "distance",
                    "dataType": "number",
                    "dateFormat": "",
                    "valueType": "value",
                    "aggMethod": "sum"
                },
                {
                    "id": "tl",
                    "label": "TL",
                    "unit": "",
                    "chartType": "dot",
                    "stacked": false,
                    "cumulative": false,
                    "smoothSettings": "null",
                    "tooltipType": "color",
                    "minValue": 0,
                    "legend": true,
                    "visible": true,
                    "avgValueLine": false,
                    "scaleVisible": true,
                    "calculateTotals": "",
                    "lineColor": null,
                    "lineStyle": null,
                    "fillType": "solid",
                    "fillColor": "rgba(255, 0, 0, 0.5)",
                    "markerColor": "rgb(255, 0, 0)",
                    "avgValueLineColor": null,
                    "avgValueLineStyle": null,
                    "idx": 2,
                    "measureSource": "activity.actual.measure",
                    "measureName": "tl",
                    "dataType": "number",
                    "dateFormat": "",
                    "valueType": "value",
                    "aggMethod": "sum"

                },
                {
                    "id": "heartRate",
                    "label": "Средний пульс",
                    "unit": "уд/м",
                    "chartType": "line",
                    "stacked": null,
                    "smoothSettings": "curveMonotoneX",
                    "tooltipType": "color",
                    "legend": true,
                    "visible": true,
                    "avgValueLine": false,
                    "lineColor": "lightblue",
                    "lineStyle": "solid",
                    "lineWidth": 2,
                    "fillType": "none",
                    "fillColor": "",
                    "markerColor": "rgba(153, 190, 201, 1)",
                    "idx": 3,
                    "measureSource": "activity.actual.measure",
                    "measureName": "heartRate",
                    "dataType": "number",
                    "dateFormat": "",
                    "valueType": "avgValue",
                    "aggMethod": "avg"
                },
                {
                    "id": "pace",
                    "label": "Средний темп",
                    "unit": "мин/км",
                    "chartType": "line",
                    "stacked": null,
                    "cumulative": false,
                    "smoothSettings": "curveMonotoneX",
                    "tooltipType": "color",
                    "legend": true,
                    "visible": true,
                    "avgValueLine": false,
                    "scaleVisible": true,
                    "calculateTotals": "",
                    "lineColor": "#FF9999",
                    "lineStyle": "solid",
                    "fillType": "",
                    "fillColor": "",
                    "markerColor": "#FF9999",
                    "avgValueLineColor": "",
                    "avgValueLineStyle": "",
                    "idx": 4,
                    "measureSource": "activity.actual.measure",
                    "measureName": "speed",
                    "dataType": "time",
                    "dateFormat": "mm:ss",
                    "valueType": "avgValue",
                    "aggMethod": "avg",
                    "reverse": true
                }
            ]
        }]
    }
 ];