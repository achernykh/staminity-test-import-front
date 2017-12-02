export enum IntervalStatus {
    SUCCESS,
    WARN,
    FAILED,
}

export interface ICalcMeasure {
    value: number;
    avgValue: number;
    intensityByFtp: number;
}

export interface IPlanMeasures {
    movingDuration: ICalcMeasure;
    distance: ICalcMeasure;
    heartRate: ICalcMeasure;
    speed: ICalcMeasure;
    completePercent: ICompletePercent;
}

interface ICompletePercent {
    value: number;
}

export interface IInputPlanSegment {
    type: string;
    pos: string;
    keyInterval: boolean;
    isSelected: boolean;
    movingDurationLength: number;
    distanceLength: number;
    actualDurationValue?: number;
    durationMeasure: string;
    intensityMeasure?: string;
    intensityByFtpFrom: number;
    intensityByFtpTo: number;
    calcMeasures?: IPlanMeasures;
    durationValue?: number;
}
