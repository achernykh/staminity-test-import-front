import { FillType, IActivityChartSettings, ActivityChartMode } from './settings.models';

const DefaultChartSettings: IActivityChartSettings = {
    minWidth: 350,
    minAspectRation: 0.25,
    labelOffset: 40,
    autoResizable: true,
    defaultMode: ActivityChartMode.duration,
    //xMeasures: [''],
    heartRate: {
        order: 1,
        flippedChart: false,
        area: {
            heightRatio: 1,
            fillType: FillType.Gradient,
            gradient: [
                { offset: "0%", color: "#e91e63" },
                { offset: "100%", color: "rgba(247, 153, 131, 0)" }
            ]
        },
        marker: {
            color: '#c2185b',
            radius: 4
        },
        axis: {
            color: '#e91e63',
            tickMinStep: 5,
            tickMinDistance: 10,
            ticksPerLabel: 2,
            hideOnWidth: 0
        }
    },
    speed: {
        order: 3,
        flippedChart: true,
        area: {
            heightRatio: 1,
            fillType: FillType.Gradient,
            gradient: [
                { offset: "0%", color: "#5677fc" },
                { offset: "100%", color: "rgba(175, 191, 255, 0)" }
            ]
        },
        marker: {
            color: '#4e6cef',
            radius: 4
        },
        axis: {
            color: '#5677fc',
            tickMinStep: 30,
            tickMinDistance: 50,
            ticksPerLabel: 1,
            hideOnWidth: 0
        }
    },
    altitude: {
        order: 2,
        flippedChart: false,
        area: {
            heightRatio: 0.35,
            fillType: FillType.Solid,
            solidColor: 'rgba(216, 216, 216, 0.5)'
        },
        marker: {
            color: '#757575',
            radius: 4
        },
        axis: {
            color: '#8d8d8d',
            tickMinStep: 5,
            tickMinDistance: 30,
            ticksPerLabel: 1,
            hideOnWidth: 3000
        }
    },
    duration: {
        axis: {
            color: '#8d8d8d',
            tickMinStep: 300,
            tickMinDistance: 50,
            ticksPerLabel: 3, 
            hideOnWidth: 0
        }
    },
    distance: {
        axis: {
            color: '#8d8d8d',
            tickMinStep: 500,
            tickMinDistance: 50,
            ticksPerLabel: 2,
            hideOnWidth: 0
        }
    },
    selectedArea: {
        area: {
            heightRatio: 1,
            fillType: FillType.Gradient,
            gradient: [
                { offset: "0%", color: "rgba(0, 0, 0, 0)" },
                { offset: "100%", color: "rgba(0, 0, 0, 0.48)" }
            ]
        },
        borderArea: {
            heightRatio: 1,
            fillType: FillType.Gradient,
            gradient: [
                { offset: "0%", color: "rgba(0, 0, 0, 0)" },
                { offset: "100%", color: "#455a64" }
            ]
        }
    },
    grid: {
        color: 'rgba(0, 0, 0, 0.12)',
        width: 2,
    }
};

export default DefaultChartSettings;