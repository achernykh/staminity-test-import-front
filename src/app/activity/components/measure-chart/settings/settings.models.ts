﻿export enum ActivityChartMode {
    elapsedDuration,
    duration,
    movingDuration,
    distance,
}

// Uses to specify chart's area fill mode
export enum FillType {
    None,
    Solid,
    Gradient,
}

export interface IGradientPoint {
    offset: string;
    color: string;
    opacity: number;
}

export interface IAreaSettings {
    heightRatio: number;
    fillType: FillType;
    gradient?: IGradientPoint[];
    solidColor?: string;
    lineColor?: string;
    lineWidth?: number;
}

export interface ISelectIntervalArea {
    area: IAreaSettings;
    borderArea: IAreaSettings;
}

// Tooltip marker settings of an activity measure
export interface IMarkerSettings {
    color: string;
    radius: number;
}

export interface IGridSettings {
    color: string;
    width: number;
}

export interface IAxisLabel {
    // label's text color
    color: string;
    // min tick step in the metric units
    tickMinStep: any;
    // min distance between ticks in pixels
    tickMinDistance: number;
    // how often does the label should be shown?
    ticksPerLabel: number;
    // what min chart width should be achived to show this axis?
    hideOnWidth: number;
    //
    multiplex?: any;
}

export interface IMetricArea {
    // order uses to determine the sequence of
    // the range axis (left-to-right) and the chart areas (top-to-bottom) as well
    order: number;
    flippedChart: boolean;
    zoomOffset: number;
    area: IAreaSettings;
    marker: IMarkerSettings;
    axis: IAxisLabel;
}

export interface IDomainMeasure {
    zoomOffset: number;
    axis: IAxisLabel;
}

export interface IAnimationSettigs {
    duration: number;
    zoomDuration: number;
    delayByOrder: number;
    ease: (input: number) => number;
}

export interface IActivityChartSettings {
    // Min chart width.
    // if chart's container it is narrower than the value,
    // it size will be ignored
    minWidth: number;
    // Min value of  the chart height to  its width
    minAspectRation: number;
    labelOffset: number;
    tooltipOffset: number;
    // if true will resize on window resize according to
    // the new container size
    autoResizable: boolean;
    measuresLimit: number; // max of measures on chart
    measuresLimitMin: number;
    // chart anomation settings on load and data changes
    animation: IAnimationSettigs;
    selectAnimation: IAnimationSettigs;
    // default chart mode : distance or time
    defaultMode: ActivityChartMode;
    heartRate: IMetricArea;
    speed: IMetricArea;
    pace: IMetricArea;
    power: IMetricArea;
    altitude: IMetricArea;
    cadence: IMetricArea;
    strokes: IMetricArea;
    elapsedDuration: IDomainMeasure;
    movingDuration: IDomainMeasure;
    duration: IDomainMeasure;
    distance: IDomainMeasure;
    selectedArea: ISelectIntervalArea;
    grid: IGridSettings;
}
