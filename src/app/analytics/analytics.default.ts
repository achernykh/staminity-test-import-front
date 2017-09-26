import {IAnalyticsChart, AnalyticsChartLayout} from "./analytics-chart/analytics-chart.model";
import {PeriodOptions} from "./analytics-chart-filter/analytics-chart-filter.model";

export const DefaultAnalyticsSettings: Array<IAnalyticsChart> = [
    /**
     * 1. Фактическое время тренировок
     * Фильтры:
     * а) атлет
     * Признаки:
     * а) нарастающим итогом - да/нет
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
                chartType: 'area',
                stacked: false,
                cumulative: false,
                smoothSettings: 'curveStep',
                tooltipType: "icon",
                minValue: 0,
                legend: false,
                visible: true,
                avgValueLine: true,
                scaleVisible: true,
                calculateTotals: "",
                lineColor: "#FF5722", // deep-orange-500
                lineStyle: "solid",
                fillType: "gradient",
                fillColor: "",
                gradient: [{
                    offset: "0%",
                    color: "rgba(251, 233, 231, 1)" // deep-orange-50
                }, {
                    offset: "100%",
                    color: "rgba(255, 138, 101, 1)" // deep-orange-300
                }],
                markerColor: "#FF5722", // deep-orange-500
                avgValueLineColor: "#37474F", //
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
                chartType: "area",
                smoothSettings: 'curveStep',
                stacked: false,
                cumulative: false,
                tooltipType: "icon",
                minValue: 0,
                legend: false,
                visible: true,
                avgValueLine: true,
                scaleVisible: true,
                calculateTotals: "",
                lineColor: "#607D8B", // blue-grey-500
                lineStyle: "solid",
                fillType: "gradient",
                fillColor: "",
                gradient: [{
                    "offset": "0%",
                    "color": "rgba(236, 239, 241, 1)" // blue-grey-50
                }, {
                    "offset": "100%",
                    "color": "rgba(144, 164, 174, 1)" // blue-grey-300
                }],
                markerColor: "#607D8B", // blue-grey-500
                avgValueLineColor: "#D84315", // deep-orange-800
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
     /**
     Показатели по периодам
     Расстояние, Средний пульс, средний темп, TL
     */
    {

        order: 3,
        active: true,
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'distanceHRPaceTL.title',
        description: 'distanceHRPaceTL.description',
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
                    "fillType": "none",
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
    },
    /**
    Время в зонах по пульсу
     */
    {

        order: 4,
        active: true,
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'timeInZonesHR.title',
        description: 'timeInZonesHR.description',
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
                    options: ['day', 'week', 'month', 'quarter']
                }

            ]
        },
        layout: new AnalyticsChartLayout(1,1),
        charts: [{
            params: {
                users: null,//[this.session.getUser().userId],
                activityTypes: null,//[2],
                periods: null
            },
            options: {
                "legend": {
                    "vertical-align": "top",
                    "horizontal-align": "right"
                },
                "tooltip": {
                    "combined": false
                },
                "currentPositionLine": {
                    "enabled": true
                },
                "colorPalette": false
            },
            series : [
                {
                    "label" : "Период",
                    "unit" : "",
                    "xAxis" : true,
                    "tooltipType" : "label",
                    "tooltipLabel" : "Период",
                    "legend": false,
                    "currentPositionLine": true,
                    "idx" : 0,
                    "measureSource" : "activity.startDate",
                    "measureName" : "Weeks",
                    "dataType": "date",
                    "dateFormat": "DD.MM",
                    "valueType" : "value",
                    "seriesDateTrunc" : "week",
                    "groupByIntervalLength" : 1
                },
                {
                    "label" : "Зоны пульса",
                    "unit" : "",
                    "xAxis" : true,
                    "tooltipType" : "label",
                    "tooltipLabel" : "#",
                    "legend": true,
                    "currentPositionLine": true,
                    "idx" : 1,
                    "measureSource": "user.zones.heartRate",
                    "fillColor": "#449999",
                    "measureName" : "HRZones",
                    "dataType": "number",
                    "dateFormat": "",
                    "valueType" : "value",
                    "groupBy" : "",
                    "groupByIntervalLength" : 1
                }],
            measures : [{
                "label" : "Время в зонах",
                "unit" : "",
                "chartType" : "bar",
                "stacked" : true,
                "cumulative": false,
                "smoothSettings" : "null",
                "tooltipType" : "color",
                "minValue" : 0,
                "legend": false,
                "visible" : true,
                "avgValueLine": false,
                "scaleVisible": true,
                "calculateTotals": "",
                "lineColor": "#449999",
                "lineStyle": "dotted",
                "fillType": "solid",
                "fillColor": "#449999",
                "markerColor": "#449999",
                "avgValueLineColor": "green",
                "avgValueLineStyle": "dashed",
                "idx" : 2,
                "measureSource" : "activity.actual.measure",
                "measureName" : "heartRateMTM",
                "dataType": "time",
                "dateFormat": "HH:mm:ss",
                "valueType" : "timeInZone",
                "aggMethod" : "sum"
            }]

        }]
    },
    /**
     Время в зонах по темпу
     */
    {

        order: 5,
        active: true,
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'timeInZonesSpeed.title',
        description: 'timeInZonesSpeed.description',
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
                    options: ['day', 'week', 'month', 'quarter']
                }

            ]
        },
        layout: new AnalyticsChartLayout(1, 1),
        charts: [{
            params: {
                users: null,//[this.session.getUser().userId],
                activityTypes: null,//[2],
                periods: null
            },
            options: {
                "legend": {
                    "vertical-align": "top",
                    "horizontal-align": "right"
                },
                "tooltip": {
                    "combined": false
                },
                "currentPositionLine": {
                    "enabled": true
                },
                "colorPalette": false
            },
            series : [
                {
                    "label" : "Период",
                    "unit" : "",
                    "xAxis" : true,
                    "tooltipType" : "label",
                    "tooltipLabel" : "Период",
                    "legend": false,
                    "currentPositionLine": true,
                    "idx" : 0,
                    "measureSource" : "activity.startDate",
                    "measureName" : "Weeks",
                    "dataType": "date",
                    "dateFormat": "DD.MM",
                    "valueType" : "value",
                    "seriesDateTrunc" : "week",
                    "groupByIntervalLength" : 1
                },
                {
                    "label" : "Зоны",
                    "unit" : "",
                    "xAxis" : true,
                    "tooltipType" : "label",
                    "tooltipLabel" : "Зона",
                    "legend": true,
                    "currentPositionLine": true,
                    "idx" : 1,
                    "measureSource": "user.zones.speed",
                    "fillColor": "#449999",
                    "measureName" : "SpeedZones",
                    "dataType": "number",
                    "dateFormat": "",
                    "valueType" : "value",
                    "groupBy" : "",
                    "groupByIntervalLength" : 1
                }],
            measures : [{
                "label" : "Время в зонах",
                "unit" : "",
                "chartType" : "bar",
                "stacked" : true,
                "cumulative": false,
                "smoothSettings" : "null",
                "tooltipType" : "color",
                "minValue" : 0,
                "legend": false,
                "visible" : true,
                "avgValueLine": false,
                "scaleVisible": true,
                "calculateTotals": "",
                "lineColor": "#449999",
                "lineStyle": "dotted",
                "fillType": "solid",
                "fillColor": "#449999",
                "markerColor": "#449999",
                "avgValueLineColor": "green",
                "avgValueLineStyle": "dashed",
                "idx" : 2,
                "measureSource" : "activity.actual.measure",
                "measureName" : "speedMTM",
                "dataType": "time",
                "dateFormat": "HH:mm:ss",
                "valueType" : "timeInZone",
                "aggMethod" : "sum"
            }]

        }]
    },
    /**
     Время в зонах по мощности
     */
    {

        order: 6,
        active: true,
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'timeInZonesPower.title',
        description: 'timeInZonesPower.description',
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
                    options: ['day', 'week', 'month', 'quarter']
                }

            ]
        },
        layout: new AnalyticsChartLayout(1, 1),
        charts: [{
            params: {
                users: null,//[this.session.getUser().userId],
                activityTypes: null,//[2],
                periods: null
            },
            options: {
                "legend": {
                    "vertical-align": "top",
                    "horizontal-align": "right"
                },
                "tooltip": {
                    "combined": false
                },
                "currentPositionLine": {
                    "enabled": true
                },
                "colorPalette": false
            },
            series : [
                {
                    "label" : "Период",
                    "unit" : "",
                    "xAxis" : true,
                    "tooltipType" : "label",
                    "tooltipLabel" : "Период",
                    "legend": false,
                    "currentPositionLine": true,
                    "idx" : 0,
                    "measureSource" : "activity.startDate",
                    "measureName" : "Weeks",
                    "dataType": "date",
                    "dateFormat": "DD.MM",
                    "valueType" : "value",
                    "seriesDateTrunc" : "week",
                    "groupByIntervalLength" : 1
                },
                {
                    "label" : "Зоны мощности",
                    "unit" : "",
                    "xAxis" : true,
                    "tooltipType" : "label",
                    "tooltipLabel" : "Зона",
                    "legend": true,
                    "currentPositionLine": true,
                    "idx" : 1,
                    "measureSource": "user.zones.power",
                    "fillColor": "#449999",
                    "measureName" : "PowerZones",
                    "dataType": "number",
                    "dateFormat": "",
                    "valueType" : "value",
                    "groupBy" : "",
                    "groupByIntervalLength" : 1
                }],
            measures : [{
                "label" : "Время в зонах",
                "unit" : "",
                "chartType" : "bar",
                "stacked" : true,
                "cumulative": false,
                "smoothSettings" : "null",
                "tooltipType" : "color",
                "minValue" : 0,
                "legend": false,
                "visible" : true,
                "avgValueLine": false,
                "scaleVisible": true,
                "calculateTotals": "",
                "lineColor": "#449999",
                "lineStyle": "dotted",
                "fillType": "solid",
                "fillColor": "#449999",
                "markerColor": "#449999",
                "avgValueLineColor": "green",
                "avgValueLineStyle": "dashed",
                "idx" : 2,
                "measureSource" : "activity.actual.measure",
                "measureName" : "powerMTM",
                "dataType": "time",
                "dateFormat": "HH:mm:ss",
                "valueType" : "timeInZone",
                "aggMethod" : "sum"
            }]

        }]
    },
    /**
     Объемы по расстоянию по ученикам
     */
    {

        order: 7,
        active: true,
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'distanceByAthletesByPeriods.title',
        description: 'distanceByAthletesByPeriods.description',
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
                    options: ['day', 'week', 'month', 'quarter']
                }

            ]
        },
        layout: new AnalyticsChartLayout(1, 1),
        charts: [{
            params: {
                users: null,//[this.session.getUser().userId],
                activityTypes: null,//[2],
                periods: null
            },
            options: {
                "legend": {
                    "vertical-align": "top",
                    "horizontal-align": "right"
                },
                "tooltip": {
                    "combined": true
                },
                "currentPositionLine": {
                    "enabled": false
                },
                "palette": ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f"]
            },
            series : [{
                "label" : "Период",
                "unit" : "",
                "xAxis" : true,
                "tooltipType" : "label",
                "tooltipLabel" : "Период",
                "legend": false,
                "currentPositionLine": false,
                "idx" : 0,
                "measureSource" : "activity.startDate",
                "measureName" : "Weeks",
                "dataType": "date",
                "dateFormat": "DD.MM",
                "valueType" : "value",
                "seriesDateTrunc" : "week",
                "groupByIntervalLength" : 1
            },
            {
                "label" : "Атлет",
                "unit" : "",
                "xAxis" : true,
                "tooltipType" : "none",
                "tooltipLabel" : "Атлет",
                "legend": true,
                "colorPalette": true,
                "currentPositionLine": false,
                "idx" : 1,
                "fillColor": "#449999",
                "measureSource": "activity.owner",
                "measureName" : "name",
                "dataType": "string",
                "dateFormat": "",
                "valueType" : "value",
                "seriesDateTrunc" : "",
                "groupByIntervalLength" : 1} ],

            measures : [{
                "label" : "Расстояние",
                "unit" : "км",
                "chartType" : "bar",
                "stacked" : false,
                "cumulative": false,
                "smoothSettings" : "null",
                "tooltipType" : "color",
                "minValue" : 0,
                "legend": false,
                "visible" : true,
                "avgValueLine": false,
                "scaleVisible": true,
                "calculateTotals": "",
                "fillColor": "",
                "colorPalette": true,
                "idx" : 2,
                "measureSource" : "activity.actual.measure",
                "measureName" : "distance",
                "dataType": "number",
                "dateFormat": "",
                "valueType" : "value",
                "aggMethod" : "sum"
            }]

        }]
    },
    /**
     Объемы по времени по ученикам
     */
    {

        order: 8,
        active: true,
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'durationByAthletesByPeriods.title',
        description: 'durationByAthletesByPeriods.description',
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
                    options: ['day', 'week', 'month', 'quarter']
                }

            ]
        },
        layout: new AnalyticsChartLayout(1, 1),
        charts: [{
            params: {
                users: null,//[this.session.getUser().userId],
                activityTypes: null,//[2],
                periods: null
            },
            options: {
                "legend": {
                    "vertical-align": "top",
                    "horizontal-align": "right"
                },
                "tooltip": {
                    "combined": false
                },
                "currentPositionLine": {
                    "enabled": false
                },
                "palette": ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f"]
            },
            series : [
                {
                    "label" : "Период",
                    "unit" : "",
                    "xAxis" : true,
                    "tooltipType" : "label",
                    "tooltipLabel" : "Период",
                    "legend": false,
                    "currentPositionLine": false,
                    "idx" : 0,
                    "measureSource" : "activity.startDate",
                    "measureName" : "Weeks",
                    "dataType": "date",
                    "dateFormat": "DD.MM",
                    "valueType" : "value",
                    "seriesDateTrunc" : "week",
                    "groupByIntervalLength" : 1
                },
                {
                    "label" : "Атлет",
                    "unit" : "",
                    "xAxis" : true,
                    "tooltipType" : "label",
                    "tooltipLabel" : "Атлет",
                    "legend": true,
                    "colorPalette": true,
                    "currentPositionLine": false,
                    "idx" : 1,
                    "fillColor": "#449999",
                    "measureSource": "activity.owner",
                    "measureName" : "name",
                    "dataType": "string",
                    "dateFormat": "",
                    "valueType" : "value",
                    "seriesDateTrunc" : "",
                    "groupByIntervalLength" : 1	 }
                ],
            measures : [{
                    "label" : "Время",
                    "unit" : "ч",
                    "chartType" : "bar",
                    "stacked" : false,
                    "cumulative": false,
                    "smoothSettings" : "null",
                    "tooltipType" : "icon",
                    "minValue" : 0,
                    "legend": false,
                    "visible" : true,
                    "avgValueLine": false,
                    "scaleVisible": true,
                    "calculateTotals": "",
                    "fillColor": "",
                    "colorPalette": true,
                    "idx" : 2,
                    "measureSource" : "activity.actual.measure",
                    "measureName" : "duration",
                    "dataType": "number",
                    "dateFormat": "",
                    "valueType" : "value",
                    "aggMethod" : "sum"
            }]
        }]
    },
    /**
     Пики по пульсу по времени
     */
    {

        order: 9,
        active: true,
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'HRTimePeaks.title',
        description: 'HRTimePeaks.description',
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
                    options: ['day', 'week', 'month', 'quarter']
                }

            ]
        },
        layout: new AnalyticsChartLayout(1, 1),
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
                "currentPositionLine": {
                    "enabled": true
                }
            },
            series : [{
                "label" : "Пики",
                "unit" : "",
                "xAxis" : true,
                "tooltipType" : "label",
                "tooltipLabel" : "Пик",
                "legend": false,
                "currentPositionLine": true,
                "idx" : 0,
                "measureSource" : "peaksByTime",
                "measureName" : "Peaks",
                "dataType": "string",
                "dateFormat": "",
                "valueType" : "value",
                "seriesDateTrunc" : "",
                "groupByIntervalLength" : 1
            }],
            measures : [{
                "id": "0",
                "label" : "Пульс",
                "unit" : "уд/м",
                "chartType" : "area",
                "smoothSettings" : "curveCatmullRom",
                "tooltipType" : "icon",
                "legend": true,
                "lineColor": "#449999",
                "lineStyle": "dotted",
                "fillType": "gradient",
                "gradient": [{"offset": "0%","color": "rgba(0, 0, 0, 0.2)"},
                    {"offset": "100%","color": "rgba(0, 156, 0, 0.8)" }],
                "markerColor": "rgba(0, 156, 0, 0.8)",
                "idx" : 1,
                "measureSource": "activity.actual.measure",
                "measureName": "powerTimePeaks",
                "dataType": "number",
                "dateFormat": "",
                "valueType": "peak",
                "aggMethod": "max"
            }]
        }]
    },
    /**
     Пики по темпу по времени
     */
    {

        order: 10,
        active: true,
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'PaceTimePeaks.title',
        description: 'PaceTimePeaks.description',
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
                    options: ['day', 'week', 'month', 'quarter']
                }

            ]
        },
        layout: new AnalyticsChartLayout(1, 1),
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
                "currentPositionLine": {
                    "enabled": true
                }
            },
            series : [{
                "label" : "Пики",
                "unit" : "",
                "xAxis" : true,
                "tooltipType" : "label",
                "tooltipLabel" : "Пик",
                "legend": false,
                "currentPositionLine": true,
                "idx" : 0,
                "measureSource" : "peaksByTime",
                "measureName" : "Peaks",
                "dataType": "string",
                "dateFormat": "",
                "valueType" : "value",
                "seriesDateTrunc" : "",
                "groupByIntervalLength" : 1
            }],
            measures : [{
                "id": "0",
                "label" : "Темп",
                "unit" : "",
                "chartType" : "area",
                "smoothSettings" : "curveCatmullRom",
                "tooltipType" : "icon",
                "legend": true,
                "lineColor": "#449999",
                "lineStyle": "dotted",
                "fillType": "gradient",
                "gradient": [{"offset": "0%","color": "rgba(0, 0, 0, 0.2)"},
                    {"offset": "100%","color": "rgba(0, 156, 0, 0.8)" }],
                "markerColor": "rgba(0, 156, 0, 0.8)",
                "idx" : 1,
                "measureSource": "activity.actual.measure",
                "measureName": "speedTimePeaks",
                "dataType": "number",
                "dateFormat": "",
                "valueType": "peak",
                "aggMethod": "max",
                "reverse": true
            }]
        }]
    },
    /**
     Пики по скорости по времени
     */
    {

        order: 11,
        active: true,
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'PaceTimePeaks.title',
        description: 'PaceTimePeaks.description',
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
                    options: ['day', 'week', 'month', 'quarter']
                }

            ]
        },
        layout: new AnalyticsChartLayout(1, 1),
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
                "currentPositionLine": {
                    "enabled": true
                }
            },
            series : [{
                "label" : "Пики",
                "unit" : "",
                "xAxis" : true,
                "tooltipType" : "label",
                "tooltipLabel" : "Пик",
                "legend": false,
                "currentPositionLine": true,
                "idx" : 0,
                "measureSource" : "peaksByTime",
                "measureName" : "Peaks",
                "dataType": "string",
                "dateFormat": "",
                "valueType" : "value",
                "seriesDateTrunc" : "",
                "groupByIntervalLength" : 1
            }],
            measures : [{
                "id": "0",
                "label" : "Скорость",
                "unit" : "км/ч",
                "chartType" : "area",
                "smoothSettings" : "curveCatmullRom",
                "tooltipType" : "icon",
                "legend": true,
                "lineColor": "#449999",
                "lineStyle": "dotted",
                "fillType": "gradient",
                "gradient": [{"offset": "0%","color": "rgba(0, 0, 0, 0.2)"},
                    {"offset": "100%","color": "rgba(0, 156, 0, 0.8)" }],
                "markerColor": "rgba(0, 156, 0, 0.8)",
                "idx" : 1,
                "measureSource": "activity.actual.measure",
                "measureName": "speedTimePeaks",
                "dataType": "number",
                "dateFormat": "",
                "valueType": "peak",
                "aggMethod": "max",
                "reverse": false
            }]
        }]
    },
    /**
     Пики по мощности по времени
     */
    {

        order: 12,
        active: true,
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'PowerTimePeaks.title',
        description: 'PowerTimePeaks.description',
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
                    options: ['day', 'week', 'month', 'quarter']
                }

            ]
        },
        layout: new AnalyticsChartLayout(1, 1),
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
                "currentPositionLine": {
                    "enabled": true
                }
            },
            series : [{
                "label" : "Пики",
                "unit" : "",
                "xAxis" : true,
                "tooltipType" : "label",
                "tooltipLabel" : "Пик",
                "legend": false,
                "currentPositionLine": true,
                "idx" : 0,
                "measureSource" : "peaksByTime",
                "measureName" : "Peaks",
                "dataType": "string",
                "dateFormat": "",
                "valueType" : "value",
                "seriesDateTrunc" : "",
                "groupByIntervalLength" : 1
            }],
            measures : [{
                "id": "0",
                "label" : "Мощность",
                "unit" : "Вт",
                "chartType" : "area",
                "smoothSettings" : "curveCatmullRom",
                "tooltipType" : "icon",
                "legend": true,
                "lineColor": "#449999",
                "lineStyle": "dotted",
                "fillType": "gradient",
                "gradient": [{"offset": "0%","color": "rgba(0, 0, 0, 0.2)"},
                    {"offset": "100%","color": "rgba(0, 156, 0, 0.8)" }],
                "markerColor": "rgba(0, 156, 0, 0.8)",
                "idx" : 1,
                "measureSource": "activity.actual.measure",
                "measureName": "powerTimePeaks",
                "dataType": "number",
                "dateFormat": "",
                "valueType": "peak",
                "aggMethod": "max"
            }]
        }]
    },
 ];