import { IComponentController } from "angular";

enum ChartMode {
    Duration,
    Distance,
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
    private selectIntervals: ITimestampInterval[];

    constructor(measures, data, x, select = []) {
        this.measures = measures;
        this.data = data;
        this.selectIntervals = select || [];
    };

    public getData(ind: number = null): Array<IActivityMetrics<number>> | any {
        return ind ? this.data[ind] : this.data;
    };

    public getSelect(): ITimestampInterval[] {
        return this.selectIntervals;
    };

    public setSelect(intervals): void {
        this.selectIntervals = !intervals ? [] : intervals;
    };

    public getMeasures(): IActivityMetrics<IMeasureInfo> {
        return this.measures;
    }

    public getBaseMetrics(except: string[] = []): string[] {
        const baseMetrics = ["timestamp", "distance", "elapsedDuration", "duration"];
        return Object.keys(this.measures).filter((m) => baseMetrics.indexOf(m) > -1 && except.indexOf(m) === -1);
    }

    public supportedMetrics(): string[] {
        const except = ["timestamp", "distance", "elapsedDuration", "duration"];
        return Object.keys(this.measures).filter((m) => except.indexOf(m) === -1);
    }

    private getPace(speed: number) {
        return 1000.0 / Math.max(speed, 1); //sec/km
    }
}
