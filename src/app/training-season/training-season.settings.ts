import { IChart } from "../../../api/statistics/statistics.interface";
export interface ITrainingSeasonSettings {
    durationMeasures: Array<string>;
    chartTemplate: IChart;
}

export const trainingSeasonSettings: ITrainingSeasonSettings = {
    durationMeasures: ['trainingLoad','distance','movingDuration'],
    chartTemplate: {
        options: {
            tooltip: {
                combined: true
            },
            legend: {
                //"vertical-align": "top",
                //"horizontal-align": "right"
            },
            currentPositionLine: {
                enabled: true,
                radius: 4,
                color: "rgba(0,0,0,0.5)"
            }
        },
        series : [{
            label: "Дни",
            unit: "",
            xAxis: true,
            tooltipType: "label",
            tooltipLabel: "Неделя",
            legend: false,
            currentPositionLine: true,
            idx: 0,
            dataType: "date",
            dateFormat: "DD.MM"
        },{
            label: "Мезоцикл",
            unit: "",
            xAxis: true,
            tooltipType: "none",
            tooltipLabel: "План",
            legend: false,
            currentPositionLine: true,
            idx: 1,
            dataType: "string"
        }],
        measures : [{
            id: "1",
            label: "Plan",
            chartType: "bar",
            stacked: true,
            colorPalette: true,
            tooltipType: "label",
            tooltipLabel: "План",
            legend: false,
            lineColor: "#607D8B", // deep-orange-300
            lineStyle: "solid",
            lineWidth: 0,
            fillType: "solid",
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
            minValue: 0,
            idx: 2,
            measureName: "microcycle",
            scaleVisible: false
        }, {
            id: "2",
            label: "Fact",
            chartType: "area",
            stacked: null,
            smoothSettings: "curveStep",
            tooltipType: "label",
            tooltipLabel: "Факт",
            legend: false,
            visible: true,
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
                opacity: 0.1
            }],
            markerColor: "#FF5722", //  blue-grey-500
            scaleVisible: false,
            minValue: 0,
            idx: 3,
            measureName: "microcycle"
        }],
        metrics : null
    }
};