export enum ScaleType {
    X,
    Y
}

export interface IScaleInfo {
    type: ScaleType;
    min: number;
    max: number;
    scale: d3.ScaleLinear<number, number>;
}

export interface IActivityScales {
    elapsedDuration?: IScaleInfo;
    movingDuration?: IScaleInfo;
    duration?: IScaleInfo;
    distance: IScaleInfo;
    speed: IScaleInfo;
    heartRate: IScaleInfo;
    altitude: IScaleInfo;
}
