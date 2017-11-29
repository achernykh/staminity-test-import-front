import { FillType, IPlanChartSettings } from "./settings.models";

const DefaultPlanChartSettings: IPlanChartSettings = {
    minWidth: 300,
    minAspectRation: 0.5,
    autoResizable: true,
    rangeScaleOffset: { min: 20, max: 10 },
    planArea: {
        area: {
            fillType: FillType.Gradient,
            gradient: [
                { offset: "0%", color: "#e0e0e0", opacity: 1 },
                { offset: "100%", color: "#ffffff", opacity: 1 },
            ],
        },
        keySegment: {
            fillType: FillType.Gradient,
            gradient: [
                { offset: "0%", color: "#dedede", opacity: 1 },
                { offset: "100%", color: "#efefef", opacity: 1 },
            ],
        },
    },
    selectArea: {
        area: {
            fillType: FillType.Gradient,
            gradient: [
                { offset: "0%", color: "rgba(0, 0, 0, 0)", opacity: 0 },
                { offset: "100%", color: "rgba(0, 0, 0, 0.48)", opacity: 0.48 },
            ],
        },
        border: {
            fillType: FillType.Gradient,
            gradient: [
                { offset: "0%", color: "rgba(0, 0, 0, 0)", opacity: 0 },
                { offset: "100%", color: "#455a64", opacity: 1 },
            ],
        },
        borderWidth: 2,
    },
    hoverArea: {
        area: {
            fillType: FillType.Gradient,
            gradient: [
                { offset: "0%", color: "rgba(0, 0, 150, 0)", opacity: 0 },
                { offset: "100%", color: "rgba(0, 0, 150, 0.48)", opacity: 0.48 },
            ],
        },
        border: {
            fillType: FillType.Gradient,
            gradient: [
                { offset: "0%", color: "rgba(0, 0, 0, 0)", opacity: 0 },
                { offset: "100%", color: "#455a64", opacity: 1 },
            ],
        },
        borderWidth: 2,
    },
    grid: {
        color: "rgba(0, 0, 0, 0.12)",
        width: 1,
        distance: {
            color: "rgba(0, 0, 0, 0.34)",
            offset: 30,
            tickMinStep: 250,
            tickMinDistance: 10,
            ticksPerLabel: 4,
            fistLabelAtTick: 1,
        },
        movingDuration: {
            color: "rgba(0, 0, 0, 0.34)",
            offset: 30,
            tickMinStep: 150,
            tickMinDistance: 10,
            ticksPerLabel: 4,
            fistLabelAtTick: 1,
        },
        ftp: {
            color: "rgba(0, 0, 0, 0.54)",
            offset: 30,
            tickMinStep: 5,
            tickMinDistance: 10,
            ticksPerLabel: 2,
            fistLabelAtTick: 0,
        },
    },
};

export default DefaultPlanChartSettings;