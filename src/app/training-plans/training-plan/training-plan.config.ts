import { IChart } from "../../../../api/statistics/statistics.interface";
import { supportLng } from "../../core/display.constants";
const paletteSports = ["#2196F3", "#FFC107", "#009688", "#F44336", "#9C27B0", "#795548", "#E91E63", "#9E9E9E"];

export interface TrainingPlanConfig {
    lang: string[];
    types: string[];
    distanceTypes: {
        [type: string]: Array<string>;
    };
    options: Array<string>;
    tags: Array<string>;
    weekRanges: Array<Array<number>>;
    hourRanges: Array<Array<number>>;
    defaultSettings: {
        type: string,
        distanceType: string,
        tags: string[]
    };
    metricsByDurationChart: IChart;
    metricsByDistanceChart: IChart;
}

export const trainingPlanConfig: TrainingPlanConfig = {
    lang: ['en', 'fr', 'es', 'ru', 'de'],
    types: ['triathlon', 'run', 'bike', 'swim', 'other'],
    distanceTypes: {
        triathlon: ['olympic', 'fullDistance', 'halfDistance', 'sprint', 'superSprint', 'other'],
        run: ['marathon', 'halfMarathon', '10km', '5km', 'other'],
        bike: ['multiDays'],
        swim: ['10km', 'other']
    },
    options: ['hasOfflineTraining', 'hasConsultations', 'isStructured'],
    tags: ['beginner', 'advanced', 'pro', 'powerMeter', 'hrBelt', 'weightLoss', 'fitness', 'health'],
    weekRanges: [
        [null,null],
        [1,8],
        [9,12],
        [13,18],
        [19, null]
    ],
    hourRanges: [
        [1,4],
        [5,9],
        [10,11],
        [12, null]
    ],
    defaultSettings: {
        type: 'triathlon',
        distanceType: null,
        tags: []
    },
    metricsByDurationChart: {
        options: {
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
        series : [{
            "label" : "Week",
            "unit" : "",
            "xAxis" : true,
            "tooltipType" : "label",
            "tooltipLabel" : "Week",
            "legend": false,
            "currentPositionLine": false,
            "idx" : 0,
            "measureSource" : "activity.startDate",
            "measureName" : "Weeks",
            "dataType": "string",
            "dateFormat": "DD.MM",
            "valueType" : "value",
            "seriesDateTrunc" : "week",
            "groupByIntervalLength" : 1,
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
                "measureName" : "activityType",
                "dataType": "string",
                "dateFormat": "",
                "valueType" : "value",
                "seriesDateTrunc" : "",
                "groupByIntervalLength" : 1	 },

        ],
        measures : [{
            "label" : "Время",
            "unit" : "ч",
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
            "measureName" : "duration",
            "dataType": "number",
            "dateFormat": "",
            "valueType" : "value",
            "aggMethod" : "sum",

        }]
    },
    metricsByDistanceChart: {
        options: {
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
        series : [{
            "label" : "Week",
            "unit" : "",
            "xAxis" : true,
            "tooltipType" : "label",
            "tooltipLabel" : "Week",
            "legend": false,
            "currentPositionLine": false,
            "idx" : 0,
            "measureSource" : "activity.startDate",
            "measureName" : "Weeks",
            "dataType": "string",
            "dateFormat": "DD.MM",
            "valueType" : "value",
            "seriesDateTrunc" : "week",
            "groupByIntervalLength" : 1,
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
                "measureName" : "activityType",
                "dataType": "string",
                "dateFormat": "",
                "valueType" : "value",
                "seriesDateTrunc" : "",
                "groupByIntervalLength" : 1	 },

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
            "aggMethod" : "sum",

        }]
    }
};