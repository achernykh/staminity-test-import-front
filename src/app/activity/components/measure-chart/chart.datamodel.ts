import { IComponentController } from 'angular';

enum ChartMode {
    Duration,
    Distance
}

interface IMeasureInfo {
    idx: number;
    show: number;
}

interface IActivityMetrics<T> {
    duration: T;
    distance: T;
    speed: T;
    heartRate: T;
    altitude: T; 
}

export interface ITimestampInterval {
    startTimestamp: number;
    endTimestamp: number;
}

export class ActivityChartDatamodel implements IComponentController {

    private measures: IActivityMetrics<IMeasureInfo>;
    private data: Array<IActivityMetrics<number>>;
    private selectIntervals: Array<ITimestampInterval>;

    constructor(measures, data, x, select = []) {
        this.measures = measures;
        this.data = data;
        this.selectIntervals = select || [];
    };

    public getData(): Array<IActivityMetrics<number>> {
        return this.data;
    };

    public getSelect(): Array<ITimestampInterval> {
        return this.selectIntervals;
    };

    public setSelect(intervals): void {
        this.selectIntervals = intervals;
    };

    public getMeasures(): IActivityMetrics<IMeasureInfo> {
        return this.measures;
    }

    public getBaseMetrics(except: Array<string> = []): Array<string> {
        let baseMetrics = ['timestamp','distance','elapsedDuration'];
        return Object.keys(this.measures).filter(m => baseMetrics.indexOf(m) > -1);
    }

    public supportedMetrics(): Array<string> {
        let except = ['timestamp','distance','elapsedDuration'];
        return Object.keys(this.measures).filter(m => except.indexOf(m) === -1);
    }

    private getPace(speed: number) {
        return 1000.0 / Math.max(speed, 1); //sec/km
    }
}