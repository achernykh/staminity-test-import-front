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
    elapsedDuration: T;
}

export interface ITimestampInterval {
    startTimestamp: number;
    endTimestamp: number;
}

export class ActivityChartDatamodel implements IComponentController {

    private measures: IActivityMetrics<IMeasureInfo>;
    private data: Array<IActivityMetrics<number>>;
    private selectIntervals: ITimestampInterval[];

    constructor(measures, private originalData: Array<IActivityMetrics<number>>, x, select = [], public smooth) {
        this.measures = measures;
        //this.data = data;
        this.data = [];
        this.smooth = originalData.length &&
            originalData[originalData.length - 1].elapsedDuration <= 30 * 60 ? 1 :
            Math.ceil(smooth / Math.sqrt(60*60/originalData[originalData.length - 1].elapsedDuration)) || smooth;
        originalData.map((d,i) => i % this.smooth === 0 && this.data.push(d));
        this.selectIntervals = select || [];
    };

    getData(ind: number = null): Array<IActivityMetrics<number>> | any {
        return ind ? this.data[ind] : this.data;
    };

    getSelect(): ITimestampInterval[] {
        return this.selectIntervals;
    };

    setSelect(intervals): void {
        this.selectIntervals = !intervals ? [] : intervals;
    };

    getMeasures(): IActivityMetrics<IMeasureInfo> {
        return this.measures;
    }

    getBaseMetrics(except: string[] = []): string[] {
        const baseMetrics = ["timestamp", "distance", "elapsedDuration", "duration"];
        return Object.keys(this.measures).filter((m) => baseMetrics.indexOf(m) > -1 && except.indexOf(m) === -1);
    }

    supportedMetrics(): string[] {
        const except = ["timestamp", "distance", "elapsedDuration", "duration"];
        return Object.keys(this.measures).filter((m) => except.indexOf(m) === -1);
    }

    private getPace(speed: number) {
        return 1000.0 / Math.max(speed, 1); //sec/km
    }
}
