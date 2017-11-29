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

export interface IGridSettings {
    color: string;
    width: number;
}

export interface IFilledShape {
    fillType: FillType;
    gradient?: IGradientPoint[];
    solidColor?: string;
}

export interface IGridSettings {
    color: string;
    width: number;
    distance: IAxisLabel;
    movingDuration: IAxisLabel;
    ftp: IAxisLabel;
}

export interface IAxisLabel {
    color: string;
    offset: number;
    tickMinStep: number;
    tickMinDistance: number;
    ticksPerLabel: number;
    fistLabelAtTick: number;
}

export interface IPlanArea {
    area: IFilledShape;
    keySegment: IFilledShape;
}

export interface IIntervalArea {
    area: IFilledShape;
    border: IFilledShape;
    borderWidth: number;
}

export interface IScaleOffset {
    min: number;
    max: number;
}

export interface IPlanChartSettings
{
    minWidth: number;
    minAspectRation: number;
    autoResizable: boolean;
    rangeScaleOffset: IScaleOffset;
    planArea: IPlanArea;
    selectArea: IIntervalArea;
    hoverArea: IIntervalArea;
    grid: IGridSettings;
}