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
    },
    /*
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
        layout: new AnalyticsChartLayout(1, 1, 4, 4),
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
                    "tooltipLabel" : "Зона",
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
                "gradient": [{}, {}],
                "markerColor": "#449999",
                "avgValueLineColor": "green",
                "avgValueLineStyle": "dashed",
                "idx" : 2,
                "measureSource" : "activity.actual.measure",
                "measureName" : "heartRateTimeInZone",
                "dataType": "time",
                "dateFormat": "HH:mm:ss",
                "valueType" : "timeInZone",
                "aggMethod" : "sum"
            }]

        }]
    },
    /*
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
        layout: new AnalyticsChartLayout(1, 1, 5, 5),
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
                    "measureSource": "user.zones.Speed",
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
                "gradient": [{}, {}],
                "markerColor": "#449999",
                "avgValueLineColor": "green",
                "avgValueLineStyle": "dashed",
                "idx" : 2,
                "measureSource" : "activity.actual.measure",
                "measureName" : "speedTimeInZone",
                "dataType": "time",
                "dateFormat": "HH:mm:ss",
                "valueType" : "timeInZone",
                "aggMethod" : "sum"
            }]

        }]
    },
    /*
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
        layout: new AnalyticsChartLayout(1, 1, 6, 6),
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
                "gradient": [{}, {}],
                "markerColor": "#449999",
                "avgValueLineColor": "green",
                "avgValueLineStyle": "dashed",
                "idx" : 2,
                "measureSource" : "activity.actual.measure",
                "measureName" : "powerTimeInZone",
                "dataType": "time",
                "dateFormat": "HH:mm:ss",
                "valueType" : "timeInZone",
                "aggMethod" : "sum"
            }]

        }]
    }
 ];