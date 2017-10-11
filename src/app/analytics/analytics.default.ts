import {IAnalyticsChart, AnalyticsChartLayout} from "./analytics-chart/analytics-chart.model";
import {PeriodOptions} from "./analytics-chart-filter/analytics-chart-filter.model";

const paletteAll500 = ["#F44336", "#673AB7", "#03A9F4", "#4CAF50", "#FFEB3B", "#FF5722", "#607D8B", "#E91E63",'#3F51B5','#00BCD4','#8BC34A','#FFC107','#795548','#9C27B0','#2196F3','#009688','#CDDC39','#FF9800','#9E9E9E'];
const paletteSports = ["#2196F3", "#FFC107", "#009688", "#F44336", "#9C27B0", "#795548", "#E91E63", "#9E9E9E"];
//noinspection TypeScriptValidateTypes,TypeScriptValidateTypes
export const DefaultAnalyticsSettings: Array<IAnalyticsChart> = [
    /**
     1-coach.Объемы по расстоянию по ученикам
     */
    {
        order: 1,
        active: true,
        auth: ["CoachDashboard"],
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'distanceByAthletesByPeriods.title',
        context: [],
        description: 'distanceByAthletesByPeriods.description',
        globalParams: false,
        localParams: {
            "users": {
                "type": "checkbox",
                "area": "params",
                "name": "users",
                "text": "users",
                "model": "first5", //первые 5 спортсменов
                options: []
            },
            "activityTypes": {
                "type": "checkbox",
                "area": "params",
                "name": "activityTypes",
                "text": "activityTypes",
                "model": null //все
            },
            "periods": {
                "type": "date",
                "area": "params",
                "name": "periods",
                "text": "periods",
                "model": "thisYear",
                "options": [
                    "thisYear",
                    "thisMonth",
                    "thisWeek",
                    "customPeriod"
                ]
            }
        },
        settings: [
            {
                ind: [0],
                idx: [0],
                type: 'radio',
                area: 'series',
                name: 'seriesDateTrunc',
                text: 'seriesDateTrunc',
                model: 'month',
                options: ['day','week','month'],
                change: {
                    'day': {
                        seriesDateTrunc: 'day'
                    },
                    'week': {
                        seriesDateTrunc: 'week'
                    },
                    'month': {
                        seriesDateTrunc: 'month'
                    }
                }
            },
            {
                ind: [0],
                idx: [1],
                type: 'radio',
                area: 'measures',
                name: 'cumulative',
                text: 'cumulative',
                model: false,
                options: [false,true],
                change: {
                    'false': {
                        cumulative: false
                    },
                    'true': {
                        cumulative: true
                    }
                }
            }
        ],
        layout: new AnalyticsChartLayout(1, 1),
        charts: [{
            params: {
                users: null,//[this.session.getUser().userId],
                activityTypes: null,//[2],
                periods: null
            },
            options: {
                "legend": {
                    "vertical-align": "bottom",
                    "horizontal-align": "center",
                    "type": "row"
                },
                "tooltip": {
                    "combined": false
                },
                "currentPositionLine": {
                    "enabled": false
                },
                "palette": paletteAll500
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
     2-coach.Объемы по времени по ученикам
     */
    {
        order: 2,
        active: true,
        auth: ["CoachDashboard"],
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'durationByAthletesByPeriods.title',
        context: [],
        description: 'durationByAthletesByPeriods.description',
        globalParams: true,
        localParams: {
            "users": {
                "type": "checkbox",
                "area": "params",
                "name": "users",
                "text": "users",
                "model": "first5", //первые 5 спортсменов
                options: []
            },
            "activityTypes": {
                "type": "checkbox",
                "area": "params",
                "name": "activityTypes",
                "text": "activityTypes",
                "model": null //все
            },
            "periods": {
                "type": "date",
                "area": "params",
                "name": "periods",
                "text": "periods",
                "model": "thisYear",
                "options": [
                    "thisYear",
                    "thisMonth",
                    "thisWeek",
                    "customPeriod"
                ]
            }
        },
        settings: [
            {
                ind: [0],
                idx: [0],
                type: 'radio',
                area: 'series',
                name: 'seriesDateTrunc',
                text: 'seriesDateTrunc',
                model: 'month',
                options: ['day','week','month'],
                change: {
                    'day': {
                        seriesDateTrunc: 'day'
                    },
                    'week': {
                        seriesDateTrunc: 'week'
                    },
                    'month': {
                        seriesDateTrunc: 'month'
                    }
                }
            },
            {
                ind: [0],
                idx: [1],
                type: 'radio',
                area: 'measures',
                name: 'cumulative',
                text: 'cumulative',
                model: false,
                options: [false,true],
                change: {
                    'false': {
                        cumulative: false
                    },
                    'true': {
                        cumulative: true
                    }
                }
            }
        ],
        layout: new AnalyticsChartLayout(1, 1),
        charts: [{
            params: {
                users: null,//[this.session.getUser().userId],
                activityTypes: null,//[2],
                periods: null
            },
            options: {
                "legend": {
                    "vertical-align": "bottom",
                    "horizontal-align": "center",
                    "type": "row"
                },
                "tooltip": {
                    "combined": false
                },
                "currentPositionLine": {
                    "enabled": false
                },
                "palette": paletteAll500
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
                "label" : "Время",
                "unit" : "ч",
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
                "measureName" : "duration",
                "dataType": "number",
                "dateFormat": "",
                "valueType" : "value",
                "aggMethod" : "sum"
            }]

        }]
    },
    /**
     * 3. Фактическое время тренировок
     * Фильтры:
     * а) атлет
     * Признаки:
     * а) нарастающим итогом - да/нет
     * б) группировка по дням / по неделям / по месяцам
     */
    {
        order: 3,
        active: true,
        auth: [],
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'actualMovingDuration.title',
        context: [{
            ind: 0,
            idx: 1,
            area: 'measures',
            param: 'cumulative'
        },{
            ind: 0,
            idx: 0,
            area: 'series',
            param: 'seriesDateTrunc'
        }],
        description: 'actualMovingDuration.description',
        globalParams: true,
        settings: [
            {
                ind: [0],
                idx: [0],
                type: 'radio',
                area: 'series',
                name: 'seriesDateTrunc',
                text: 'seriesDateTrunc',
                model: 'month',
                options: ['day','week','month'],
                change: {
                    'day': {
                        seriesDateTrunc: 'day'
                    },
                    'week': {
                        seriesDateTrunc: 'week'
                    },
                    'month': {
                        seriesDateTrunc: 'month'
                    }
                }
            },
            {
                ind: [0],
                idx: [1],
                type: 'radio',
                area: 'measures',
                name: 'cumulative',
                text: 'cumulative',
                model: false,
                options: [false,true],
                change: {
                    'false': {
                        cumulative: false,
                        chartType: 'bar',
                        fillType: 'gradient',
                        lineWidth: 0
                    },
                    'true': {
                        cumulative: true,
                        chartType: 'area',
                        fillType: 'gradient',
                        lineWidth: 3
                    }
                }
            }
        ],
        layout: new AnalyticsChartLayout(1,1),
        charts: [{
            params: {
                users: null,//[this.session.getUser().userId],
                activityTypes: null,//[2],
                periods: null
            },
            options: {
                "legend": {
                    "vertical-align": "bottom",
                    "horizontal-align": "center",
                    "type": "row"
                },
                "tooltip": {
                    "combined": true
                },
                "currentPositionLine": {
                    "enabled": true,
                    "color": "rgba(0,0,0,0.5)"
                },
                "colorPalette": false
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
                unit: "ч",
                chartType: 'bar',
                stacked: false,
                cumulative: false,
                smoothSettings: 'curveCardinal',
                tooltipType: "icon",
                minValue: 0,
                legend: false,
                visible: true,
                avgValueLine: true,
                scaleVisible: true,
                calculateTotals: "",
                lineColor: "#607D8B", // deep-orange-300
                lineStyle: "solid",
                lineWidth: 0,
                fillType: "gradient",
                fillColor: "#CFD8DC", // deep-orange-200
                gradient: [{
                    offset: "0%",
                    color: "#CFD8DC", // deep-orange-50
                    opacity: 0.2
                }, {
                    offset: "100%",
                    color: "#607D8B", // deep-orange-300
                    opacity: 0.6
                }],
                markerColor: "#455A64", // deep-orange-300
                avgValueLineColor: "#455A64", //
                avgValueLineStyle: "dashed",
                idx: 1,
                measureSource: "activity.actual.measure",
                measureName: "duration",
                dataType: "number",
                dateFormat: "",
                valueType: "value",
                aggMethod: "sum"
            }/**,{
                "id": "TL",
                "label": "TL",
                "unit": "",
                chartType: "dot",
                "stacked": false,
                "cumulative": false,
                smoothSettings: "curveCardinal",
                "tooltipType": "label",
                "minValue": 0,
                "legend": false,
                "visible": true,
                "avgValueLine": false,
                "scaleVisible": false,
                "calculateTotals": "",
                lineColor: "#673AB7", //  deep-purple-500
                lineStyle: "solid",
                radius: 3,
                fillType: "gradient",
                fillColor: "",
                gradient: [{
                    offset: "0%",
                    color: "#D1C4E9", //  deep-purple-100
                    opacity: 0.2
                }, {
                    offset: "100%",
                    color: "#673AB7", // deep-purple-500
                    opacity: 0.6
                }],
                markerColor: "#673AB7",
                "avgValueLineColor": "#4527A0", // deep-purple-800
                "avgValueLineStyle": "dashed",
                "idx": 2,
                "measureSource": "activity.actual.measure",
                "measureName": "trainingLoad",
                "dataType": "number",
                "dateFormat": "",
                "valueType": "value",
                "aggMethod": "sum"
            },{
                "id": "IL",
                "label": "IL",
                "unit": "",
                "chartType": "dot",
                "stacked": null,
                "cumulative": false,
                "smoothSettings": "null",
                "tooltipType": "label",
                "legend": false,
                "visible": true,
                "radius": 3,
                "avgValueLine": false,
                "scaleVisible": false,
                "calculateTotals": "",
                "lineColor": "#2887c8",
                "lineStyle": "solid",
                "fillType": "solid",
                "fillColor": "#2887c8",
                "markerColor": "#2887c8",
                "avgValueLineColor": "",
                "avgValueLineStyle": "",
                "idx": 3,
                "measureSource": "activity.actual.measure",
                "measureName": "intensityLevel",
                "dataType": "number",
                "dateFormat": "",
                "valueType": "value",
                "aggMethod": "avg",
                "reverse": false
            }*/]
        }]
    },
    /**
     * 4. Фактическое расстояние по тренировкам
     * Фильтры:
     * а) атлет
     * Признаки:
     * а) нарастояющим итогом - да/нет
     * б) группировка по дням / по неделям / по месяцам
     */
    {
        order: 4,
        active: true,
        auth: [],
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'actualDistance.title',
        context: [{
            ind: 0,
            idx: 1,
            area: 'measures',
            param: 'cumulative'
        }],
        description: 'actualDistance.description',
        globalParams: true,
        settings: [
            {
                ind: [0],
                idx: [0],
                type: 'radio',
                area: 'series',
                name: 'seriesDateTrunc',
                text: 'seriesDateTrunc',
                model: 'month',
                options: ['day','week','month'],
                change: {
                    'day': {
                        seriesDateTrunc: 'day'
                    },
                    'week': {
                        seriesDateTrunc: 'week'
                    },
                    'month': {
                        seriesDateTrunc: 'month'
                    }
                }
            },
            {
                ind: [0],
                idx: [1],
                type: 'radio',
                area: 'measures',
                name: 'cumulative',
                text: 'cumulative',
                model: true,
                options: [false,true],
                change: {
                    'false': {
                        cumulative: false,
                        chartType: 'bar',
                        fillType: 'gradient',
                        lineWidth: 0
                    },
                    'true': {
                        cumulative: true,
                        chartType: 'area',
                        fillType: 'gradient',
                        lineWidth: 3
                    }
                }
            }
        ],
        layout: new AnalyticsChartLayout(1,1),
        charts: [{
            params: {
                users: null,//[this.session.getUser().userId],
                activityTypes: null,//[2],
                periods: null
            },
            options: {
                "legend": {
                    "vertical-align": "bottom",
                    "horizontal-align": "center",
                    "type": "row"
                },
                "tooltip": {
                    "combined": true
                },
                "currentPositionLine": {
                    "enabled": true,
                    "color": "rgba(0,0,0,0.5)"
                },
                "colorPalette": false
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
                unit: "км",
                chartType: "area",
                smoothSettings: 'curveCardinal',
                stacked: false,
                cumulative: true,
                tooltipType: "icon",
                minValue: 0,
                legend: false,
                visible: true,
                avgValueLine: true,
                scaleVisible: true,
                calculateTotals: "",
                lineColor: "#607D8B", // deep-orange-300
                lineStyle: "solid",
                lineWidth: 2,
                fillType: "gradient",
                fillColor: "#CFD8DC", // deep-orange-200
                gradient: [{
                    offset: "0%",
                    color: "#CFD8DC", // deep-orange-50
                    opacity: 0.2
                }, {
                    offset: "100%",
                    color: "#607D8B", // deep-orange-300
                    opacity: 0.6
                }],
                markerColor: "#455A64", // deep-orange-300
                avgValueLineColor: "#455A64", //
                avgValueLineStyle: "dashed",
                idx: 1,
                measureSource: "activity.actual.measure",
                measureName: "distance",
                dataType: "number",
                dateFormat: "",
                valueType: "value",
                aggMethod: "sum"
            }/*,{
                "id": "TL",
                "label": "TL",
                "unit": "",
                chartType: "dot",
                "stacked": false,
                "cumulative": false,
                smoothSettings: "curveCardinal",
                "tooltipType": "label",
                "minValue": 0,
                "legend": false,
                "visible": true,
                "avgValueLine": false,
                "scaleVisible": false,
                "calculateTotals": "",
                lineColor: "#673AB7", //  deep-purple-500
                lineStyle: "solid",
                radius: 3,
                fillType: "gradient",
                fillColor: "",
                gradient: [{
                    offset: "0%",
                    color: "#D1C4E9", //  deep-purple-100
                    opacity: 0.2
                }, {
                    offset: "100%",
                    color: "#673AB7", // deep-purple-500
                    opacity: 0.6
                }],
                markerColor: "#673AB7",
                "avgValueLineColor": "#4527A0", // deep-purple-800
                "avgValueLineStyle": "dashed",
                "idx": 2,
                "measureSource": "activity.actual.measure",
                "measureName": "trainingLoad",
                "dataType": "number",
                "dateFormat": "",
                "valueType": "value",
                "aggMethod": "sum"
            },{
                "id": "IL",
                "label": "IL",
                "unit": "",
                "chartType": "dot",
                "stacked": null,
                "cumulative": false,
                "smoothSettings": "null",
                "tooltipType": "label",
                "legend": false,
                "visible": true,
                "radius": 3,
                "avgValueLine": false,
                "scaleVisible": false,
                "calculateTotals": "",
                "lineColor": "#2887c8",
                "lineStyle": "solid",
                "fillType": "solid",
                "fillColor": "#2887c8",
                "markerColor": "#2887c8",
                "avgValueLineColor": "",
                "avgValueLineStyle": "",
                "idx": 3,
                "measureSource": "activity.actual.measure",
                "measureName": "intensityLevel",
                "dataType": "number",
                "dateFormat": "",
                "valueType": "value",
                "aggMethod": "avg",
                "reverse": false
            }*/


            ]
        }]
    },
     /**
     5.Показатели по периодам (конструктор)
     */
    {
        order: 5,
        active: true,
        auth: [],
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'activityMeasuresSelected.title',
        context: [],
        description: 'activityMeasuresSelected.description',
        globalParams: false,
        localParams: {
            "users": {
                "type": "checkbox",
                "area": "params",
                "name": "users",
                "text": "users",
                "model": "me",
                options: []
            },
            "activityTypes": {
                "type": "checkbox",
                "area": "params",
                "name": "activityTypes",
                "text": "activityTypes",
                "model": [2, 3, 4, 5, 6]
            },
            "periods": {
                "type": "date",
                "area": "params",
                "name": "periods",
                "text": "periods",
                "model": "thisYear",
                "options": [
                    "thisYear",
                    "thisMonth",
                    "thisWeek",
                    "customPeriod"
                ]
            }
        },
        settings: [
            {
                ind: [0],
                idx: [0],
                type: 'radio',
                area: 'series',
                name: 'seriesDateTrunc',
                text: 'seriesDateTrunc',
                model: 'week',
                options: ['day','week','month'],
                change: {
                    'day': {
                        seriesDateTrunc: 'day'
                    },
                    'week': {
                        seriesDateTrunc: 'week'
                    },
                    'month': {
                        seriesDateTrunc: 'month'
                    }
                }
            },
            {
                 ind: [0],
                 idx: [1],
                 type: 'radio',
                 area: 'measures',
                 name: 'measureName',
                 text: 'volume',
                 model: 'distance',
                 options: ['duration','distance'],
                 change: {
                    duration: {
                        measureName: 'duration',
                        unit: 'ч',
                        label: 'Время',
                    },
                    distance: {
                        measureName: 'distance',
                        unit: 'км',
                        label: 'Расстояние',
                    }
                 }
            },
            {
                ind: [0],
                idx: [2,3,4,5,6],
                type: 'checkbox',
                area: 'measures',
                text: 'measures',
                multiTextParam: 'label',
                model: [true,true,true,false,false],
                options: [true, false],
                change: {
                    'false': {
                        visible: false,
                        legend: false
                    },
                    'true': {
                        visible: true,
                        legend: true
                    }
                }
            },
            {
                ind: [0],
                idx: [3],
                type: 'radio',
                area: 'measures',
                name: 'unit',
                text: 'paceSpeedUnit',
                model: 'мин/км',
                options: ['мин/км', 'км/ч'],
                change: {
                    'мин/км': {
                        unit: 'мин/км',
                        dataType: "time",
                        dateFormat: "mm:ss",
                        reverse: true
                    },
                    'true': {
                        unit: 'км/ч',
                        dataType: "number",
                        dateFormat: "",
                        reverse: false
                    }
                }
            }
        ],
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
                    "vertical-align": "bottom",
                    "horizontal-align": "center",
                    "type": "row"
                },
                "currentPositionLine": {
                    "enabled": true,
                    "radius": 4,
                    "color": "rgba(0,0,0,0.5)"
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
                "measureName": "Weeks",
                "dataType": "date",
                "dateFormat": "DD.MM",
                "valueType": "value",
                "seriesDateTrunc": "week",
                "groupByIntervalLength": 1
            }],
            measures: [
                {
                    "label": "Расстояние",
                    "unit": "км",
                    chartType: "area",
                    //"stacked": false,
                    "cumulative": false,
                    smoothSettings: 'curveStep',
                    "tooltipType": "icon",
                    "minValue": 0,
                    "legend": false,
                    "visible": true,
                    "avgValueLine": false,
                    "scaleVisible": true,
                    "calculateTotals": "",
                    lineColor: "#BDBDBD", // grey-400
                    lineStyle: "none",
                    lineWidth: 0,
                    fillType: "gradient",
                    fillColor: "",
                    gradient: [{
                        "offset": "0%", // grey-50
                        "color": "#FAFAFA"
                    }, {
                        "offset": "100%",
                        "color": "#E0E0E0" // grey-300
                    }],
                    "markerColor": "#9E9E9E", // grey-500
                    //"avgValueLineColor": "green",
                    //"avgValueLineStyle": "dashed",
                    "idx": 1,
                    "measureSource": "activity.actual.measure",
                    "measureName": "distance",
                    "dataType": "number",
                    "dateFormat": "",
                    "valueType": "value",
                    "aggMethod": "sum"
                },
                {
                    "id": "heartRate",
                    "label": "Пульс",
                    "unit": "уд/м",
                    "chartType": "area",
                    "stacked": null,
                    "smoothSettings": "curveBasis",
                    "tooltipType": "color",
                    "legend": true,
                    "visible": true,
                    "avgValueLine": false,
                    lineColor: "#F06292", // pink-300
                    lineStyle: "solid",
                    lineWidth: 2,
                    fillType: "gradient",
                    fillColor: "",
                    gradient: [{
                        offset: "0%",
                        color: "#FCE4EC", // pink-50
                        opacity: 0.1
                    }, {
                        offset: "100%",
                        color: "#F06292", // pink-300
                        opacity: 0.4
                    }],
                    markerColor: "#F06292",
                    "idx": 2,
                    "measureSource": "activity.actual.measure",
                    "measureName": "heartRate",
                    "dataType": "number",
                    "dateFormat": "",
                    "valueType": "avgValue",
                    "aggMethod": "avg"
                },
                {
                    "id": "pace",
                    "label": "Скорость/темп",
                    "unit": "мин/км",
                    chartType: "area",
                    "stacked": null,
                    "cumulative": false,
                    smoothSettings: "curveBasis",
                    "tooltipType": "color",
                    "legend": true,
                    "visible": true,
                    "avgValueLine": false,
                    "scaleVisible": true,
                    "calculateTotals": "",
                    lineColor: "#64B5F6", // blue-300
                    lineStyle: "solid",
                    lineWidth: 2,
                    fillType: "gradient",
                    fillColor: "",
                    gradient: [{
                        offset: "0%",
                        color: "#BBDEFB", // blue-100
                        opacity: 0.1
                    }, {
                        offset: "100%",
                        color: "#64B5F6", // blue-300
                        opacity: 0.4
                    }],
                    markerColor: "#64B5F6", // blue-300
                    "avgValueLineColor": "",
                    "avgValueLineStyle": "",
                    "idx": 3,
                    "measureSource": "activity.actual.measure",
                    "measureName": "speed",
                    "dataType": "time",
                    "dateFormat": "mm:ss",
                    "valueType": "avgValue",
                    "aggMethod": "avg",
                    "reverse": true
                },
                {
                    "id": "speedDecoupling",
                    "label": "Темп:ЧСС",
                    "unit": "",
                    "chartType": "line",
                    "stacked": null,
                    "cumulative": false,
                    "smoothSettings": "curveBasis",
                    "tooltipType": "color",
                    "legend": true,
                    "visible": true,
                    "avgValueLine": false,
                    "scaleVisible": true,
                    "calculateTotals": "",
                    "lineColor": "#9E9E9E", // grey-500
                    "lineStyle": "dashed",
                    lineWidth: 2,
                    "fillType": "none",
                    "fillColor": "",
                    "markerColor": "#9E9E9E", // grey-500
                    "avgValueLineColor": "",
                    "avgValueLineStyle": "",
                    "idx": 4,
                    "measureSource": "activity.actual.measure",
                    "measureName": "speedDecoupling",
                    "dataType": "number",
                    "dateFormat": "",
                    "valueType": "value",
                    "aggMethod": "avg"
                },
                {
                    "id": "power",
                    "label": "Мощность",
                    "unit": "Вт",
                    "chartType": "area",
                    "stacked": null,
                    "cumulative": false,
                    "smoothSettings": "curveBasis",
                    "tooltipType": "color",
                    "legend": true,
                    "visible": true,
                    "avgValueLine": false,
                    "scaleVisible": true,
                    "calculateTotals": "",
                    lineColor: "#BA68C8", // purple-300
                    lineStyle: "solid",
                    lineWidth: 2,
                    fillType: "gradient",
                    fillColor: "",
                    gradient: [{
                        offset: "0%",
                        color: "#F3E5F5", // purple-50
                        opacity: 0.1
                    }, {
                        offset: "100%",
                        color: "#BA68C8", // purple-300
                        opacity: 0.4
                    }],
                    markerColor: "#BA68C8",
                    "avgValueLineColor": "",
                    "avgValueLineStyle": "",
                    "idx": 5,
                    "measureSource": "activity.actual.measure",
                    "measureName": "power",
                    "dataType": "number",
                    "dateFormat": "",
                    "valueType": "avgValue",
                    "aggMethod": "avg"
                },
                {
                    "id": "powerDecoupling",
                    "label": "Мощность:ЧСС",
                    "unit": "",
                    "chartType": "line",
                    "stacked": null,
                    "cumulative": false,
                    "smoothSettings": "curveBasis",
                    "tooltipType": "color",
                    "legend": true,
                    "visible": true,
                    "avgValueLine": false,
                    "scaleVisible": true,
                    "calculateTotals": "",
                    "lineColor": "#3F51B5",
                    "lineStyle": "dashed",
                    lineWidth: 2,
                    "fillType": "none",
                    "fillColor": "",
                    "markerColor": "#3F51B5",
                    "avgValueLineColor": "",
                    "avgValueLineStyle": "",
                    "idx": 6,
                    "measureSource": "activity.actual.measure",
                    "measureName": "powerDecoupling",
                    "dataType": "number",
                    "dateFormat": "",
                    "valueType": "value",
                    "aggMethod": "avg"
                }
            ]
        }]
    },
    /**
     6.Нагрузка за период (TL)
     */
    {
        order: 6,
        active: true,
        auth: [],
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'activityMeasuresTL.title',
        context: [],
        description: 'activityMeasuresTL.description',
        globalParams: true,
        settings: [
            {
                ind: [0],
                idx: [0],
                type: 'radio',
                area: 'series',
                name: 'seriesDateTrunc',
                text: 'seriesDateTrunc',
                model: 'month',
                options: ['day','week','month'],
                change: {
                    'day': {
                        seriesDateTrunc: 'day'
                    },
                    'week': {
                        seriesDateTrunc: 'week'
                    },
                    'month': {
                        seriesDateTrunc: 'month'
                    }
                }
            }
        ],
        layout: new AnalyticsChartLayout(1,1),
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
                    "vertical-align": "bottom",
                    "horizontal-align": "center",
                    "type": "row"
                },
                "currentPositionLine": {
                    "enabled": true,
                    "radius": 4,
                    "color": "rgba(0,0,0,0.5)"
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
                "seriesDateTrunc": "week",
                "groupByIntervalLength": 1
            }],
            measures: [
                {
                    "id": "TL",
                    "label": "TL",
                    "unit": "",
                    chartType: "bar",
                    "stacked": false,
                    "cumulative": false,
                    smoothSettings: "curveBasis",
                    "tooltipType": "color",
                    "minValue": 0,
                    "radius": 3,
                    "legend": true,
                    "visible": true,
                    "avgValueLine": true,
                    "scaleVisible": true,
                    "calculateTotals": "",
                    lineColor: "#673AB7", //  deep-purple-500
                    lineStyle: "solid",
                    lineWidth: 0,
                    fillType: "gradient",
                    fillColor: "",
                    gradient: [{
                        offset: "0%",
                        color: "#D1C4E9", //  deep-purple-100
                        opacity: 0.2
                    }, {
                        offset: "100%",
                        color: "#673AB7", // deep-purple-500
                        opacity: 0.6
                    }],
                    markerColor: "#673AB7",
                    "avgValueLineColor": "#4527A0", // deep-purple-800
                    "avgValueLineStyle": "dashed",
                    "idx": 1,
                    "measureSource": "activity.actual.measure",
                    "measureName": "trainingLoad",
                    "dataType": "number",
                    "dateFormat": "",
                    "valueType": "value",
                    "aggMethod": "sum"
                },
                {
                    "id": "IL",
                    "label": "IL",
                    "unit": "",
                    "chartType": "dot",
                    "stacked": null,
                    "cumulative": false,
                    "smoothSettings": "null",
                    "tooltipType": "color",
                    "legend": true,
                    "visible": true,
                    "radius": 3,
                    "avgValueLine": false,
                    "scaleVisible": true,
                    "calculateTotals": "",
                    "lineColor": "#2887c8",
                    "lineStyle": "solid",
                    "fillType": "solid",
                    "fillColor": "#2887c8",
                    "markerColor": "#2887c8",
                    "avgValueLineColor": "",
                    "avgValueLineStyle": "",
                    "idx": 2,
                    "measureSource": "activity.actual.measure",
                    "measureName": "intensityLevel",
                    "dataType": "number",
                    "dateFormat": "",
                    "valueType": "value",
                    "aggMethod": "avg",
                    "reverse": false
                }
            ]
        }]
    },
    /**
    7.Время в зонах по пульсу
     */
    {
        order: 7,
        active: true,
        auth: [],
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'timeInZonesHR.title',
        context: [],
        description: 'timeInZonesHR.description',
        globalParams: true,
        settings: [
            {
                ind: [0],
                idx: [0],
                type: 'radio',
                area: 'series',
                name: 'seriesDateTrunc',
                text: 'seriesDateTrunc',
                model: 'week',
                options: ['day','week','month'],
                change: {
                    'day': {
                        seriesDateTrunc: 'day'
                    },
                    'week': {
                        seriesDateTrunc: 'week'
                    },
                    'month': {
                        seriesDateTrunc: 'month'
                    }
                }
            }
        ],
        layout: new AnalyticsChartLayout(1,1),
        charts: [{
            params: {
                users: null,//[this.session.getUser().userId],
                activityTypes: null,//[2],
                periods: null
            },
            options: {
                "legend": {
                    "vertical-align": "bottom",
                    "horizontal-align": "center",
                    "type": "row"
                },
                "tooltip": {
                    "combined": true
                },
                "currentPositionLine": {
                    "enabled": true,
                    "color": "rgba(0,0,0,0.5)"
                }
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
                    "tooltipType" : "none",
                    "tooltipLabel" : "Зона",
                    "legend": false,
                    "colorPalette": false,
                    "currentPositionLine": true,
                    "idx" : 1,
                    "measureSource": "activity.owner.zones",
                    fillColor: "#C2185B", //pink-700
                    "measureName" : "heartRate",
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
                "scaleVisible": true,
                "calculateTotals": "",
                lineColor: "",
                lineStyle: "none",
                lineWidth: 0,
                fillType: "solid",
                fillColor: "#C2185B", //pink-700
                markerColor: "#C2185B", //pink-700
                avgValueLine: false,
                "avgValueLineColor": "",
                "avgValueLineStyle": "",
                "idx" : 2,
                "measureSource" : "activity.actual.measure",
                "measureName" : "heartRateMPM",
                "dataType": "time",
                "dateFormat": "HH:mm",
                "valueType" : "timeInZone",
                "aggMethod" : "sum"
            }]

        }]
    },
    /**
     8.Время в зонах по темпу
     */
    {
        order: 8,
        active: false,
        auth: [],
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'timeInZonesSpeed.title',
        description: 'timeInZonesSpeed.description',
        globalParams: true,
        settings: [
            {
                ind: [0],
                idx: [0],
                type: 'radio',
                area: 'series',
                name: 'seriesDateTrunc',
                text: 'seriesDateTrunc',
                model: 'week',
                options: ['day','week','month'],
                change: {
                    'day': {
                        seriesDateTrunc: 'day'
                    },
                    'week': {
                        seriesDateTrunc: 'week'
                    },
                    'month': {
                        seriesDateTrunc: 'month'
                    }
                }
            }
        ],
        layout: new AnalyticsChartLayout(1, 1),
        charts: [{
            params: {
                users: null,//[this.session.getUser().userId],
                activityTypes: null,//[2],
                periods: null
            },
            options: {
                "legend": {
                    "vertical-align": "bottom",
                    "horizontal-align": "center",
                    "type": "row"
                },
                "tooltip": {
                    "combined": true
                },
                "currentPositionLine": {
                    "enabled": true,
                    "color": "rgba(0,0,0,0.5)"
                }
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
                    "tooltipType" : "none",
                    "tooltipLabel" : "Зона",
                    "legend": false,
                    "currentPositionLine": true,
                    "idx" : 1,
                    "measureSource": "activity.owner.zones",
                    fillColor: "#1976D2", //blue-700
                    "measureName" : "speed",
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
                "scaleVisible": true,
                "calculateTotals": "",
                lineColor: "",
                lineStyle: "none",
                lineWidth: 0,
                fillType: "solid",
                fillColor: "#1976D2", //blue-700
                markerColor: "#1976D2", //blue-700
                avgValueLine: false,
                "avgValueLineColor": "green",
                "avgValueLineStyle": "dashed",
                "idx" : 2,
                "measureSource" : "activity.actual.measure",
                "measureName" : "speedMPM",
                "dataType": "time",
                "dateFormat": "HH:mm",
                "valueType" : "timeInZone",
                "aggMethod" : "sum"
            }]

        }]
    },
    /**
     9.Время в зонах по мощности
     */
    {
        order: 9,
        active: false,
        auth: [],
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'timeInZonesPower.title',
        description: 'timeInZonesPower.description',
        globalParams: true,
        settings: [
            {
                ind: [0],
                idx: [0],
                type: 'radio',
                area: 'series',
                name: 'seriesDateTrunc',
                text: 'seriesDateTrunc',
                model: 'week',
                options: ['day','week','month'],
                change: {
                    'day': {
                        seriesDateTrunc: 'day'
                    },
                    'week': {
                        seriesDateTrunc: 'week'
                    },
                    'month': {
                        seriesDateTrunc: 'month'
                    }
                }
            }
        ],
        layout: new AnalyticsChartLayout(1, 1),
        charts: [{
            params: {
                users: null,//[this.session.getUser().userId],
                activityTypes: null,//[2],
                periods: null
            },
            options: {
                "legend": {
                    "vertical-align": "bottom",
                    "horizontal-align": "center",
                    "type": "row"
                },
                "tooltip": {
                    "combined": true
                },
                "currentPositionLine": {
                    "enabled": true,
                    "color": "rgba(0,0,0,0.5)"
                }
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
                    "tooltipType" : "none",
                    "tooltipLabel" : "Зона",
                    "legend": false,
                    "currentPositionLine": true,
                    "idx" : 1,
                    "measureSource": "activity.owner.zones",
                    fillColor: "#7B1FA2", //purple-700
                    "measureName" : "power",
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
                "scaleVisible": true,
                "calculateTotals": "",
                lineColor: "",
                lineStyle: "none",
                lineWidth: 0,
                fillType: "solid",
                fillColor: "#7B1FA2", //purple-700
                markerColor: "#7B1FA2", //purple-700
                avgValueLine: false,
                "avgValueLineColor": "green",
                "avgValueLineStyle": "dashed",
                "idx" : 2,
                "measureSource" : "activity.actual.measure",
                "measureName" : "powerMPM",
                "dataType": "time",
                "dateFormat": "HH:mm:ss",
                "valueType" : "timeInZone",
                "aggMethod" : "sum"
            }]

        }]
    },
    /**
     10.Пики по пульсу по времени
     */
    {
        order: 10,
        active: true,
        auth: [],
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'HRTimePeaks.title',
        description: 'HRTimePeaks.description',
        globalParams: true,
        settings: [
        ],
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
                    "enabled": true,
                    "color": "rgba(0,0,0,0.5)"
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
                "legend": false,
                lineColor: "#E91E63", //  pink-500
                lineStyle: "solid",
                lineWidth: 2,
                fillType: "gradient",
                fillColor: "",
                gradient: [{
                    offset: "0%",
                    color: "#F8BBD0", //  pink-100
                    opacity: 0.2
                }, {
                    offset: "100%",
                    color: "#E91E63", // pink-500
                    opacity: 0.6
                }],
                "idx" : 1,
                "measureSource": "activity.actual.measure",
                "measureName": "heartRateTimePeaks",
                "dataType": "number",
                "dateFormat": "",
                "valueType": "peak",
                "aggMethod": "max"
            }]
        }]
    },
    /**
     11.Пики по темпу/скорости по времени
     */
    {
        order: 11,
        active: false,
        auth: [],
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'PaceTimePeaks.title',
        description: 'PaceTimePeaks.description',
        globalParams: true,
        settings: [
            {
                ind: [0],
                idx: [1],
                type: 'radio',
                area: 'measures',
                name: 'unit',
                text: 'paceSpeedUnit',
                model: 'мин/км',
                options: ['мин/км', 'км/ч', 'мин/100м'],
                change: {
                    'мин/км': {
                        unit: 'мин/км',
                        dataType: "time",
                        dateFormat: "mm:ss",
                        reverse: true
                    },
                    'км/ч': {
                        unit: 'км/ч',
                        dataType: "number",
                        dateFormat: "",
                        reverse: false
                    },
                    'мин/100м': {
                        unit: 'мин/100м',
                        dataType: "time",
                        dateFormat: "mm:ss",
                        reverse: true
                    },
                }
            }
        ],
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
                    "enabled": true,
                    "color": "rgba(0,0,0,0.5)"
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
                "unit" : "мин/км",
                "chartType" : "area",
                "smoothSettings" : "curveCatmullRom",
                "tooltipType" : "icon",
                "legend": false,
                lineColor: "#2196F3", //  blue-500
                lineStyle: "solid",
                lineWidth: 2,
                fillType: "gradient",
                fillColor: "",
                gradient: [{
                    offset: "0%",
                    color: "#BBDEFB", //  blue-100
                    opacity: 0.2
                }, {
                    offset: "100%",
                    color: "#2196F3", // blue-500
                    opacity: 0.6
                }],
                "idx" : 1,
                "measureSource": "activity.actual.measure",
                "measureName": "speedTimePeaks",
                "dataType": "time",
                "dateFormat": "mm:ss",
                "valueType": "peak",
                "aggMethod": "max",
                "reverse": true
            }]
        }]
    },

    /**
     12.Пики по мощности по времени
     */
    {
        order: 12,
        active: false,
        auth: [],
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'PowerTimePeaks.title',
        description: 'PowerTimePeaks.description',
        globalParams: true,
        settings: [
        ],
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
                    "enabled": true,
                    "color": "rgba(0,0,0,0.5)"
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
                "legend": false,
                lineColor: "#9C27B0", //  purple-500
                lineStyle: "solid",
                lineWidth: 2,
                fillType: "gradient",
                fillColor: "",
                gradient: [{
                    offset: "0%",
                    color: "#E1BEE7", //  purple-100
                    opacity: 0.2
                }, {
                    offset: "100%",
                    color: "#9C27B0", // purple-500
                    opacity: 0.6
                }],
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
     13.Объемы по видам спорта по периодам
     Stacked bar chart
     */
    {
        order: 13,
        active: false,
        auth: [],
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'DistanceByActivityTypeByPeriods.title',
        description: 'DistanceByActivityTypeByPeriods.description',
        globalParams: true,
        settings: [
             {
                 ind: [0],
                 idx: [2],
                 type: 'radio',
                 area: 'measures',
                 name: 'measureName',
                 text: 'volume',
                 model: 'duration',
                 options: ['duration','distance'],
                 change: {
                     duration: {
                         measureName: 'duration',
                         unit: 'ч'
                         },
                     distance: {
                         measureName: 'distance',
                         unit: 'км'
                        }
                     }
                 },
            {
                ind: [0],
                idx: [0],
                type: 'radio',
                area: 'series',
                name: 'seriesDateTrunc',
                text: 'seriesDateTrunc',
                model: 'month',
                options: ['day','week','month'],
                change: {
                    'day': {
                        seriesDateTrunc: 'day'
                    },
                    'week': {
                        seriesDateTrunc: 'week'
                    },
                    'month': {
                        seriesDateTrunc: 'month'
                    }
                }
            },
            {
                ind: [0],
                idx: [2],
                type: 'radio',
                area: 'measures',
                name: 'cumulative',
                text: 'cumulative',
                model: false,
                options: [false,true],
                change: {
                    'false': {
                        cumulative: false
                    },
                    'true': {
                        cumulative: true
                    }
                }
            }
        ],
        layout: new AnalyticsChartLayout(1, 1),
        charts: [{
            params: {
                users: null,//[this.session.getUser().userId],
                activityTypes: null,//[2],
                periods: null
            },
            options: {
                "legend": {
                    "vertical-align": "bottom",
                    "horizontal-align": "center",
                    "type": "row"
                },
                "tooltip": {
                    "combined": true
                },
                "currentPositionLine": {
                    "enabled": true,
                    "color": "rgba(0,0,0,0.5)"

                },
                "palette": paletteSports
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
                    "label" : "Виды спорта",
                    "unit" : "",
                    "xAxis" : true,
                    "tooltipType" : "none",
                    "tooltipLabel" : "Вид спорта",
                    "legend": true,
                    "colorPalette": true,
                    "currentPositionLine": false,
                    "idx" : 1,
                    "fillColor": "#449999",
                    "measureSource": "activityTypeBasic",
                    "measureName" : "",
                    "dataType": "string",
                    "dateFormat": "",
                    "valueType" : "value",
                    "seriesDateTrunc" : "",
                    "groupByIntervalLength" : 1	 }

                ],
            measures : [{
                "label" : "Расстояние",
                "unit" : "км",
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
     14.Расстояние по видам спорта (piechart)
     */
    {
        order: 14,
        active: true,
        auth: [],
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'DistanceByActivityTypes.title',
        description: 'DistanceByActivityTypes.description',
        globalParams: true,
        settings: [
            {
                ind: [0],
                idx: [1],
                type: 'radio',
                area: 'measures',
                name: 'measureName',
                text: 'volume',
                model: 'duration',
                options: ['duration','distance'],
                change: {
                    duration: {
                        measureName: 'duration',
                        unit: 'ч'
                    },
                    distance: {
                        measureName: 'distance',
                        unit: 'км'
                    }
                }
            },
        ],
        layout: new AnalyticsChartLayout(1, 1),
        charts: [{
            params: {
                users: null,//[this.session.getUser().userId],
                activityTypes: null,//[2],
                periods: null
            },
            options: {
                "legend": {
                    "vertical-align": "bottom",
                    "horizontal-align": "center",
                    "type": "row"
                },
                "palette": paletteSports
            },
            series: [
                {
                    "label" : "Виды спорта",
                    "unit" : "",
                    "xAxis" : true,
                    "tooltipType" : "label",
                    "tooltipLabel" : "Вид спорта",
                    "legend": true,
                    "colorPalette": true,
                    "currentPositionLine": false,
                    "idx" : 0,
                    "fillColor": "#449999",
                    "measureSource": "activityTypeBasic",
                    "measureName" : "",
                    "dataType": "string",
                    "dateFormat": "",
                    "valueType" : "value",
                    "seriesDateTrunc" : "",
                    "groupByIntervalLength" : 1	 }
                ],
            measures: [
                {
                    "label" : "Расстояние",
                    "unit" : "км",
                    "chartType" : "donut",
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
                    "idx" : 1,
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
     15.История измерений
     */
    {
        order: 15,
        active: true,
        auth: [],
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'measurementsByPeriods.title',
        context: [],
        description: 'measurementsByPeriods.description',
        globalParams: true,
        settings: [
            {
                ind: [0],
                idx: [1,2,3,4],
                type: 'checkbox',
                area: 'measures',
                text: 'measures',
                multiTextParam: 'label',
                model: [true,true,false,false],
                options: [true, false],
                change: {
                    'false': {
                        visible: false
                    },
                    'true': {
                        visible: true
                    }
                }
            }
        ],
        layout: new AnalyticsChartLayout(1,1),
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
                    "vertical-align": "bottom",
                    "horizontal-align": "center",
                    "type": "row"
                },
                "currentPositionLine": {
                    "enabled": true,
                    "radius": 4,
                    "color": "rgba(0,0,0,0.5)"
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
                    "id": "pulse",
                    "label": "Пульс покоя",
                    "unit": "уд/м",
                    "chartType": "dot",
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
                    "idx": 1,
                    'measureSource': "measurement",
                    'measureName': "generalMeasures",
                    "valueType": "pulse",
                    "aggMethod": "avg",
                    "dataType": "number",
                    "dateFormat": ""
                },
                {
                    "id": "weight",
                    "label": "Вес",
                    "unit": "кг",
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
                    "idx": 2,
                    'measureSource': "measurement",
                    'measureName': "sizes",
                    "valueType": "weight",
                    "aggMethod": "avg",
                    "dataType": "number",
                    "dateFormat": ""
                },
                {
                    "id": "muscleMass",
                    "label": "Мышечная масса",
                    "unit": "кг",
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
                    "lineColor": "#e3ef83",
                    "lineStyle": "solid",
                    "fillType": "none",
                    "fillColor": "",
                    "markerColor": "#e3ef83",
                    "avgValueLineColor": "",
                    "avgValueLineStyle": "",
                    "idx": 3,
                    'measureSource': "measurement",
                    'measureName': "generalMeasures",
                    "valueType": "muscleMass",
                    "aggMethod": "avg",
                    "dataType": "number",
                    "dateFormat": ""
                },
                {
                    "id": "percentFat",
                    "label": "Процент жира",
                    "unit": "%",
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
                    "lineColor": "#b060a4",
                    "lineStyle": "solid",
                    "fillType": "none",
                    "fillColor": "",
                    "markerColor": "#b060a4",
                    "avgValueLineColor": "",
                    "avgValueLineStyle": "",
                    "idx": 4,
                    'measureSource': "measurement",
                    'measureName': "generalMeasures",
                    "valueType": "percentFat",
                    "aggMethod": "avg",
                    "dataType": "number",
                    "dateFormat": ""
                }
            ]
        }]
    },
    /**
     16.Вес и объемы
     */
    {
        order: 16,
        active: true,
        auth: [],
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'weightAndTotalVolume.title',
        context: [],
        description: 'weightAndTotalVolume.description',
        globalParams: true,
        settings: [
            {
                ind: [0],
                idx: [1],
                type: 'radio',
                area: 'measures',
                name: 'measureName',
                text: 'volume',
                model: 'distance',
                options: ['duration','distance'],
                change: {
                    duration: {
                        measureName: 'duration',
                        unit: 'ч'
                    },
                    distance: {
                        measureName: 'distance',
                        unit: 'км'
                    }
                }
            },
            {
                ind: [0],
                idx: [1],
                type: 'radio',
                area: 'measures',
                name: 'smoothSettings',
                text: 'volume',
                model: 'curveBasis',
                options: ['curveLinear', 'curveStep', 'curveStepBefore', 'curveStepAfter', 'curveBasis', 'curveCardinal', 'curveMonotoneX', 'curveCatmullRom'],
                change: {
                    curveLinear: { smoothSettings: 'curveLinear'},
                    curveStep: { smoothSettings: 'curveStep'},
                    curveStepBefore: { smoothSettings: 'curveStepBefore'},
                    curveStepAfter: { smoothSettings: 'curveStepAfter'},
                    curveBasis: { smoothSettings: 'curveBasis'},
                    curveCardinal: { smoothSettings: 'curveCardinal'},
                    curveMonotoneX: { smoothSettings: 'curveMonotoneX'},
                    curveCatmullRom: { smoothSettings: 'curveCatmullRom'}
                }
            },
            {
                ind: [0],
                idx: [2],
                type: 'checkbox',
                area: 'measures',
                text: 'measures',
                multiTextParam: 'label',
                model: [true],
                options: [true, false],
                change: {
                    'false': {
                        visible: false
                    },
                    'true': {
                        visible: true
                    }
                }
            }
        ],
        layout: new AnalyticsChartLayout(1,1),
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
                    "vertical-align": "bottom",
                    "horizontal-align": "center",
                    "type": "row"
                },
                "currentPositionLine": {
                    "enabled": true,
                    "radius": 4,
                    "color": "rgba(0,0,0,0.5)"
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
                "seriesDateTrunc": "week",
                "groupByIntervalLength": 1
            }],
            measures: [
                {
                    "label" : "Расстояние",
                    "unit" : "км",
                    chartType: "area",
                    smoothSettings: 'curveBasis',
                    "stacked" : false,
                    "cumulative": false,
                    "tooltipType" : "icon",
                    "minValue" : 0,
                    "legend": false,
                    "visible" : true,
                    "avgValueLine": false,
                    "scaleVisible": true,
                    "calculateTotals": "",
                    lineColor: "#455A64", // blue-grey-500
                    lineStyle: "solid",
                    lineWidth: 2,
                    fillType: "gradient",
                    fillColor: "",
                    gradient: [{
                        offset: "0%",
                        color: "#CFD8DC", //  blue-grey-100
                        opacity: 0.2
                    }, {
                        offset: "100%",
                        color: "#455A64", // blue-grey-500
                        opacity: 0.8
                    }],
                    markerColor: "#455A64", // blue-grey-500
                    "idx" : 1,
                    "measureSource" : "activity.actual.measure",
                    "measureName" : "distance",
                    "dataType": "number",
                    "dateFormat": "",
                    "valueType" : "value",
                    "aggMethod" : "sum"
                },
                {
                    "id": "weight",
                    "label": "Вес",
                    "unit": "кг",
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
                    "lineColor": "#E53935", // red-600
                    "lineStyle": "solid",
                    "fillType": "none",
                    "fillColor": "none",
                    "markerColor": "#E53935", // red-600
                    "avgValueLineColor": "",
                    "avgValueLineStyle": "",
                    "idx": 2,
                    'measureSource': "measurement",
                    'measureName': "sizes",
                    "valueType": "weight",
                    "aggMethod": "avg",
                    "dataType": "number",
                    "dateFormat": ""
                }
            ]
        }]
    },
    /**
     17.План и факт
     */
    {
        order: 17,
        active: true,
        auth: [],
        icon: 'insert_chart', // https://material.io/icons/ с фильтром chart
        title: 'completePercent.title',
        context: [],
        description: 'completePercent.description',
        globalParams: true,
        settings: [
            {
                ind: [0],
                idx: [0],
                type: 'radio',
                area: 'series',
                name: 'seriesDateTrunc',
                text: 'seriesDateTrunc',
                model: 'week',
                options: ['day','week','month'],
                change: {
                    'day': {
                        seriesDateTrunc: 'day'
                    },
                    'week': {
                        seriesDateTrunc: 'week'
                    },
                    'month': {
                        seriesDateTrunc: 'month'
                    }
                }
            },
            {
                ind: [0],
                idx: [2],
                type: 'radio',
                area: 'measures',
                name: 'measureName',
                text: 'volume',
                model: 'duration',
                options: ['duration','distance'],
                change: {
                    duration: {
                        measureName: 'duration',
                        unit: 'ч'
                    },
                    distance: {
                        measureName: 'distance',
                        unit: 'км'
                    }
                }
            },
        ],
        layout: new AnalyticsChartLayout(1,1),
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
                    "vertical-align": "bottom",
                    "horizontal-align": "center",
                    "type": "row"
                },
                "currentPositionLine": {
                    "enabled": true,
                    "radius": 4,
                    "color": "rgba(0,0,0,0.5)"
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
                "seriesDateTrunc": "week",
                "groupByIntervalLength": 1
            }],
            measures: [
                {
                    label: "Процент выполнения",
                    unit: "",
                    chartType: "dot",
                    smoothSettings: 'curveBasis',
                    stacked: false,
                    cumulative: false,
                    tooltipType: "icon",
                    //minValue: 0,
                    legend: true,
                    visible: true,
                    avgValueLine: true,
                    scaleVisible: true,
                    calculateTotals: "",
                    lineColor: "#FF5722", // blue-grey-500
                    lineStyle: "solid",
                    lineWidth: 3,
                    fillType: "gradient",
                    fillColor: "#FF5722",
                    gradient: [{
                        offset: "0%",
                        color: "#D1C4E9", //   blue-grey-100
                        opacity: 0.0
                    }, {
                        offset: "100%",
                        color: "#FF5722", //  blue-grey-500
                        opacity: 0.2
                    }],
                    markerColor: "#FF5722", //  blue-grey-500
                    avgValueLineColor: "#FF5722", //  blue-grey-500
                    avgValueLineStyle: "dashed",
                    idx : 1,
                    measureSource : "activity.plan.measure",
                    measureName : "completePercent",
                    dataType: "value",
                    dateFormat: "",
                    valueType : "value",
                    aggMethod : "avg"
                },
                {
                    label: "Расстояние",
                    unit: "км",
                    chartType: "area",
                    smoothSettings: 'curveBasis',
                    stacked: false,
                    cumulative: false,
                    tooltipType: "icon",
                    minValue: 0,
                    legend: true,
                    visible: true,
                    avgValueLine: false,
                    scaleVisible: true,
                    calculateTotals: "",
                    lineColor: "#455A64", // blue-grey-500
                    lineStyle: "solid",
                    lineWidth: 3,
                    fillType: "gradient",
                    fillColor: "",
                    gradient: [{
                        offset: "0%",
                        color: "#CFD8DC", //  deep-purple-100
                        opacity: 0.2
                    }, {
                        offset: "100%",
                        color: "#455A64", // deep-purple-500
                        opacity: 0.8
                    }],
                    markerColor: "#455A64", // blue-grey-500
                    idx : 2,
                    measureSource : "activity.actual.measure",
                    measureName: "distance",
                    dataType: "number",
                    dateFormat: "",
                    valueType : "value",
                    aggMethod : "sum"
                }
            ]
        }]
    },
 ];