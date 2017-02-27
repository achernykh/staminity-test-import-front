import './activity-metrics-details.component.scss';
import {IComponentOptions, IComponentController, IPromise, copy} from 'angular';
import {CalendarItemActivityCtrl} from "../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import {Activity} from "../activity.datamodel";

class ActivityMetricsDetailsCtrl implements IComponentController {

    private item: CalendarItemActivityCtrl;
    public mode: string;
    public activity: Activity;
    private showMap: boolean = true;
    private showChart: boolean = true;
    private showTable: boolean = true;

    private measures: {} = {};
    private measuresItem: {} = {};
    private measuresX: Array<string> = ['distance', 'duration'];
    private measuresY: Array<string> = ['heartRate', 'speed', 'power'];
    private measuresSecondary: Array<string> = ['timestamp', 'altitude'];
    private maxValue: {};
    private data: Array<{}>;
    private chartX: string = 'duration';
    private change: number = 1;

    constructor(private $mdMedia: any) {
    }

    static $inject = ['$mdMedia'];

    $onInit() {
        let array: Array<string>;
        this.measuresItem = this.item.details.measures;
        this.maxValue = {};

        array = copy(this.measuresY);
        array.forEach(key => {
            if (!this.item.activity.intervalW.calcMeasures.hasOwnProperty(key)) {
                this.measuresY.splice(this.measuresY.indexOf(key), 1);
            } else {
                this.measures[key] = this.measuresItem[key];
                this.measures[key]['show'] = true;
                this.maxValue[key] = {
                    max: this.item.activity.intervalW.calcMeasures[key].maxValue,
                    min: this.item.activity.intervalW.calcMeasures[key].minValue
                };
            }
        });

        array = copy(this.measuresX);
        array.forEach(key => {
            if (this.item.activity[key] > 0) {
                this.measures[key] = this.measuresItem[key];
                this.measures[key]['show'] = true;
            } else {
                this.measuresX.splice(this.measuresX.indexOf(key), 1);
            }
        });

        this.measuresSecondary.forEach(key => {
            this.measures[key] = this.measuresItem[key];
            this.measures[key]['show'] = false;
        });

        this.data = [];
        this.item.details.metrics.forEach(info => {
            let cleaned = {};
            for (let key in this.measures) {
                cleaned[key] = key === 'speed' ? 1000.0 / Math.max(info[this.measures[key]['idx']], 1) : info[this.measures[key]['idx']];
            }
            this.data.push(cleaned);
        });
    }

    toggleMap() {
        return this.showMap = !this.showMap;
    }

    toggleChart() {
        return this.showChart = !this.showChart;
    }

    toggleTable() {
        return this.showTable = !this.showTable;
    }

    changeChartX(measure) {
        this.chartX = measure;
        this.change++;
    }

    changeChartMetrics(measure) {
        this.measures[measure]['show'] = !this.measures[measure]['show'];
        this.change++;
    }
}

const ActivityMetricsDetailsComponent: IComponentOptions = {
    require: {
        item: '^calendarItemActivity'
    },
    controller: ActivityMetricsDetailsCtrl,
    template: require('./activity-metrics-details.component.html') as string
};

export default ActivityMetricsDetailsComponent;
