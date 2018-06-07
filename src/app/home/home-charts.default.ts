import {IAnalyticsChart, AnalyticsChartLayout} from "../analytics/analytics-chart/analytics-chart.model";
export const homeChartsConfig: IAnalyticsChart[] = [
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
        revision: 1,
        auth: [],
        icon: "insert_chart", // https://material.io/icons/ с фильтром chart
        code: "actualDistance",
        context: [{
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
        globalParams: true,
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
                ticksMinDistance: 50,
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
                seriesDateTrunc: "month",
                measureName: "Months",
                dataType: "date",
                dateFormat: "DD.MM",
                valueType: "value",
                groupByIntervalLength: 1,
            }],
            measures : [{
                label: "Расстояние",
                unit: "км",
                chartType: "area",
                smoothSettings: "curveCardinal",
                stacked: false,
                cumulative: true,
                tooltipType: "icon",
                minValue: 0,
                legend: false,
                visible: true,
                avgValueLine: false,
                scaleVisible: true,
                calculateTotals: "",
                lineColor: "#AD1457", // deep-orange-300
                lineStyle: "solid",
                lineWidth: 1,
                fillType: "gradient",
                gradient: [{
                    offset: "0%",
                    color: "#6200EA", // deep-orange-50
                    opacity: 0.1,
                }, {
                    offset: "100%",
                    color: "#AD1457", // deep-orange-300
                    opacity: 0.8,
                }],
                markerColor: "#AD1457", // deep-orange-300
                avgValueLineColor: "#AD1457", //
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