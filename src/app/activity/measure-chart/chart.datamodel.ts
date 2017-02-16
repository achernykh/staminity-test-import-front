import { IComponentController } from 'angular';

enum ChartMode {
    Duration,
    Distance
}

interface IMeasureInfo {
    index: number;
    show: number;
}

interface IActivityMetrics<T> {
    duration: T;
    distance: T;
    speed: T;
    heartRate: T;
    altitude: T; 
}

export interface ITimeInterval {
    startTime: number;
    duration: number;
}

export class ActivityChartDatamodel implements IComponentController {

    private currentMode: ChartMode;
    private measures: IActivityMetrics<IMeasureInfo>;
    private data: Array<IActivityMetrics<number>>;
    private selectIntervals: Array<ITimeInterval>;

    constructor(measures, data, select = []) {
        this.currentMode = ChartMode.Distance;
        this.measures = {
            duration: { index: measures['sumDuration'].idx, show: true || measures['sumDuration'].show },
            distance: { index: measures['distance'].idx, show: true || measures['distance'].show },
            speed: { index: measures['speed'].idx, show: true ||measures['speed'].show },
            heartRate: { index: measures['heartRate'].idx, show: true ||measures['heartRate'].show },
            altitude: { index: measures['altitude'].idx, show: true || measures['altitude'].show },
        };
        this.data = [];
        for (let i = 0; i < data.length; i++) {
            let info = data[i];
            let cleaned = {
                duration: info[this.measures.duration.index],
                distance: info[this.measures.distance.index],
                speed: this.getPace(info[this.measures.speed.index]),
                heartRate: info[this.measures.heartRate.index],
                altitude: info[this.measures.altitude.index],
            };
            this.data.push(cleaned);
        }
        this.selectIntervals = [];
        let initTimestamp = data[0][measures['timestamp'].idx];
        // convert timestamp intervals to the time intervals (in seconds) from the beginig of the workout
        for (let i = 0; i < select.length; i++) {
            let interval = select[i];
            this.selectIntervals.push({
                startTime: (interval.startTimeStamp - initTimestamp) / 1000,
                duration: (interval.endTimeStamp - interval.startTimeStamp) / 1000
            });
        }
    };

    public getData(): Array<IActivityMetrics<number>> {
        return this.data;
    };

    public getSelect(): Array<ITimeInterval> {
        return this.selectIntervals;
    };

    public getMeasures(): IActivityMetrics<IMeasureInfo> {
        return this.measures;
    }

    private getPace(speed: number) {
        return 1000.0 / Math.max(speed, 1); //sec/km
    }
}