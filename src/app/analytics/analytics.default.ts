import { IAnalyticsChart } from "./analytics-chart/analytics-chart.interface";
import { AnalyticsChartLayout } from "./analytics-chart/analytics-chart.model";
const paletteAll500 = ["#F44336", "#673AB7", "#03A9F4", "#4CAF50", "#FFEB3B", "#FF5722", "#607D8B", "#E91E63", "#3F51B5", "#00BCD4", "#8BC34A", "#FFC107", "#795548", "#9C27B0", "#2196F3", "#009688", "#CDDC39", "#FF9800", "#9E9E9E"];
const paletteSports = ["#2196F3", "#FFC107", "#009688", "#F44336", "#9C27B0", "#795548", "#E91E63", "#9E9E9E"];
const paletteBpm = ["#F8BBD0", "#F48FB1", "#F06292", "#EC407A", "#E91E63", "#D81B60", "#C2185B", "#AD1457", "#880E4F"];
const palettePace = ["#BBDEFB", "#90CAF9", "#65B5F6", "#42A5F5", "#2196F3", "#1E88E5", "#1976D2", "#1566C0", "#0D47A1"];
const palettePower = ["#D1C4E9", "#B39DDB", "#9575CD", "#7E57C2", "#673AB7", "#5E35B1", "#512DA8", "#4527A0", "#311B92"];

//noinspection TypeScriptValidateTypes,TypeScriptValidateTypes
export const DefaultAnalyticsSettings: any[] = [
    /**
     1-coach.Объемы по расстоянию по ученикам
     */
    {
        "order": 1,
        "active": true,
        "revision": 1,
        "auth": ["CoachDashboard"],
        "icon": "insert_chart", // https://material.io/icons/ с фильтром chart
        "code": "distanceByAthletesByPeriods",
        "descriptionParams": [],
        "description": "distanceByAthletesByPeriods.description",
        "globalParams": true,
        "localParams": {
            "users": {
                "type": "checkbox",
                "area": "params",
                "name": "users",
                "text": "users",
                "model": "first5", //первые 5 спортсменов
                "options": [],
            },
            "activityTypes": {
                "type": "checkbox",
                "area": "params",
                "name": "activityTypes",
                "text": "activityTypes",
                "model": null, //все
            },
            "activityCategories": {
                "type": "checkbox",
                "area": "params",
                "name": "activityTypes",
                "text": "activityTypes",
                "model": null,

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
                    "customPeriod",
                ],
            },
        },
        "settings": [
            {
                "ind": [0],
                "idx": [0],
                "type": "radio",
                "area": "series",
                "name": "seriesDateTrunc",
                "text": "seriesDateTrunc",
                "model": "month",
                "options": ["day", "week", "month"],
                "change": {
                    "day": {
                        "seriesDateTrunc": "day",
                    },
                    "week": {
                        "seriesDateTrunc": "week",
                    },
                    "month": {
                        "seriesDateTrunc": "month",
                    },
                },
            },
            {
                "ind": [0],
                "idx": [1],
                "type": "radio",
                "area": "measures",
                "name": "cumulative",
                "text": "cumulative",
                "model": false,
                "options": [false, true],
                "change": {
                    "false": {
                        "cumulative": false,
                    },
                    "true": {
                        "cumulative": true,
                    },
                },
            },
        ],
        "layout": new AnalyticsChartLayout(1, 1),
        "charts": [{
            "params": {
                "users": null, //[this.session.getUser().userId],
                "activityTypes": null, //[2],
                "periods": null,
            },
            "options": {
                "legend": {
                    "vertical-align": "bottom",
                    "horizontal-align": "center",
                    "type": "row",
                },
                "tooltip": {
                    "combined": false,
                },
                "currentPositionLine": {
                    "enabled": false,
                },
                "palette": paletteAll500,
            },
            "series": [{
                "label": "period",
                "unit": "",
                "xAxis": true,
                "tooltipType": "label",
                "tooltipLabel": "period",
                "legend": false,
                "currentPositionLine": false,
                "idx": 0,
                "measureSource": "activity.startDate",
                "measureName": "Months",
                "dataType": "date",
                "dateFormat": "DD.MM",
                "valueType": "value",
                "seriesDateTrunc": "month",
                "groupByIntervalLength": 1,
            },
                {
                    "label": "Атлет",
                    "unit": "",
                    "xAxis": true,
                    "tooltipType": "none",
                    "tooltipLabel": "Атлет",
                    "legend": true,
                    "colorPalette": true,
                    "currentPositionLine": false,
                    "idx": 1,
                    "fillColor": "#449999",
                    "measureSource": "activity.owner",
                    "measureName": "name",
                    "dataType": "string",
                    "dateFormat": "",
                    "valueType": "value",
                    "seriesDateTrunc": "",
                    "groupByIntervalLength": 1
                }],

            "measures": [{
                "label": "distance",
                "unit": "km",
                "chartType": "bar",
                "stacked": false,
                "cumulative": false,
                "smoothSettings": "null",
                "tooltipType": "color",
                "minValue": 0,
                "legend": false,
                "visible": true,
                "avgValueLine": false,
                "scaleVisible": true,
                "calculateTotals": "",
                "fillColor": "",
                "colorPalette": true,
                "idx": 2,
                "measureSource": "activity.actual.measure",
                "measureName": "distance",
                "dataType": "number",
                "dateFormat": "",
                "valueType": "value",
                "aggMethod": "sum",
            }],

        }],
    },
    /**
     2-coach.Объемы по времени по ученикам
     */
    {
        "order": 2,
        "active": true,
        "revision": 1,
        "auth": ["CoachDashboard"],
        "icon": "insert_chart", // https://material.io/icons/ с фильтром chart
        "code": "durationByAthletesByPeriods",
        "descriptionParams": [],
        "description": "durationByAthletesByPeriods.description",
        "globalParams": true,
        "localParams": {
            "users": {
                "type": "checkbox",
                "area": "params",
                "name": "users",
                "text": "users",
                "model": "first5", //первые 5 спортсменов
                "options": [],
            },
            "activityTypes": {
                "type": "checkbox",
                "area": "params",
                "name": "activityTypes",
                "text": "activityTypes",
                "model": null, //все
            },
            "activityCategories": {
                "type": "checkbox",
                "area": "params",
                "name": "activityTypes",
                "text": "activityTypes",
                "model": null,

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
                    "customPeriod",
                ],
            },
        },
        "settings": [
            {
                "ind": [0],
                "idx": [0],
                "type": "radio",
                "area": "series",
                "name": "seriesDateTrunc",
                "text": "seriesDateTrunc",
                "model": "month",
                "options": ["day", "week", "month"],
                "change": {
                    "day": {
                        "seriesDateTrunc": "day",
                    },
                    "week": {
                        "seriesDateTrunc": "week",
                    },
                    "month": {
                        "seriesDateTrunc": "month",
                    },
                },
            },
            {
                "ind": [0],
                "idx": [1],
                "type": "radio",
                "area": "measures",
                "name": "cumulative",
                "text": "cumulative",
                "model": false,
                "options": [false, true],
                "change": {
                    "false": {
                        "cumulative": false,
                    },
                    "true": {
                        "cumulative": true,
                    },
                },
            },
        ],
        "layout": new AnalyticsChartLayout(1, 1),
        "charts": [{
            "params": {
                "users": null, //[this.session.getUser().userId],
                "activityTypes": null, //[2],
                "periods": null,
            },
            "options": {
                "legend": {
                    "vertical-align": "bottom",
                    "horizontal-align": "center",
                    "type": "row",
                },
                "tooltip": {
                    "combined": false,
                },
                "currentPositionLine": {
                    "enabled": false,
                },
                "palette": paletteAll500,
            },
            "series": [{
                "label": "period",
                "unit": "",
                "xAxis": true,
                "tooltipType": "label",
                "tooltipLabel": "period",
                "legend": false,
                "currentPositionLine": false,
                "idx": 0,
                "measureSource": "activity.startDate",
                "measureName": "Weeks",
                "dataType": "date",
                "dateFormat": "DD.MM",
                "valueType": "value",
                "seriesDateTrunc": "month",
                "groupByIntervalLength": 1,
            },
                {
                    "label": "Атлет",
                    "unit": "",
                    "xAxis": true,
                    "tooltipType": "none",
                    "tooltipLabel": "Атлет",
                    "legend": true,
                    "colorPalette": true,
                    "currentPositionLine": false,
                    "idx": 1,
                    "fillColor": "#449999",
                    "measureSource": "activity.owner",
                    "measureName": "name",
                    "dataType": "string",
                    "dateFormat": "",
                    "valueType": "value",
                    "seriesDateTrunc": "",
                    "groupByIntervalLength": 1
                }],

            "measures": [{
                "label": "duration",
                "unit": "h",
                "chartType": "bar",
                "stacked": false,
                "cumulative": false,
                "smoothSettings": "null",
                "tooltipType": "color",
                "minValue": 0,
                "legend": false,
                "visible": true,
                "avgValueLine": false,
                "scaleVisible": true,
                "calculateTotals": "",
                "fillColor": "",
                "colorPalette": true,
                "idx": 2,
                "measureSource": "activity.actual.measure",
                "measureName": "duration",
                "dataType": "number",
                "dateFormat": "",
                "valueType": "value",
                "aggMethod": "sum",
            }],

        }],
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
        "order": 3,
        "active": true,
        "revision": 1,
        "auth": [],
        "icon": "insert_chart", // https://material.io/icons/ с фильтром chart
        "code": "actualMovingDuration",
        "descriptionParams": [{
            "ind": 0,
            "idx": 1,
            "area": "measures",
            "param": "cumulative",
        }, {
            "ind": 0,
            "idx": 0,
            "area": "series",
            "param": "seriesDateTrunc",
        }],
        "description": "actualMovingDuration.description",
        "globalParams": true,
        "settings": [
            {
                "ind": [0],
                "idx": [0],
                "type": "radio",
                "area": "series",
                "name": "seriesDateTrunc",
                "text": "seriesDateTrunc",
                "model": "month",
                "options": ["day", "week", "month"],
                "change": {
                    "day": {
                        "seriesDateTrunc": "day",
                    },
                    "week": {
                        "seriesDateTrunc": "week",
                    },
                    "month": {
                        "seriesDateTrunc": "month",
                    },
                },
            },
            {
                "ind": [0],
                "idx": [1],
                "type": "radio",
                "area": "measures",
                "name": "cumulative",
                "text": "cumulative",
                "model": false,
                "options": [false, true],
                "change": {
                    "false": {
                        "cumulative": false,
                        "chartType": "bar",
                        "fillType": "gradient",
                        "lineWidth": 0,
                        "avgValueLine": true,
                    },
                    "true": {
                        "cumulative": true,
                        "chartType": "area",
                        "fillType": "gradient",
                        "lineWidth": 3,
                        "avgValueLine": false,
                    },
                },
            },
        ],
        "layout": new AnalyticsChartLayout(1, 1),
        "charts": [{
            "params": {
                "users": null, //[this.session.getUser().userId],
                "activityTypes": null, //[2],
                "periods": null,
            },
            "options": {
                "legend": {
                    "vertical-align": "bottom",
                    "horizontal-align": "center",
                    "type": "row",
                },
                "tooltip": {
                    "combined": true,
                },
                "currentPositionLine": {
                    "enabled": true,
                    "color": "rgba(0,0,0,0.5)",
                },
                "colorPalette": false,
            },
            "series": [{
                "label": "period",
                "unit": "",
                "xAxis": true,
                "tooltipType": "label",
                "tooltipLabel": "period",
                "legend": false,
                "currentPositionLine": true,
                "idx": 0,
                "measureSource": "activity.startDate",
                "seriesDateTrunc": "month",
                "measureName": "Months",
                "dataType": "date",
                "dateFormat": "DD.MM",
                "valueType": "value",
                "groupByIntervalLength": 1,
            }],
            "measures": [{
                "label": "duration",
                "unit": "h",
                "chartType": "bar",
                "stacked": false,
                "cumulative": false,
                "smoothSettings": "curveCardinal",
                "tooltipType": "icon",
                "minValue": 0,
                "legend": false,
                "visible": true,
                "avgValueLine": true,
                "scaleVisible": true,
                "calculateTotals": "",
                "lineColor": "#607D8B", // deep-orange-300
                "lineStyle": "solid",
                "lineWidth": 0,
                "fillType": "gradient",
                "fillColor": "#CFD8DC", // deep-orange-200
                "gradient": [{
                    "offset": "0%",
                    "color": "#CFD8DC", // deep-orange-50
                    "opacity": 0.2,
                }, {
                    "offset": "100%",
                    "color": "#607D8B", // deep-orange-300
                    "opacity": 0.6,
                }],
                "markerColor": "#455A64", // deep-orange-300
                "avgValueLineColor": "#455A64", //
                "avgValueLineStyle": "dashed",
                "idx": 1,
                "measureSource": "activity.actual.measure",
                "measureName": "duration",
                "dataType": "number",
                "dateFormat": "",
                "valueType": "value",
                "aggMethod": "sum",
            }, /**,{
                "id": "TL",
                "label": "TL",
                "unit": "",
                "chartType": "dot",
                "stacked": false,
                "cumulative": false,
                "smoothSettings": "curveCardinal",
                "tooltipType": "label",
                "minValue": 0,
                "legend": false,
                "visible": true,
                "avgValueLine": false,
                "scaleVisible": false,
                "calculateTotals": "",
                "lineColor": "#673AB7", //  deep-purple-500
                "lineStyle": "solid",
                radius: 3,
                "fillType": "gradient",
                "fillColor": "",
                "gradient": [{
                    "offset": "0%",
                    "color": "#D1C4E9", //  deep-purple-100
                    "opacity": 0.2
                }, {
                    "offset": "100%",
                    "color": "#673AB7", // deep-purple-500
                    "opacity": 0.6
                }],
                "markerColor": "#673AB7",
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
            }*/],
        }],
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
        "order": 4,
        "active": true,
        "revision": 1,
        "auth": [],
        "icon": "insert_chart", // https://material.io/icons/ с фильтром chart
        "code": "actualDistance",
        "descriptionParams": [{
            "ind": 0,
            "idx": 1,
            "area": "measures",
            "param": "cumulative",
        }, {
            "ind": 0,
            "idx": 0,
            "area": "series",
            "param": "seriesDateTrunc",
        }],
        "description": "actualDistance.description",
        "globalParams": true,
        "settings": [
            {
                "ind": [0],
                "idx": [0],
                "type": "radio",
                "area": "series",
                "name": "seriesDateTrunc",
                "text": "seriesDateTrunc",
                "model": "month",
                "options": ["day", "week", "month"],
                "change": {
                    "day": {
                        "seriesDateTrunc": "day",
                    },
                    "week": {
                        "seriesDateTrunc": "week",
                    },
                    "month": {
                        "seriesDateTrunc": "month",
                    },
                },
            },
            {
                "ind": [0],
                "idx": [1],
                "type": "radio",
                "area": "measures",
                "name": "cumulative",
                "text": "cumulative",
                "model": true,
                "options": [false, true],
                "change": {
                    "false": {
                        "cumulative": false,
                        "chartType": "bar",
                        "fillType": "gradient",
                        "lineWidth": 0,
                        "avgValueLine": true,
                    },
                    "true": {
                        "cumulative": true,
                        "chartType": "area",
                        "fillType": "gradient",
                        "lineWidth": 3,
                        "avgValueLine": false,
                    },
                },
            },
        ],
        "layout": new AnalyticsChartLayout(1, 1),
        "charts": [{
            "params": {
                "users": null, //[this.session.getUser().userId],
                "activityTypes": null, //[2],
                "periods": null,
            },
            "options": {
                "legend": {
                    "vertical-align": "bottom",
                    "horizontal-align": "center",
                    "type": "row",
                },
                "tooltip": {
                    "combined": true,
                },
                "currentPositionLine": {
                    "enabled": true,
                    "color": "rgba(0,0,0,0.5)",
                },
                "colorPalette": false,
            },
            "series": [{
                "label": "period",
                "unit": "",
                "xAxis": true,
                "tooltipType": "label",
                "tooltipLabel": "period",
                "legend": false,
                "currentPositionLine": true,
                "idx": 0,
                "measureSource": "activity.startDate",
                "seriesDateTrunc": "month",
                "measureName": "Months",
                "dataType": "date",
                "dateFormat": "DD.MM",
                "valueType": "value",
                "groupByIntervalLength": 1,
            }],
            "measures": [{
                "label": "distance",
                "unit": "km",
                "chartType": "area",
                "smoothSettings": "curveCardinal",
                "stacked": false,
                "cumulative": true,
                "tooltipType": "icon",
                "minValue": 0,
                "legend": false,
                "visible": true,
                "avgValueLine": false,
                "scaleVisible": true,
                "calculateTotals": "",
                "lineColor": "#607D8B", // deep-orange-300
                "lineStyle": "solid",
                "lineWidth": 2,
                "fillType": "gradient",
                "fillColor": "#CFD8DC", // deep-orange-200
                "gradient": [{
                    "offset": "0%",
                    "color": "#CFD8DC", // deep-orange-50
                    "opacity": 0.2,
                }, {
                    "offset": "100%",
                    "color": "#607D8B", // deep-orange-300
                    "opacity": 0.6,
                }],
                "markerColor": "#455A64", // deep-orange-300
                "avgValueLineColor": "#455A64", //
                "avgValueLineStyle": "dashed",
                "idx": 1,
                "measureSource": "activity.actual.measure",
                "measureName": "distance",
                "dataType": "number",
                "dateFormat": "",
                "valueType": "value",
                "aggMethod": "sum",
            }, /*,{
             "id": "TL",
             "label": "TL",
             "unit": "",
             "chartType": "dot",
             "stacked": false,
             "cumulative": false,
             "smoothSettings": "curveCardinal",
             "tooltipType": "label",
             "minValue": 0,
             "legend": false,
             "visible": true,
             "avgValueLine": false,
             "scaleVisible": false,
             "calculateTotals": "",
             "lineColor": "#673AB7", //  deep-purple-500
             "lineStyle": "solid",
             radius: 3,
             "fillType": "gradient",
             "fillColor": "",
             "gradient": [{
             "offset": "0%",
             "color": "#D1C4E9", //  deep-purple-100
             "opacity": 0.2
             }, {
             "offset": "100%",
             "color": "#673AB7", // deep-purple-500
             "opacity": 0.6
             }],
             "markerColor": "#673AB7",
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

            ],
        }],
    },
    /**
     5.Показатели по периодам (конструктор)
     */
    {
        "order": 5,
        "active": true,
        "revision": 1,
        "auth": [],
        "icon": "insert_chart", // https://material.io/icons/ с фильтром chart
        "code": "activityMeasuresSelected",
        "descriptionParams": [{
            "ind": 0,
            "idx": 0,
            "area": "series",
            "param": "seriesDateTrunc",
        },
            {
                "ind": 0,
                "idx": 1,
                "area": "measures",
                "param": "measureName",
            }],
        "description": "activityMeasuresSelected.description",
        "globalParams": true,
        "localParams": {
            "users": {
                "type": "checkbox",
                "area": "params",
                "name": "users",
                "text": "users",
                "model": "me",
                "options": [],
            },
            "activityTypes": {
                "type": "checkbox",
                "area": "params",
                "name": "activityTypes",
                "text": "activityTypes",
                "model": [2, 3, 4, 5, 6],
            },
            "activityCategories": {
                "type": "checkbox",
                "area": "params",
                "name": "activityCategories",
                "text": "activityCategories",
                "model": [],
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
                    "customPeriod",
                ],
            },
        },
        "settings": [
            {
                "ind": [0],
                "idx": [0],
                "type": "radio",
                "area": "series",
                "name": "seriesDateTrunc",
                "text": "seriesDateTrunc",
                "model": "week",
                "options": ["day", "week", "month"],
                "change": {
                    "day": {
                        "seriesDateTrunc": "day",
                    },
                    "week": {
                        "seriesDateTrunc": "week",
                    },
                    "month": {
                        "seriesDateTrunc": "month",
                    },
                },
            },
            {
                "ind": [0],
                "idx": [1],
                "type": "radio",
                "area": "measures",
                "name": "measureName",
                "text": "volume",
                "model": "duration",
                "options": ["duration", "distance"],
                "change": {
                    "duration": {
                        "measureName": "duration",
                        "unit": "h",
                        "label": "duration",
                    },
                    "distance": {
                        "measureName": "distance",
                        "unit": "km",
                        "label": "distance",
                    },
                },
            },
            {
                "ind": [0],
                "idx": [2, 3, 4],
                "type": "checkbox",
                "area": "measures",
                "text": "measures",
                "multiTextParam": "label",
                "model": [true, true, true],
                "options": [true, false],
                "change": {
                    "false": {
                        "visible": false,
                        "legend": false,
                    },
                    "true": {
                        "visible": true,
                        "legend": true,
                    },
                },
            }, /*
             {
             "ind": [0],
             "idx": [2,3,4,5,6],
             "type": 'checkbox',
             "area": 'measures',
             "text": 'measures',
             "multiTextParam": 'label',
             "model": [true,true,true,false,false],
             "options": [true, false],
             "change": {
             'false': {
             "visible": false,
             "legend": false
             },
             'true': {
             "visible": true,
             "legend": true
             }
             }
             },*/
            {
                "ind": [0],
                "idx": [3],
                "type": "radio",
                "area": "measures",
                "name": "unit",
                "text": "paceSpeedUnit",
                "model": "minpkm",
                "options": ["minpkm", "kmph", "minp100m"],
                "change": {
                    "minpkm": {
                        "unit": "minpkm",
                        "dataType": "time",
                        "dateFormat": "mm:ss",
                        "reverse": true,
                    },
                    "kmph": {
                        "unit": "kmph",
                        "dataType": "number",
                        "dateFormat": "",
                        "reverse": false,
                    },
                    "minp100m": {
                        "unit": "minp100m",
                        "dataType": "time",
                        "dateFormat": "mm:ss",
                        "reverse": true,
                    },
                },
            },
        ],
        "layout": new AnalyticsChartLayout(2, 1),
        "charts": [{
            "params": {
                "users": null, //[this.session.getUser().userId],
                "activityTypes": null, //[2],
                "periods": null,
            },
            "options": {
                "tooltip": {
                    "combined": true,
                },
                "legend": {
                    "vertical-align": "bottom",
                    "horizontal-align": "center",
                    "type": "row",
                },
                "currentPositionLine": {
                    "enabled": true,
                    "radius": 4,
                    "color": "rgba(0,0,0,0.5)",
                },
            },
            "series": [{
                "label": "period",
                "unit": "",
                "xAxis": true,
                "tooltipType": "label",
                "tooltipLabel": "period",
                "legend": false,
                "currentPositionLine": true,
                "idx": 0,
                "measureSource": "activity.startDate",
                "measureName": "Weeks",
                "dataType": "date",
                "dateFormat": "DD.MM",
                "valueType": "value",
                "seriesDateTrunc": "week",
                "groupByIntervalLength": 1,
            }],
            "measures": [
                {
                    "label": "duration",
                    "unit": "h",
                    "chartType": "area",
                    //"stacked": false,
                    "cumulative": false,
                    "smoothSettings": "curveStep",
                    "tooltipType": "icon",
                    "minValue": 0,
                    "legend": false,
                    "visible": true,
                    "avgValueLine": false,
                    "scaleVisible": true,
                    "calculateTotals": "",
                    "lineColor": "#BDBDBD", // grey-400
                    "lineStyle": "none",
                    "lineWidth": 0,
                    "fillType": "gradient",
                    "fillColor": "",
                    "gradient": [{
                        "offset": "0%", // grey-50
                        "color": "#FAFAFA",
                    }, {
                        "offset": "100%",
                        "color": "#E0E0E0", // grey-300
                    }],
                    "markerColor": "#9E9E9E", // grey-500
                    //"avgValueLineColor": "green",
                    //"avgValueLineStyle": "dashed",
                    "idx": 1,
                    "measureSource": "activity.actual.measure",
                    "measureName": "duration",
                    "dataType": "number",
                    "dateFormat": "",
                    "valueType": "value",
                    "aggMethod": "sum",
                },
                {
                    "id": "heartRate",
                    "label": "heartRate",
                    "unit": "bpm",
                    "chartType": "area",
                    "stacked": null,
                    "smoothSettings": "curveCatmullRom",
                    "tooltipType": "color",
                    "legend": true,
                    "visible": true,
                    "avgValueLine": false,
                    "lineColor": "#F06292", // pink-300
                    "lineStyle": "solid",
                    "lineWidth": 2,
                    "fillType": "gradient",
                    "fillColor": "",
                    "gradient": [{
                        "offset": "0%",
                        "color": "#FCE4EC", // pink-50
                        "opacity": 0.1,
                    }, {
                        "offset": "100%",
                        "color": "#F06292", // pink-300
                        "opacity": 0.4,
                    }],
                    "markerColor": "#F06292",
                    "idx": 2,
                    "measureSource": "activity.actual.measure",
                    "measureName": "heartRate",
                    "dataType": "number",
                    "dateFormat": "",
                    "valueType": "avgValue",
                    "aggMethod": "avg",
                },
                {
                    "id": "pace",
                    "label": "speed",
                    "unit": "minpkm",
                    "chartType": "area",
                    "stacked": null,
                    "cumulative": false,
                    "smoothSettings": "curveCatmullRom",
                    "tooltipType": "color",
                    "legend": true,
                    "visible": true,
                    "avgValueLine": false,
                    "scaleVisible": true,
                    "calculateTotals": "",
                    "lineColor": "#64B5F6", // blue-300
                    "lineStyle": "solid",
                    "lineWidth": 2,
                    "fillType": "gradient",
                    "fillColor": "",
                    "gradient": [{
                        "offset": "0%",
                        "color": "#BBDEFB", // blue-100
                        "opacity": 0.1,
                    }, {
                        "offset": "100%",
                        "color": "#64B5F6", // blue-300
                        "opacity": 0.4,
                    }],
                    "markerColor": "#64B5F6", // blue-300
                    "avgValueLineColor": "",
                    "avgValueLineStyle": "",
                    "idx": 3,
                    "measureSource": "activity.actual.measure",
                    "measureName": "speed",
                    "dataType": "time",
                    "dateFormat": "mm:ss",
                    "valueType": "avgValue",
                    "aggMethod": "avg",
                    "reverse": true,
                },
                {
                    "id": "speedDecoupling",
                    "label": "speedDecoupling",
                    "unit": "%",
                    "chartType": "line",
                    "stacked": null,
                    "cumulative": false,
                    "smoothSettings": "curveCatmullRom",
                    "tooltipType": "color",
                    "legend": true,
                    "visible": true,
                    "avgValueLine": false,
                    "scaleVisible": true,
                    "calculateTotals": "",
                    "lineColor": "#9E9E9E", // grey-500
                    "lineStyle": "dashed",
                    "lineWidth": 2,
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
                    "aggMethod": "avg",
                }, /*,
                 {
                 "id": "power",
                 "label": "Мощность",
                 "unit": "Вт",
                 "chartType": "area",
                 "stacked": null,
                 "cumulative": false,
                 "smoothSettings": "curveCatmullRom",
                 "tooltipType": "color",
                 "legend": true,
                 "visible": true,
                 "avgValueLine": false,
                 "scaleVisible": true,
                 "calculateTotals": "",
                 "lineColor": "#BA68C8", // purple-300
                 "lineStyle": "solid",
                 "lineWidth": 2,
                 "fillType": "gradient",
                 "fillColor": "",
                 "gradient": [{
                 "offset": "0%",
                 "color": "#F3E5F5", // purple-50
                 "opacity": 0.1
                 }, {
                 "offset": "100%",
                 "color": "#BA68C8", // purple-300
                 "opacity": 0.4
                 }],
                 "markerColor": "#BA68C8",
                 "avgValueLineColor": "",
                 "avgValueLineStyle": "",
                 "idx": 5,
                 "measureSource": "activity.actual.measure",
                 "measureName": "power",
                 "dataType": "number",
                 "dateFormat": "",
                 "valueType": "avgValue",
                 "aggMethod": "avg"
                 }*//*,
                 {
                 "id": "powerDecoupling",
                 "label": "Мощность:ЧСС",
                 "unit": "%",
                 "chartType": "line",
                 "stacked": null,
                 "cumulative": false,
                 "smoothSettings": "curveCatmullRom",
                 "tooltipType": "color",
                 "legend": false,
                 "visible": false,
                 "avgValueLine": false,
                 "scaleVisible": true,
                 "calculateTotals": "",
                 "lineColor": "#3F51B5",
                 "lineStyle": "dashed",
                 "lineWidth": 2,
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
                 }*/
            ],
        }],
    },
    /**
     6.Нагрузка за период (TL)
     */
    {
        "order": 6,
        "active": true,
        "revision": 1,
        "auth": [],
        "icon": "insert_chart", // https://material.io/icons/ с фильтром chart
        "code": "activityMeasuresTL",
        "descriptionParams": [{
            "ind": 0,
            "idx": 0,
            "area": "series",
            "param": "seriesDateTrunc",
        }],
        "description": "activityMeasuresTL.description",
        "globalParams": true,
        "settings": [
            {
                "ind": [0],
                "idx": [0],
                "type": "radio",
                "area": "series",
                "name": "seriesDateTrunc",
                "text": "seriesDateTrunc",
                "model": "month",
                "options": ["day", "week", "month"],
                "change": {
                    "day": {
                        "seriesDateTrunc": "day",
                    },
                    "week": {
                        "seriesDateTrunc": "week",
                    },
                    "month": {
                        "seriesDateTrunc": "month",
                    },
                },
            },
        ],
        "layout": new AnalyticsChartLayout(1, 1),
        "charts": [{
            "params": {
                "users": null, //[this.session.getUser().userId],
                "activityTypes": null, //[2],
                "periods": null,
            },
            "options": {
                "tooltip": {
                    "combined": true,
                },
                "legend": {
                    "vertical-align": "bottom",
                    "horizontal-align": "center",
                    "type": "row",
                },
                "currentPositionLine": {
                    "enabled": true,
                    "radius": 4,
                    "color": "rgba(0,0,0,0.5)",
                },
            },
            "series": [{
                "label": "period",
                "unit": "",
                "xAxis": true,
                "tooltipType": "label",
                "tooltipLabel": "period",
                "legend": false,
                "currentPositionLine": true,
                "idx": 0,
                "measureSource": "activity.startDate",
                "measureName": "Days",
                "dataType": "date",
                "dateFormat": "DD.MM",
                "valueType": "value",
                "seriesDateTrunc": "month",
                "groupByIntervalLength": 1,
            }],
            "measures": [
                {
                    "id": "TL",
                    "label": "TL",
                    "unit": "",
                    "chartType": "bar",
                    "stacked": false,
                    "cumulative": false,
                    "smoothSettings": "curveBasis",
                    "tooltipType": "color",
                    "minValue": 0,
                    "radius": 3,
                    "legend": true,
                    "visible": true,
                    "avgValueLine": true,
                    "scaleVisible": true,
                    "calculateTotals": "",
                    "lineColor": "#673AB7", //  deep-purple-500
                    "lineStyle": "solid",
                    "lineWidth": 0,
                    "fillType": "gradient",
                    "fillColor": "",
                    "gradient": [{
                        "offset": "0%",
                        "color": "#D1C4E9", //  deep-purple-100
                        "opacity": 0.2,
                    }, {
                        "offset": "100%",
                        "color": "#673AB7", // deep-purple-500
                        "opacity": 0.6,
                    }],
                    "markerColor": "#673AB7",
                    "avgValueLineColor": "#4527A0", // deep-purple-800
                    "avgValueLineStyle": "dashed",
                    "idx": 1,
                    "measureSource": "activity.actual.measure",
                    "measureName": "trainingLoad",
                    "dataType": "number",
                    "dateFormat": "",
                    "valueType": "value",
                    "aggMethod": "sum",
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
                    "reverse": false,
                },
            ],
        }],
    },
    /**
     7.Время в зонах по пульсу
     */
    {
        "order": 7,
        "active": true,
        "revision": 1,
        "auth": [],
        "icon": "insert_chart", // https://material.io/icons/ с фильтром chart
        "code": "timeInZonesHR",
        "descriptionParams": [{
            "ind": 0,
            "idx": 0,
            "area": "series",
            "param": "seriesDateTrunc",
        }],
        "description": "timeInZonesHR.description",
        "globalParams": true,
        "settings": [
            {
                "ind": [0],
                "idx": [0],
                "type": "radio",
                "area": "series",
                "name": "seriesDateTrunc",
                "text": "seriesDateTrunc",
                "model": "week",
                "options": ["day", "week", "month"],
                "change": {
                    "day": {
                        "seriesDateTrunc": "day",
                    },
                    "week": {
                        "seriesDateTrunc": "week",
                    },
                    "month": {
                        "seriesDateTrunc": "month",
                    },
                },
            },
        ],
        "layout": new AnalyticsChartLayout(1, 1),
        "charts": [{
            "params": {
                "users": null, //[this.session.getUser().userId],
                "activityTypes": null, //[2],
                "periods": null,
            },
            "options": {
                "legend": {
                    "vertical-align": "bottom",
                    "horizontal-align": "center",
                    "type": "row",
                },
                "tooltip": {
                    "combined": false,
                },
                "currentPositionLine": {
                    "enabled": true,
                    "color": "rgba(0,0,0,0.5)",
                },
                "palette": paletteBpm,
            },
            "series": [
                {
                    "label": "period",
                    "unit": "",
                    "xAxis": true,
                    "tooltipType": "label",
                    "tooltipLabel": "period",
                    "legend": false,
                    "currentPositionLine": true,
                    "idx": 0,
                    "measureSource": "activity.startDate",
                    "measureName": "Weeks",
                    "dataType": "date",
                    "dateFormat": "DD.MM",
                    "valueType": "value",
                    "seriesDateTrunc": "week",
                    "groupByIntervalLength": 1,
                },
                {
                    "label": "Зоны пульса",
                    "unit": "",
                    "xAxis": true,
                    "tooltipType": "label",
                    "tooltipLabel": "Зона",
                    "legend": false,
                    "colorPalette": false,
                    "currentPositionLine": true,
                    "idx": 1,
                    "measureSource": "activity.owner.zones",
                    "fillColor": "#C2185B", //pink-700
                    "measureName": "heartRate",
                    "dataType": "number",
                    "dateFormat": "",
                    "valueType": "value",
                    "groupBy": "",
                    "groupByIntervalLength": 1,
                }],
            "measures": [{
                "label": "Время в зонах",
                "unit": "h",
                "chartType": "bar",
                "stacked": true,
                "cumulative": false,
                "smoothSettings": "null",
                "tooltipType": "label",
                "tooltipLabel": "duration",
                "minValue": 0,
                "legend": false,
                "colorPalette": true,
                "visible": true,
                "scaleVisible": true,
                "calculateTotals": "",
                "lineColor": "",
                "lineStyle": "none",
                "lineWidth": 0,
                "fillType": "solid",
                "fillColor": "#C2185B", //pink-700
                "markerColor": "#C2185B", //pink-700
                "avgValueLine": false,
                "avgValueLineColor": "",
                "avgValueLineStyle": "",
                "idx": 2,
                "measureSource": "activity.actual.measure",
                "measureName": "heartRateMPM",
                "dataType": "number",
                "dateFormat": "",
                "valueType": "timeInZone",
                "aggMethod": "sum",
            }],

        }],
    },
    /**
     8.Время в зонах по темпу
     */
    {
        "order": 8,
        "revision": 1,
        "active": false,
        "auth": [],
        "icon": "insert_chart", // https://material.io/icons/ с фильтром chart
        "code": "timeInZonesSpeed",
        "description": "timeInZonesSpeed.description",
        "descriptionParams": [{
            "ind": 0,
            "idx": 0,
            "area": "series",
            "param": "seriesDateTrunc",
        }],
        "globalParams": true,
        "settings": [
            {
                "ind": [0],
                "idx": [0],
                "type": "radio",
                "area": "series",
                "name": "seriesDateTrunc",
                "text": "seriesDateTrunc",
                "model": "week",
                "options": ["day", "week", "month"],
                "change": {
                    "day": {
                        "seriesDateTrunc": "day",
                    },
                    "week": {
                        "seriesDateTrunc": "week",
                    },
                    "month": {
                        "seriesDateTrunc": "month",
                    },
                },
            },
        ],
        "layout": new AnalyticsChartLayout(1, 1),
        "charts": [{
            "params": {
                "users": null, //[this.session.getUser().userId],
                "activityTypes": null, //[2],
                "periods": null,
            },
            "options": {
                "legend": {
                    "vertical-align": "bottom",
                    "horizontal-align": "center",
                    "type": "row",
                },
                "tooltip": {
                    "combined": false,
                },
                "currentPositionLine": {
                    "enabled": true,
                    "color": "rgba(0,0,0,0.5)",
                },
                "palette": palettePace,
            },
            "series": [
                {
                    "label": "period",
                    "unit": "",
                    "xAxis": true,
                    "tooltipType": "label",
                    "tooltipLabel": "period",
                    "legend": false,
                    "currentPositionLine": true,
                    "idx": 0,
                    "measureSource": "activity.startDate",
                    "measureName": "Weeks",
                    "dataType": "date",
                    "dateFormat": "DD.MM",
                    "valueType": "value",
                    "seriesDateTrunc": "week",
                    "groupByIntervalLength": 1,
                },
                {
                    "label": "Зоны",
                    "unit": "",
                    "xAxis": true,
                    "tooltipType": "label",
                    "tooltipLabel": "Зона",
                    "legend": false,
                    "currentPositionLine": true,
                    "idx": 1,
                    "colorPalette": false,
                    "measureSource": "activity.owner.zones",
                    "fillColor": "#1976D2", //blue-700
                    "measureName": "speed",
                    "dataType": "number",
                    "dateFormat": "",
                    "valueType": "value",
                    "groupBy": "",
                    "groupByIntervalLength": 1,
                }],
            "measures": [{
                "label": "Время в зонах",
                "unit": "h",
                "chartType": "bar",
                "stacked": true,
                "cumulative": false,
                "smoothSettings": "null",
                "tooltipType": "label",
                "tooltipLabel": "duration",
                "minValue": 0,
                "colorPalette": true,
                "legend": false,
                "visible": true,
                "scaleVisible": true,
                "calculateTotals": "",
                "lineColor": "",
                "lineStyle": "none",
                "lineWidth": 0,
                "fillType": "solid",
                "fillColor": "#1976D2", //blue-700
                "markerColor": "#1976D2", //blue-700
                "avgValueLine": false,
                "avgValueLineColor": "green",
                "avgValueLineStyle": "dashed",
                "idx": 2,
                "measureSource": "activity.actual.measure",
                "measureName": "speedMPM",
                "dataType": "number",
                "dateFormat": "",
                "valueType": "timeInZone",
                "aggMethod": "sum",
            }],

        }],
    },
    /**
     9.Время в зонах по мощности
     */
    {
        "order": 9,
        "revision": 1,
        "active": false,
        "auth": [],
        "icon": "insert_chart", // https://material.io/icons/ с фильтром chart
        "code": "timeInZonesPower",
        "description": "timeInZonesPower.description",
        "descriptionParams": [{
            "ind": 0,
            "idx": 0,
            "area": "series",
            "param": "seriesDateTrunc",
        }],
        "globalParams": true,
        "settings": [
            {
                "ind": [0],
                "idx": [0],
                "type": "radio",
                "area": "series",
                "name": "seriesDateTrunc",
                "text": "seriesDateTrunc",
                "model": "week",
                "options": ["day", "week", "month"],
                "change": {
                    "day": {
                        "seriesDateTrunc": "day",
                    },
                    "week": {
                        "seriesDateTrunc": "week",
                    },
                    "month": {
                        "seriesDateTrunc": "month",
                    },
                },
            },
        ],
        "layout": new AnalyticsChartLayout(1, 1),
        "charts": [{
            "params": {
                "users": null, //[this.session.getUser().userId],
                "activityTypes": null, //[2],
                "periods": null,
            },
            "options": {
                "legend": {
                    "vertical-align": "bottom",
                    "horizontal-align": "center",
                    "type": "row",
                },
                "tooltip": {
                    "combined": false,
                },
                "currentPositionLine": {
                    "enabled": true,
                    "color": "rgba(0,0,0,0.5)",
                },
                "palette": palettePower,
            },
            "series": [
                {
                    "label": "period",
                    "unit": "",
                    "xAxis": true,
                    "tooltipType": "label",
                    "tooltipLabel": "period",
                    "legend": false,
                    "currentPositionLine": true,
                    "idx": 0,
                    "measureSource": "activity.startDate",
                    "measureName": "Weeks",
                    "dataType": "date",
                    "dateFormat": "DD.MM",
                    "valueType": "value",
                    "seriesDateTrunc": "week",
                    "groupByIntervalLength": 1,
                },
                {
                    "label": "Зоны мощности",
                    "unit": "",
                    "xAxis": true,
                    "tooltipType": "label",
                    "tooltipLabel": "Зона",
                    "legend": false,
                    "currentPositionLine": true,
                    "idx": 1,
                    "colorPalette": false,
                    "measureSource": "activity.owner.zones",
                    "fillColor": "#7B1FA2", //purple-700
                    "measureName": "power",
                    "dataType": "number",
                    "dateFormat": "",
                    "valueType": "value",
                    "groupBy": "",
                    "groupByIntervalLength": 1,
                }],
            "measures": [{
                "label": "Время в зонах",
                "unit": "",
                "chartType": "bar",
                "stacked": true,
                "cumulative": false,
                "smoothSettings": "null",
                "tooltipType": "label",
                "tooltipLabel": "duration",
                "minValue": 0,
                "legend": false,
                "visible": true,
                "scaleVisible": true,
                "calculateTotals": "",
                "colorPalette": true,
                "lineColor": "",
                "lineStyle": "none",
                "lineWidth": 0,
                "fillType": "solid",
                "fillColor": "#7B1FA2", //purple-700
                "markerColor": "#7B1FA2", //purple-700
                "avgValueLine": false,
                "avgValueLineColor": "green",
                "avgValueLineStyle": "dashed",
                "idx": 2,
                "measureSource": "activity.actual.measure",
                "measureName": "powerMPM",
                "dataType": "number",
                "dateFormat": "",
                "valueType": "timeInZone",
                "aggMethod": "sum",
            }],

        }],
    },
    /**
     10.Пики по пульсу по времени
     */
    {
        "order": 10,
        "active": true,
        "revision": 1,
        "auth": [],
        "icon": "insert_chart", // https://material.io/icons/ с фильтром chart
        "code": "HRTimePeaks",
        "description": "HRTimePeaks.description",
        "globalParams": true,
        "settings": [],
        "layout": new AnalyticsChartLayout(1, 1),
        "charts": [{
            "params": {
                "users": null, //[this.session.getUser().userId],
                "activityTypes": null, //[2],
                "periods": null,
            },
            "options": {
                "tooltip": {
                    "combined": true,
                },
                "currentPositionLine": {
                    "enabled": true,
                    "color": "rgba(0,0,0,0.5)",
                },
            },
            "series": [{
                "label": "peaks",
                "unit": "",
                "xAxis": true,
                "tooltipType": "label",
                "tooltipLabel": "peak",
                "legend": false,
                "currentPositionLine": true,
                "idx": 0,
                "measureSource": "peaksByTime",
                "measureName": "Peaks",
                "dataType": "string",
                "dateFormat": "",
                "valueType": "value",
                "seriesDateTrunc": "",
                "groupByIntervalLength": 1,
            }],
            "measures": [{
                "id": "0",
                "label": "heartRate",
                "unit": "bpm",
                "chartType": "area",
                "smoothSettings": "curveCatmullRom",
                "tooltipType": "icon",
                "legend": false,
                "lineColor": "#E91E63", //  pink-500
                "lineStyle": "solid",
                "lineWidth": 2,
                "fillType": "gradient",
                "fillColor": "",
                "gradient": [{
                    "offset": "0%",
                    "color": "#F8BBD0", //  pink-100
                    "opacity": 0.2,
                }, {
                    "offset": "100%",
                    "color": "#E91E63", // pink-500
                    "opacity": 0.6,
                }],
                "idx": 1,
                "measureSource": "activity.actual.measure",
                "measureName": "heartRateTimePeaks",
                "dataType": "number",
                "dateFormat": "",
                "valueType": "peak",
                "aggMethod": "max",
            }],
        }],
    },
    /**
     11.Пики по темпу/скорости по времени
     */
    {
        "order": 11,
        "revision": 1,
        "active": false,
        "auth": [],
        "icon": "insert_chart", // https://material.io/icons/ с фильтром chart
        "code": "PaceTimePeaks",
        "description": "PaceTimePeaks.description",
        "globalParams": true,
        "settings": [
            {
                "ind": [0],
                "idx": [1],
                "type": "radio",
                "area": "measures",
                "name": "unit",
                "text": "paceSpeedUnit",
                "model": "minpkm",
                "options": ["minpkm", "kmph", "minp100m"],
                "change": {
                    "minpkm": {
                        "unit": "minpkm",
                        "dataType": "time",
                        "dateFormat": "mm:ss",
                        "reverse": true,
                    },
                    "kmph": {
                        "unit": "kmph",
                        "dataType": "number",
                        "dateFormat": "",
                        "reverse": false,
                    },
                    "minp100m": {
                        "unit": "minp100m",
                        "dataType": "time",
                        "dateFormat": "mm:ss",
                        "reverse": true,
                    },
                },
            },
        ],
        "layout": new AnalyticsChartLayout(1, 1),
        "charts": [{
            "params": {
                "users": null, //[this.session.getUser().userId],
                "activityTypes": null, //[2],
                "periods": null,
            },
            "options": {
                "tooltip": {
                    "combined": true,
                },
                "currentPositionLine": {
                    "enabled": true,
                    "color": "rgba(0,0,0,0.5)",
                },
            },
            "series": [{
                "label": "peaks",
                "unit": "",
                "xAxis": true,
                "tooltipType": "label",
                "tooltipLabel": "peak",
                "legend": false,
                "currentPositionLine": true,
                "idx": 0,
                "measureSource": "peaksByTime",
                "measureName": "Peaks",
                "dataType": "string",
                "dateFormat": "",
                "valueType": "value",
                "seriesDateTrunc": "",
                "groupByIntervalLength": 1,
            }],
            "measures": [{
                "id": "0",
                "label": "Темп",
                "unit": "minpkm",
                "chartType": "area",
                "smoothSettings": "curveCatmullRom",
                "tooltipType": "icon",
                "legend": false,
                "lineColor": "#2196F3", //  blue-500
                "lineStyle": "solid",
                "lineWidth": 2,
                "fillType": "gradient",
                "fillColor": "",
                "gradient": [{
                    "offset": "0%",
                    "color": "#BBDEFB", //  blue-100
                    "opacity": 0.2,
                }, {
                    "offset": "100%",
                    "color": "#2196F3", // blue-500
                    "opacity": 0.6,
                }],
                "idx": 1,
                "measureSource": "activity.actual.measure",
                "measureName": "speedTimePeaks",
                "dataType": "time",
                "dateFormat": "mm:ss",
                "valueType": "peak",
                "aggMethod": "max",
                "reverse": true,
            }],
        }],
    },

    /**
     12.Пики по мощности по времени
     */
    {
        "order": 12,
        "revision": 1,
        "active": false,
        "auth": [],
        "icon": "insert_chart", // https://material.io/icons/ с фильтром chart
        "code": "PowerTimePeaks",
        "description": "PowerTimePeaks.description",
        "globalParams": true,
        "settings": [],
        "layout": new AnalyticsChartLayout(1, 1),
        "charts": [{
            "params": {
                "users": null, //[this.session.getUser().userId],
                "activityTypes": null, //[2],
                "periods": null,
            },
            "options": {
                "tooltip": {
                    "combined": true,
                },
                "currentPositionLine": {
                    "enabled": true,
                    "color": "rgba(0,0,0,0.5)",
                },
            },
            "series": [{
                "label": "peaks",
                "unit": "",
                "xAxis": true,
                "tooltipType": "label",
                "tooltipLabel": "peak",
                "legend": false,
                "currentPositionLine": true,
                "idx": 0,
                "measureSource": "peaksByTime",
                "measureName": "Peaks",
                "dataType": "string",
                "dateFormat": "",
                "valueType": "value",
                "seriesDateTrunc": "",
                "groupByIntervalLength": 1,
            }],
            "measures": [{
                "id": "0",
                "label": "Мощность",
                "unit": "Вт",
                "chartType": "area",
                "smoothSettings": "curveCatmullRom",
                "tooltipType": "icon",
                "legend": false,
                "lineColor": "#9C27B0", //  purple-500
                "lineStyle": "solid",
                "lineWidth": 2,
                "fillType": "gradient",
                "fillColor": "",
                "gradient": [{
                    "offset": "0%",
                    "color": "#E1BEE7", //  purple-100
                    "opacity": 0.2,
                }, {
                    "offset": "100%",
                    "color": "#9C27B0", // purple-500
                    "opacity": 0.6,
                }],
                "idx": 1,
                "measureSource": "activity.actual.measure",
                "measureName": "powerTimePeaks",
                "dataType": "number",
                "dateFormat": "",
                "valueType": "peak",
                "aggMethod": "max",
            }],
        }],
    },
    /**
     13.Объемы по видам спорта по периодам
     Stacked bar chart
     */
    {
        "order": 13,
        "active": false,
        "revision": 1,
        "auth": [],
        "icon": "insert_chart", // https://material.io/icons/ с фильтром chart
        "code": "DistanceByActivityTypeByPeriods",
        "description": "DistanceByActivityTypeByPeriods.description",
        "descriptionParams": [
            {
                "ind": 0,
                "idx": 0,
                "area": "series",
                "param": "seriesDateTrunc",
            },
            {
                "ind": 0,
                "idx": 2,
                "area": "measures",
                "param": "measureName",
            },
        ],
        "globalParams": true,
        "settings": [
            {
                "ind": [0],
                "idx": [2],
                "type": "radio",
                "area": "measures",
                "name": "measureName",
                "text": "volume",
                "model": "duration",
                "options": ["duration", "distance"],
                "change": {
                    "duration": {
                        "measureName": "duration",
                        "unit": "h",
                    },
                    "distance": {
                        "measureName": "distance",
                        "unit": "km",
                    },
                },
            },
            {
                "ind": [0],
                "idx": [0],
                "type": "radio",
                "area": "series",
                "name": "seriesDateTrunc",
                "text": "seriesDateTrunc",
                "model": "month",
                "options": ["day", "week", "month"],
                "change": {
                    "day": {
                        "seriesDateTrunc": "day",
                    },
                    "week": {
                        "seriesDateTrunc": "week",
                    },
                    "month": {
                        "seriesDateTrunc": "month",
                    },
                },
            },
        ],
        "layout": new AnalyticsChartLayout(1, 1),
        "charts": [{
            "params": {
                "users": null, //[this.session.getUser().userId],
                "activityTypes": null, //[2],
                "periods": null,
            },
            "options": {
                "legend": {
                    "vertical-align": "bottom",
                    "horizontal-align": "center",
                    "type": "row",
                },
                "tooltip": {
                    "combined": true,
                },
                "currentPositionLine": {
                    "enabled": true,
                    "color": "rgba(0,0,0,0.5)",

                },
                "palette": paletteSports,
            },
            "series": [{
                "label": "period",
                "unit": "",
                "xAxis": true,
                "tooltipType": "label",
                "tooltipLabel": "period",
                "legend": false,
                "currentPositionLine": false,
                "idx": 0,
                "measureSource": "activity.startDate",
                "measureName": "Weeks",
                "dataType": "date",
                "dateFormat": "DD.MM",
                "valueType": "value",
                "seriesDateTrunc": "week",
                "groupByIntervalLength": 1,
            },
                {
                    "label": "Виды спорта",
                    "unit": "",
                    "xAxis": true,
                    "tooltipType": "none",
                    "tooltipLabel": "Вид спорта",
                    "legend": true,
                    "colorPalette": true,
                    "currentPositionLine": false,
                    "idx": 1,
                    "fillColor": "#449999",
                    "measureSource": "activityTypeBasic",
                    "measureName": "activityType",
                    "dataType": "string",
                    "dateFormat": "",
                    "valueType": "value",
                    "seriesDateTrunc": "",
                    "groupByIntervalLength": 1
                },

            ],
            "measures": [{
                "label": "duration",
                "unit": "h",
                "chartType": "bar",
                "stacked": true,
                "cumulative": false,
                "smoothSettings": "null",
                "tooltipType": "color",
                "minValue": 0,
                "legend": false,
                "visible": true,
                "avgValueLine": false,
                "scaleVisible": true,
                "calculateTotals": "",
                "fillColor": "",
                "colorPalette": true,
                "idx": 2,
                "measureSource": "activity.actual.measure",
                "measureName": "duration",
                "dataType": "number",
                "dateFormat": "",
                "valueType": "value",
                "aggMethod": "sum",

            }],
        }],
    },
    /**
     14.Объемы по видам спорта (piechart)
     */
    {
        "order": 14,
        "active": true,
        "revision": 1,
        "auth": [],
        "icon": "insert_chart", // https://material.io/icons/ с фильтром chart
        "code": "DistanceByActivityTypes",
        "description": "DistanceByActivityTypes.description",
        "descriptionParams": [
            {
                "ind": 0,
                "idx": 1,
                "area": "measures",
                "param": "measureName",
            },
        ],
        "globalParams": true,
        "settings": [
            {
                "ind": [0],
                "idx": [1],
                "type": "radio",
                "area": "measures",
                "name": "measureName",
                "text": "volume",
                "model": "duration",
                "options": ["duration", "distance"],
                "change": {
                    "duration": {
                        "measureName": "duration",
                        "unit": "h",
                    },
                    "distance": {
                        "measureName": "distance",
                        "unit": "km",
                    },
                },
            },
        ],
        "layout": new AnalyticsChartLayout(1, 1),
        "charts": [{
            "params": {
                "users": null, //[this.session.getUser().userId],
                "activityTypes": null, //[2],
                "periods": null,
            },
            "options": {
                "legend": {
                    "vertical-align": "bottom",
                    "horizontal-align": "center",
                    "type": "row",
                },
                "palette": paletteSports,
            },
            "series": [
                {
                    "label": "Виды спорта",
                    "unit": "",
                    "xAxis": true,
                    "tooltipType": "label",
                    "tooltipLabel": "Вид спорта",
                    "legend": true,
                    "colorPalette": true,
                    "currentPositionLine": false,
                    "idx": 0,
                    "fillColor": "#449999",
                    "measureSource": "activityTypeBasic",
                    "measureName": "activityType",
                    "dataType": "string",
                    "dateFormat": "",
                    "valueType": "value",
                    "seriesDateTrunc": "",
                    "groupByIntervalLength": 1
                },
            ],
            "measures": [
                {
                    "label": "duration",
                    "unit": "h",
                    "chartType": "donut",
                    "stacked": false,
                    "cumulative": false,
                    "smoothSettings": "null",
                    "tooltipType": "color",
                    "minValue": 0,
                    "legend": false,
                    "visible": true,
                    "avgValueLine": false,
                    "scaleVisible": true,
                    "calculateTotals": "",
                    "fillColor": "",
                    "colorPalette": true,
                    "idx": 1,
                    "measureSource": "activity.actual.measure",
                    "measureName": "duration",
                    "dataType": "number",
                    "dateFormat": "",
                    "valueType": "value",
                    "aggMethod": "sum",
                }],
        }],
    },
    /**
     15.История измерений
     */
    {
        "order": 15,
        "active": true,
        "revision": 1,
        "auth": [],
        "icon": "insert_chart", // https://material.io/icons/ с фильтром chart
        "code": "measurementsByPeriods",
        "descriptionParams": [],
        "description": "measurementsByPeriods.description",
        "globalParams": true,
        "settings": [
            {
                "ind": [0],
                "idx": [1, 2, 3, 4],
                "type": "checkbox",
                "area": "measures",
                "text": "measures",
                "multiTextParam": "label",
                "model": [true, true, false, false],
                "options": [true, false],
                "change": {
                    "false": {
                        "visible": false,
                    },
                    "true": {
                        "visible": true,
                    },
                },
            },
        ],
        "layout": new AnalyticsChartLayout(1, 1),
        "charts": [{
            "params": {
                "users": null, //[this.session.getUser().userId],
                "activityTypes": null, //[2],
                "periods": null,
            },
            "options": {
                "tooltip": {
                    "combined": true,
                },
                "legend": {
                    "vertical-align": "bottom",
                    "horizontal-align": "center",
                    "type": "row",
                },
                "currentPositionLine": {
                    "enabled": true,
                    "radius": 4,
                    "color": "rgba(0,0,0,0.5)",
                },
            },
            "series": [{
                "label": "period",
                "unit": "",
                "xAxis": true,
                "tooltipType": "label",
                "tooltipLabel": "period",
                "legend": false,
                "currentPositionLine": true,
                "idx": 0,
                "measureSource": "activity.startDate",
                "measureName": "Days",
                "dataType": "date",
                "dateFormat": "DD.MM",
                "valueType": "value",
                "seriesDateTrunc": "day",
                "groupByIntervalLength": 1,
            }],
            "measures": [
                {
                    "id": "pulse",
                    "label": "pulse",
                    "unit": "bpm",
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
                    "lineColor": "#00838F", // 800
                    "lineStyle": "dashed",
                    "lineWidth": 3,
                    "fillType": "gradient",
                    "fillColor": "#FF5722",
                    "gradient": [{
                        "offset": "0%",
                        "color": "#B2EBF2", //   100
                        "opacity": 0.0,
                    }, {
                        "offset": "100%",
                        "color": "#00ACC1", //  600
                        "opacity": 0.2,
                    }],
                    "markerColor": "#00838F", // 800
                    "idx": 1,
                    "measureSource": "measurement",
                    "measureName": "generalMeasures",
                    "valueType": "pulse",
                    "aggMethod": "avg",
                    "dataType": "number",
                    "dateFormat": "",
                },
                {
                    "id": "weight",
                    "label": "weight",
                    "unit": "kg",
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
                    "lineColor": "#C62828", // red-600
                    "lineStyle": "dashed",
                    "lineWidth": 3,
                    "fillType": "gradient",
                    "fillColor": "#FF5722",
                    "gradient": [{
                        "offset": "0%",
                        "color": "#FFCDD2", //   blue-grey-100
                        "opacity": 0.0,
                    }, {
                        "offset": "100%",
                        "color": "#E53935", //  blue-grey-500
                        "opacity": 0.2,
                    }],
                    "markerColor": "#C62828", // red-600
                    "avgValueLineColor": "",
                    "avgValueLineStyle": "",
                    "idx": 2,
                    "measureSource": "measurement",
                    "measureName": "sizes",
                    "valueType": "weight",
                    "aggMethod": "avg",
                    "dataType": "number",
                    "dateFormat": "",
                },
                {
                    "id": "muscleMass",
                    "label": "Мышечная масса",
                    "unit": "kg",
                    "chartType": "area",
                    "stacked": null,
                    "cumulative": false,
                    "smoothSettings": "curveBasis",
                    "tooltipType": "color",
                    "legend": true,
                    "visible": false,
                    "avgValueLine": false,
                    "scaleVisible": true,
                    "calculateTotals": "",
                    "lineColor": "#00695C", // red-600
                    "lineStyle": "dashed",
                    "lineWidth": 3,
                    "fillType": "gradient",
                    "fillColor": "#FF5722",
                    "gradient": [{
                        "offset": "0%",
                        "color": "#B2DFDB", //   blue-grey-100
                        "opacity": 0.0,
                    }, {
                        "offset": "100%",
                        "color": "#00897B", //  blue-grey-500
                        "opacity": 0.2,
                    }],
                    "markerColor": "#00695C", // red-600
                    "avgValueLineColor": "",
                    "avgValueLineStyle": "",
                    "idx": 3,
                    "measureSource": "measurement",
                    "measureName": "generalMeasures",
                    "valueType": "muscleMass",
                    "aggMethod": "avg",
                    "dataType": "number",
                    "dateFormat": "",
                },
                {
                    "id": "percentFat",
                    "label": "Процент жира",
                    "unit": "%",
                    "chartType": "area",
                    "stacked": null,
                    "cumulative": false,
                    "smoothSettings": "curveBasis",
                    "tooltipType": "color",
                    "legend": true,
                    "visible": false,
                    "avgValueLine": false,
                    "scaleVisible": true,
                    "calculateTotals": "",
                    "lineColor": "#FF8F00", // red-600
                    "lineStyle": "dashed",
                    "lineWidth": 3,
                    "fillType": "gradient",
                    "fillColor": "#FF5722",
                    "gradient": [{
                        "offset": "0%",
                        "color": "#FFECB3", //   blue-grey-100
                        "opacity": 0.0,
                    }, {
                        "offset": "100%",
                        "color": "#FFB300", //  blue-grey-500
                        "opacity": 0.2,
                    }],
                    "markerColor": "#FF8F00", // red-600
                    "avgValueLineColor": "",
                    "avgValueLineStyle": "",
                    "idx": 4,
                    "measureSource": "measurement",
                    "measureName": "generalMeasures",
                    "valueType": "percentFat",
                    "aggMethod": "avg",
                    "dataType": "number",
                    "dateFormat": "",
                },
            ],
        }],
    },
    /**
     16.Вес и объемы
     */
    {
        "order": 16,
        "active": true,
        "revision": 1,
        "auth": [],
        "icon": "insert_chart", // https://material.io/icons/ с фильтром chart
        "code": "weightAndTotalVolume",
        "descriptionParams": [
            {
                "ind": 0,
                "idx": 0,
                "area": "series",
                "param": "seriesDateTrunc",
            },
            {
                "ind": 0,
                "idx": 1,
                "area": "measures",
                "param": "measureName",
            },
        ],
        "description": "weightAndTotalVolume.description",
        "globalParams": true,
        "settings": [
            {
                "ind": [0],
                "idx": [0],
                "type": "radio",
                "area": "series",
                "name": "seriesDateTrunc",
                "text": "seriesDateTrunc",
                "model": "week",
                "options": ["day", "week", "month"],
                "change": {
                    "day": {
                        "seriesDateTrunc": "day",
                    },
                    "week": {
                        "seriesDateTrunc": "week",
                    },
                    "month": {
                        "seriesDateTrunc": "month",
                    },
                },
            },
            {
                "ind": [0],
                "idx": [1],
                "type": "radio",
                "area": "measures",
                "name": "measureName",
                "text": "volume",
                "model": "duration",
                "options": ["duration", "distance"],
                "change": {
                    "duration": {
                        "measureName": "duration",
                        "unit": "h",
                    },
                    "distance": {
                        "measureName": "distance",
                        "unit": "km",
                    },
                },
            },
        ],
        "layout": new AnalyticsChartLayout(1, 1),
        "charts": [{
            "params": {
                "users": null, //[this.session.getUser().userId],
                "activityTypes": null, //[2],
                "periods": null,
            },
            "options": {
                "tooltip": {
                    "combined": true,
                },
                "legend": {
                    "vertical-align": "bottom",
                    "horizontal-align": "center",
                    "type": "row",
                },
                "currentPositionLine": {
                    "enabled": true,
                    "radius": 4,
                    "color": "rgba(0,0,0,0.5)",
                },
            },
            "series": [{
                "label": "period",
                "unit": "",
                "xAxis": true,
                "tooltipType": "label",
                "tooltipLabel": "period",
                "legend": false,
                "currentPositionLine": true,
                "idx": 0,
                "measureSource": "activity.startDate",
                "measureName": "Days",
                "dataType": "date",
                "dateFormat": "DD.MM",
                "valueType": "value",
                "seriesDateTrunc": "week",
                "groupByIntervalLength": 1,
            }],
            "measures": [
                {
                    "label": "duration",
                    "unit": "h",
                    "chartType": "bar",
                    "smoothSettings": "curveBasis",
                    "stacked": false,
                    "cumulative": false,
                    "tooltipType": "icon",
                    "minValue": 0,
                    "legend": true,
                    "visible": true,
                    "avgValueLine": false,
                    "scaleVisible": true,
                    "calculateTotals": "",
                    "lineColor": "#607D8B", // deep-orange-300
                    "lineStyle": "solid",
                    "lineWidth": 0,
                    "fillType": "gradient",
                    "fillColor": "#CFD8DC", // deep-orange-200
                    "gradient": [{
                        "offset": "0%",
                        "color": "#CFD8DC", // deep-orange-50
                        "opacity": 0.2,
                    }, {
                        "offset": "100%",
                        "color": "#607D8B", // deep-orange-300
                        "opacity": 0.6,
                    }],
                    "markerColor": "#455A64", // deep-orange-300
                    "idx": 1,
                    "measureSource": "activity.actual.measure",
                    "measureName": "duration",
                    "dataType": "number",
                    "dateFormat": "",
                    "valueType": "value",
                    "aggMethod": "sum",
                },
                {
                    "id": "weight",
                    "label": "weight",
                    "unit": "kg",
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
                    "lineColor": "#C62828", // red-600
                    "lineStyle": "dashed",
                    "lineWidth": 3,
                    "fillType": "gradient",
                    "fillColor": "#FF5722",
                    "gradient": [{
                        "offset": "0%",
                        "color": "#FFCDD2", //   blue-grey-100
                        "opacity": 0.0,
                    }, {
                        "offset": "100%",
                        "color": "#E53935", //  blue-grey-500
                        "opacity": 0.2,
                    }],
                    "markerColor": "#C62828", // red-600
                    "avgValueLineColor": "",
                    "avgValueLineStyle": "",
                    "idx": 2,
                    "measureSource": "measurement",
                    "measureName": "sizes",
                    "valueType": "weight",
                    "aggMethod": "avg",
                    "dataType": "number",
                    "dateFormat": "",
                },
            ],
        }],
    },
    /**
     17.План и факт
     */
    {
        "order": 17,
        "active": true,
        "revision": 1,
        "auth": [],
        "icon": "insert_chart", // https://material.io/icons/ с фильтром chart
        "code": "completePercent",
        "descriptionParams": [
            {
                "ind": 0,
                "idx": 0,
                "area": "series",
                "param": "seriesDateTrunc",
            },
            {
                "ind": 0,
                "idx": 1,
                "area": "measures",
                "param": "measureName",
            },
        ],
        "description": "completePercent.description",
        "globalParams": true,
        "settings": [
            {
                "ind": [0],
                "idx": [0],
                "type": "radio",
                "area": "series",
                "name": "seriesDateTrunc",
                "text": "seriesDateTrunc",
                "model": "week",
                "options": ["day", "week", "month"],
                "change": {
                    "day": {
                        "seriesDateTrunc": "day",
                    },
                    "week": {
                        "seriesDateTrunc": "week",
                    },
                    "month": {
                        "seriesDateTrunc": "month",
                    },
                },
            },
            {
                "ind": [0],
                "idx": [1],
                "type": "radio",
                "area": "measures",
                "name": "measureName",
                "text": "volume",
                "model": "duration",
                "options": ["duration", "distance"],
                "change": {
                    "duration": {
                        "measureName": "duration",
                        "unit": "h",
                    },
                    "distance": {
                        "measureName": "distance",
                        "unit": "km",
                    },
                },
            },
        ],
        "layout": new AnalyticsChartLayout(1, 1),
        "charts": [{
            "params": {
                "users": null, //[this.session.getUser().userId],
                "activityTypes": null, //[2],
                "periods": null,
            },
            "options": {
                "tooltip": {
                    "combined": true,
                },
                "legend": {
                    "vertical-align": "bottom",
                    "horizontal-align": "center",
                    "type": "row",
                },
                "currentPositionLine": {
                    "enabled": true,
                    "radius": 4,
                    "color": "rgba(0,0,0,0.5)",
                },
            },
            "series": [{
                "label": "period",
                "unit": "",
                "xAxis": true,
                "tooltipType": "label",
                "tooltipLabel": "period",
                "legend": false,
                "currentPositionLine": true,
                "idx": 0,
                "measureSource": "activity.startDate",
                "measureName": "Weeks",
                "dataType": "date",
                "dateFormat": "DD.MM",
                "valueType": "value",
                "seriesDateTrunc": "week",
                "groupByIntervalLength": 1,
            }],
            "measures": [
                {
                    "label": "duration",
                    "unit": "h",
                    "chartType": "bar",
                    "smoothSettings": "curveBasis",
                    "stacked": false,
                    "cumulative": false,
                    "tooltipType": "icon",
                    "minValue": 0,
                    "legend": true,
                    "visible": true,
                    "avgValueLine": false,
                    "scaleVisible": true,
                    "calculateTotals": "",
                    "lineColor": "#607D8B", // deep-orange-300
                    "lineStyle": "solid",
                    "lineWidth": 0,
                    "fillType": "gradient",
                    "fillColor": "#CFD8DC", // deep-orange-200
                    "gradient": [{
                        "offset": "0%",
                        "color": "#CFD8DC", // deep-orange-50
                        "opacity": 0.2,
                    }, {
                        "offset": "100%",
                        "color": "#607D8B", // deep-orange-300
                        "opacity": 0.6,
                    }],
                    "markerColor": "#455A64", // deep-orange-300
                    "idx": 1,
                    "measureSource": "activity.actual.measure",
                    "measureName": "duration",
                    "dataType": "number",
                    "dateFormat": "",
                    "valueType": "value",
                    "aggMethod": "sum",
                },
                {
                    "label": "percentComplete",
                    "unit": "",
                    "chartType": "area",
                    "smoothSettings": "curveStep",
                    "stacked": false,
                    "cumulative": false,
                    "tooltipType": "icon",
                    "minValue": 0,
                    "legend": true,
                    "visible": true,
                    "avgValueLine": true,
                    "scaleVisible": true,
                    "calculateTotals": "",
                    "lineColor": "#FF5722", // blue-grey-500
                    "lineStyle": "solid",
                    "lineWidth": 3,
                    "fillType": "gradient",
                    "fillColor": "#FF5722",
                    "gradient": [{
                        "offset": "0%",
                        "color": "#D1C4E9", //   blue-grey-100
                        "opacity": 0.0,
                    }, {
                        "offset": "100%",
                        "color": "#FF5722", //  blue-grey-500
                        "opacity": 0.1,
                    }],
                    "markerColor": "#FF5722", //  blue-grey-500
                    "avgValueLineColor": "#FF5722", //  blue-grey-500
                    "avgValueLineStyle": "dashed",
                    "idx": 2,
                    "measureSource": "activity.plan.measure",
                    "measureName": "completePercent",
                    "dataType": "value",
                    "dateFormat": "",
                    "valueType": "value",
                    "aggMethod": "avg",
                },
            ],
        }],
    },
    /**
     18.Fitness, fatigue, form chart
     */
    /**{
        "order": 18,
        "active": false,
        "revision": 1,
        "auth": [],
        "icon": "insert_chart", // https://material.io/icons/ с фильтром chart
        "code": "fitnessFatigueForm",
        "descriptionParams": [

        ],
        "description": "fitnessFatigueForm.description",
        "globalParams": false,
        "settings": [

        ],
        "layout": new AnalyticsChartLayout(1, 1),
        "charts": [{
            "debugMode": false,  //параметр от Дениса
            "chartType": "pmc",  // параметр от Дениса
            "params": {
                "users": null, //[this.session.getUser().userId],
                "futDays": 0,  // сколько дней в будущем от сегодня брать
                "lastDays": 100, // за сколько дней в прошлом получить данные
            },
            "options": {
                "tooltip": {
                    "combined": true
                },
                "legend": {
                    "vertical-align": "bottom",
                    "horizontal-align": "center",
                    "type": "string"
                },
                "currentPositionLine": {
                    "enabled": true,
                    "radius": 4,
                    "color": "rgba(0,0,0,0.5)"
                }
            },
            "series": [{
                "label": "period",
                "unit": "",
                "xAxis": true,
                "tooltipType": "label",
                "tooltipLabel": "period",
                "legend": false,
                "currentPositionLine": true,
                "idx": 0,
                "measureSource": "activity.startDate",
                "measureName": "Days",
                "dataType": "date",
                "dateFormat": "DD.MM",
                "valueType": "value",
                "seriesDateTrunc": "day",
                "groupByIntervalLength": 1,
            }],
            "measures": [
                {
                    "id": 1,
                    "label" : "TL",
                    "unit" : "",
                    "chartType" : "dot",
                    "stacked" : null,
                    "cumulative": false,
                    "smoothSettings" : "",
                    "tooltipType" : "color",
                    "legend": true,
                    "visible" : true,
                    "avgValueLine": false,
                    "scaleVisible": true,
                    "calculateTotals": "",
                    "lineColor": "#990000",
                    "lineStyle": "",
                    "fillType": "",
                    "fillColor": "rgba(255, 0, 0, 0.2)",
                    "markerColor": "#990000",
                    "avgValueLineColor": "",
                    "avgValueLineStyle": "",
                    "idx" : 1,
                    "measureName" : "trainingLoad",
                    "dataType": "number",
                    "dateFormat": ""
                },

                {
                    "id": 2,
                    "label" : "Fatigue",
                    "unit" : "",
                    "chartType" : "line",
                    "stacked" : null,
                    "cumulative": false,
                    "smoothSettings" : "curveMonotoneX",
                    "tooltipType" : "color",
                    "legend": true,
                    "visible" : true,
                    "avgValueLine": false,
                    "scaleVisible": true,
                    "calculateTotals": "",
                    "lineColor": "#ff3399",
                    "lineStyle": "solid",
                    "fillType": "none",
                    "fillColor": "",
                    "markerColor": "#ff3399",
                    "avgValueLineColor": "",
                    "avgValueLineStyle": "",
                    "idx" : 2,
                    "measureName" : "fatigue",
                    "dataType": "number",
                    "dateFormat": ""
                },

                {
                    "id": 3,
                    "label" : "Fitness",
                    "unit" : "",
                    "chartType" : "area",
                    "stacked" : null,
                    "cumulative": false,
                    "smoothSettings" : "curveCatmullRom",
                    "tooltipType" : "color",
                    "legend": true,
                    "visible" : true,
                    "avgValueLine": false,
                    "scaleVisible": true,
                    "calculateTotals": "",
                    "lineColor": "#0066cc",
                    "lineStyle": "solid",
                    "fillType": "gradient",
                    "fillColor": "",
                    "gradient": [
                        { "offset": "0%", "color": "rgba(0, 102, 204, 0)" },
                        { "offset": "100%", "color": "rgba(0, 202, 204, 0.5)" }],
                    "markerColor": "#0066cc",
                    "avgValueLineColor": "",
                    "avgValueLineStyle": "",
                    "idx" : 3,
                    "measureName" : "fitness",
                    "dataType": "number",
                    "dateFormat": ""
                },

                {
                    "id": 4,
                    "label" : "Form",
                    "unit" : "",
                    "chartType" : "area",
                    "stacked" : null,
                    "cumulative": false,
                    "smoothSettings" : "curveCatmullRom",
                    "tooltipType" : "color",
                    "legend": true,
                    "visible" : true,
                    "avgValueLine": false,
                    "scaleVisible": true,
                    "calculateTotals": "",
                    "lineColor": {"color": "rgb(247, 153, 131)", "opacity": 0},
                    "lineStyle": "solid",
                    "fillType": "gradient",
                    "fillColor": "",
                    "gradient": [
                        { "offset": "0%", "color": "rgba(247, 153, 131, 0)" },
                        { "offset": "100%", "color": "rgba(175, 191, 255, 0.5)" }],
                    "markerColor": "#449999",
                    "avgValueLineColor": "#4499BB",
                    "avgValueLineStyle": "dotted",
                    "idx" : 4,
                    "measureName" : "Form",
                    "dataType": "number",
                    "dateFormat": "",
                    "measureSource" : "..tbd...",
                    "valueType" : "value",
                    "aggMethod" : "avg"
                },
                {
                    "id": 5,
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
                    "idx": 5,
                    "measureName": "intensityLevel",
                    "dataType": "number",
                    "dateFormat": ""

                }
            ],
        }],
    },**/
];
