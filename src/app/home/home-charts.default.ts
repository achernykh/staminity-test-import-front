import {AnalyticsChartLayout} from "../analytics/analytics-chart/analytics-chart.model";

export const homeChartsConfig: any[] = [
    {
        id: 4,
        order: 4,
        active: true,
        revision: 1,
        auth: [],
        icon: "insert_chart", // https://material.io/icons/ с фильтром chart
        code: "actualDistance",
        descriptionParams: [{
            ind: 0,
            idx: 1,
            area: "measures",
            param: "cumulative",
        }, {
            ind: 0,
            idx: 0,
            area: "series",
            param: "seriesDateTrunc",
        }],
        description: "actualDistance.description",
        globalParams: false,
        localParams: {
            users: {
                type: "checkbox",
                area: "params",
                name: "users",
                text: "users",
                model: "me",
                options: [],
            },
            activityTypes: {
                type: "checkbox",
                area: "params",
                name: "activityTypes",
                text: "activityTypes",
                model: [2],
            },
            activityCategories: {
                type: "checkbox",
                area: "params",
                name: "activityCategories",
                text: "activityCategories",
                model: [],
            },
            periods: {
                type: "date",
                area: "params",
                name: "periods",
                text: "periods",
                model: "last12months",
                options: [
                    "thisYear",
                    "thisMonth",
                    "thisWeek",
                    "customPeriod",
                ],
            }
        },
        settings: [
            {
                ind: [0],
                idx: [0],
                type: "radio",
                area: "series",
                name: "seriesDateTrunc",
                text: "seriesDateTrunc",
                model: "month",
                options: ["day", "week", "month"],
                change: {
                    "day": {
                        seriesDateTrunc: "day",
                    },
                    "week": {
                        seriesDateTrunc: "week",
                    },
                    "month": {
                        seriesDateTrunc: "month",
                    },
                },
            },
            {
                ind: [0],
                idx: [1],
                type: "radio",
                area: "measures",
                name: "cumulative",
                text: "cumulative",
                model: true,
                options: [false, true],
                change: {
                    "false": {
                        cumulative: false,
                        chartType: "bar",
                        fillType: "gradient",
                        lineWidth: 0,
                        avgValueLine: true,
                    },
                    "true": {
                        cumulative: true,
                        chartType: "area",
                        fillType: "gradient",
                        lineWidth: 3,
                        avgValueLine: false,
                    },
                },
            },
        ],
        layout: new AnalyticsChartLayout(1, 1),
        charts: [{
            params: {
                users: null, //[this.session.getUser().userId],
                activityTypes: null, //[2],
                periods: null,
            },
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
                "colorPalette": false,
            },
            series: [{
                label: "Период",
                unit: "",
                xAxis: true,
                tooltipType: "label",
                tooltipLabel: "Период",
                legend: false,
                currentPositionLine: true,
                idx: 0,
                measureSource: "activity.startDate",
                seriesDateTrunc: "month",
                measureName: "Months",
                dataType: "date",
                dateFormat: "MM",
                valueType: "value",
                groupByIntervalLength: 1,
            }],
            measures: [{
                label: "Расстояние",
                unit: "км",
                chartType: "area",
                smoothSettings: 'curveBasis',//"curveCardinal",
                stacked: false,
                cumulative: false,
                tooltipType: "icon",
                minValue: 0,
                legend: false,
                visible: true,
                avgValueLine: false,
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
                    opacity: 0.2,
                }, {
                    offset: "100%",
                    color: "#607D8B", // deep-orange-300
                    opacity: 0.6,
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
                aggMethod: "sum",
            },],
        }],
    },
];