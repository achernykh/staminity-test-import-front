import {IInputPlanSegment } from './segmentsChart.input';

const posOrder = (a:IInputPlanSegment,b:IInputPlanSegment) => a.pos < b.pos ? -1: 1;

export enum IntervalStatus {
    unknown,
    success,
    warn,
    failed
}

export interface IInterval {
    start: number;
    duration: number;
}

export interface ISegmentMeasures {
    movingDuration: IInterval;
    distance: IInterval;
    intensityByFtp: number;
}

export interface IPlanInterval {
    originId: number;
    isKey: boolean;
    isSelected: boolean;
    status: IntervalStatus;
    intensityMeasure: string;
    durationMeasure: string;
    plan: ISegmentMeasures;
    fact?: ISegmentMeasures;
}

export class PlanChartDatamodel {

    private static SUCCESS = 5;
    private static WARN = 25;
    private static DEFAULT_MEASURE = 'heartRate';

    private intervals: Array<IPlanInterval>;

    constructor(activityHeader: Array<IInputPlanSegment>) {
        this.intervals = [];
        let currentPlanDistance = 0;
        let currentPlanTime = 0;
        let currentFactDistance = 0;
        let currentFactTime = 0;

        activityHeader = activityHeader.filter(i => i.type === 'P');
        activityHeader.sort(posOrder);
        console.log('header sort', activityHeader.map(i => i.pos));

        for (var i = 0; i < activityHeader.length; i++) {
            let segment = activityHeader[i];
            let intensityMeasure = segment.intensityMeasure || PlanChartDatamodel.DEFAULT_MEASURE;
            if (segment.type !== "P") {
                continue;
            }
            let plan = {
                movingDuration: {
                    start: currentPlanTime,
                    duration: segment.movingDurationLength,
                },
                distance: {
                    start: currentPlanDistance,
                    duration: segment.distanceLength
                },
                intensityByFtp: this.getIntervalPlanFTP(segment),
            };
            let fact = null;
            if (!!segment.calcMeasures) {
                fact = {
                        movingDuration: {
                            start: currentFactTime,
                            duration: segment.calcMeasures.movingDuration.value,
                        },
                        distance: {
                            start: currentFactDistance,
                            duration: segment.calcMeasures.distance.value
                        },
                        intensityByFtp: segment.calcMeasures[intensityMeasure].intensityByFtp * 100,
                };
                currentFactDistance = currentFactDistance + segment.calcMeasures.distance.value;
                currentFactTime = currentFactTime + segment.calcMeasures.movingDuration.value;
            }
            this.intervals.push({
                originId: i,
                isKey: segment.keyInterval,
                isSelected: segment.isSelected,
                status: this.getStatus(segment),
                intensityMeasure: intensityMeasure,
                durationMeasure: segment.durationMeasure,
                plan: plan,
                fact: fact
            });
            currentPlanTime = currentPlanTime + segment.movingDurationLength;
            currentPlanDistance = currentPlanDistance + segment.distanceLength;
        }
    };

    public getIntervals(): Array<IPlanInterval> {
        return this.intervals || [];
    }

    public getSelect(): Array<number> {
        let select: Array<number> = [];
        this.intervals.forEach((interval,i) => interval.isSelected && select.push(i));
        return select || [];
    }

    private getIntervalPlanFTP(segment: IInputPlanSegment): number {
        return (segment.intensityByFtpFrom + segment.intensityByFtpTo) * 50;
    }

    private getStatus(segment: IInputPlanSegment): IntervalStatus {
        if (!segment.calcMeasures ||
            !segment.calcMeasures.completePercent ||
            !segment.calcMeasures.completePercent ||
            !segment.durationValue) {
            return IntervalStatus.unknown;
        }
        let delta = Math.abs(100 - segment.calcMeasures.completePercent.value * 100);
        if (delta <= PlanChartDatamodel.SUCCESS) {
            return IntervalStatus.success;
        } 
        if (delta <= PlanChartDatamodel.WARN) {
            return IntervalStatus.warn;
        }
        return IntervalStatus.failed;
    }
}