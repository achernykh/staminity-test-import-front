import * as d3 from "d3";
import { ActivityChartMode, FillType, IActivityChartSettings } from "./settings.models";

const DefaultChartSettings: IActivityChartSettings = {
    minWidth: 320,
    minAspectRation: 0.40,
    labelOffset: 40,
    tooltipOffset: 30,
    autoResizable: true,
    measuresLimit: 10,
    measuresLimitMin: 2,
    defaultMode: ActivityChartMode.elapsedDuration,
    animation: {
        duration: 100,
        zoomDuration: 100,
        delayByOrder: 100,
        ease: d3.easeExp,
    },
    selectAnimation: {
        duration: 100,
        zoomDuration: 100,
        delayByOrder: 100,
        ease: d3.easeExp,
    },
    //xMeasures: [''],
    heartRate: {
        order: 23,
        flippedChart: false,
        zoomOffset: 5,
        area: {
            heightRatio: 1,
            fillType: FillType.Gradient,
            gradient: [
                { offset: "0%", color: "#F06292", opacity: 0.4 },
                { offset: "100%", color: "#FCE4EC", opacity: 0.1 },
            ],
            lineColor: "#F06292",
            lineWidth: 2,
        },
        marker: {
            color: "#c2185b",
            radius: 4,
        },
        axis: {
            color: "#e91e63",
            tickMinStep: 5,
            tickMinDistance: 10,
            ticksPerLabel: 2,
            hideOnWidth: 0,
        },
    },
    cadence: {
        order: 4,
        flippedChart: false,
        zoomOffset: 5,
        area: {
            heightRatio: 1,
            fillType: FillType.Gradient,
            gradient: [
                { offset: "0%", color: "#FFB74D", opacity: 0 },
                { offset: "100%", color: "#FFE0B2", opacity: 0 },
            ],
            lineColor: "#FFB74D",
            lineWidth: 2,
        },
        marker: {
            color: "#FF9800",
            radius: 4,
        },
        axis: {
            color: "#FFB74D",
            tickMinStep: 5,
            tickMinDistance: 10,
            ticksPerLabel: 2,
            hideOnWidth: 0,
        },
    },
    strokes: {
        order: 2,
        flippedChart: false,
        zoomOffset: 5,
        area: {
            heightRatio: 1,
            fillType: FillType.Gradient,
            gradient: [
                { offset: "0%", color: "#FFB74D", opacity: 0 },
                { offset: "100%", color: "#FFE0B2", opacity: 0 },
            ],
            lineColor: "#FFB74D",
            lineWidth: 2,
        },
        marker: {
            color: "#FF9800",
            radius: 4,
        },
        axis: {
            color: "#FFB74D",
            tickMinStep: 1,
            tickMinDistance: 10,
            ticksPerLabel: 2,
            hideOnWidth: 0,
        },
    },
    speed: {
        order: 24,
        flippedChart: false,
        zoomOffset: 0.2,
        area: {
            heightRatio: 1,
            fillType: FillType.Gradient,
            gradient: [
                { offset: "0%", color: "#64B5F6", opacity: 0.4 },
                { offset: "100%", color: "#BBDEFB", opacity: 0.1 },
            ],
            lineColor: "#64B5F6",
            lineWidth: 2,
        },
        marker: {
            color: "#4e6cef",
            radius: 4,
        },
        axis: {
            color: "#5677fc",
            tickMinStep: 5, //30,
            tickMinDistance: 50,
            ticksPerLabel: 1,
            hideOnWidth: 0,
        },
    },
    pace: {
        order: 24,
        flippedChart: false,
        zoomOffset: 0,
        area: {
            heightRatio: 1,
            fillType: FillType.Gradient,
            gradient: [
                { offset: "0%", color: "#64B5F6", opacity: 0.4 },
                { offset: "100%", color: "#BBDEFB", opacity: 0.1 },
            ],
            lineColor: "#64B5F6",
            lineWidth: 2,
        },
        marker: {
            color: "#4e6cef",
            radius: 4,
        },
        axis: {
            color: "#5677fc",
            tickMinStep: (sport) => sport === 'swim' ? 0.005 : 0.03, // 00:30 min/km
            tickMinDistance: 30,
            ticksPerLabel: 1,
            hideOnWidth: 0,
            multiplex: (x, sport) => sport === 'swim' ?
                1000 / ((Math.ceil(1000 / (x * 10) / 60 / 0.08333) * 0.08333) * 10) / 60 :
                1000 / (Math.ceil(1000 / x / 60 / 0.5) * 0.5) / 60,
            //multiplex: (x) => 1000 / (Math.ceil(1000 / x / 60 / 0.5) * 0.5) / 60
        },
    },
    power: {
        order: 25,
        flippedChart: false,
        zoomOffset: 0,
        area: {
            heightRatio: 1,
            fillType: FillType.Gradient,
            gradient: [
                { offset: "0%", color: "#BA68C8", opacity: 0.4 },
                { offset: "100%", color: "#F3E5F5", opacity: 0.1 },
            ],
            lineColor: "#BA68C8",
            lineWidth: 2,
        },
        marker: {
            color: "#9C27B0",
            radius: 4,
        },
        axis: {
            color: "#9C27B0",
            tickMinStep: 25,
            tickMinDistance: 10,
            ticksPerLabel: 2,
            hideOnWidth: 0,
        },
    },
    altitude: {
        order: 6,
        flippedChart: false,
        zoomOffset: 0,
        area: {
            heightRatio: 1,
            fillType: FillType.Gradient,
            gradient: [
                { offset: "0%", color: "#BDBDBD", opacity: 0.4 },
                { offset: "100%", color: "#F5F5F5", opacity: 0.1 },
            ],
            lineColor: "#BDBDBD",
            lineWidth: 2,
        },
        marker: {
            color: "#757575",
            radius: 4,
        },
        axis: {
            color: "#8d8d8d",
            tickMinStep: 1,
            tickMinDistance: 10,
            ticksPerLabel: 2,
            hideOnWidth: 0,
        },
    },
    duration: {
        zoomOffset: 30,
        axis: {
            color: "#8d8d8d",
            tickMinStep: 300,
            tickMinDistance: 50,
            ticksPerLabel: 3,
            hideOnWidth: 0,
        },
    },
    movingDuration: {
        zoomOffset: 30,
        axis: {
            color: "#8d8d8d",
            tickMinStep: 300,
            tickMinDistance: 50,
            ticksPerLabel: 3,
            hideOnWidth: 0,
        },
    },
    elapsedDuration: {
        zoomOffset: 30,
        axis: {
            color: "#8d8d8d",
            tickMinStep: 60,
            tickMinDistance: 50,
            ticksPerLabel: 2,
            hideOnWidth: 0,
        },
    },
    distance: {
        zoomOffset: 100,
        axis: {
            color: "#8d8d8d",
            tickMinStep: 500,
            tickMinDistance: 50,
            ticksPerLabel: 2,
            hideOnWidth: 0,
        },
    },
    selectedArea: {
        area: {
            heightRatio: 1,
            fillType: FillType.Gradient,
            gradient: [
                { offset: "0%", color: "rgba(0, 0, 0, 0)", opacity: 0 },
                { offset: "100%", color: "rgba(0, 0, 0, 0.48)", opacity: 0.48 },
            ],
        },
        borderArea: {
            heightRatio: 1,
            fillType: FillType.Gradient,
            gradient: [
                { offset: "0%", color: "rgba(0, 0, 0, 0)", opacity: 0 },
                { offset: "100%", color: "#455a64", opacity: 1 },
            ],
        },
    },
    grid: {
        color: "rgba(0, 0, 0, 0.12)",
        width: 2,
    },
};

export default DefaultChartSettings;
