import './activity-metrics-details.component.scss';
import {IComponentOptions, IComponentController, IPromise, copy} from 'angular';
import {CalendarItemActivityCtrl} from "../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import {Activity} from "../activity.datamodel";
import {isPace, getSportLimit} from "../../share/measure/measure.constants";

class ActivityMetricsDetailsCtrl implements IComponentController {

    private item: CalendarItemActivityCtrl;
    public mode: string;
    public activity: Activity;
    private showMap: boolean = true;
    private showChart: boolean = true;
    private showTable: boolean = true;
    private fullScreenTable: boolean = false;
    private zoomIn: number = 0;
    private zoomOut: number = 0;
    private autoZoom: boolean = true;

    private measures: {} = {};
    private measuresItem: {} = {};
    private measuresX: Array<string> = ['distance', 'elapsedDuration'];
    private measuresY: Array<string> = ['heartRate', 'speed', 'power','altitude'];
    private measuresSecondary: Array<string> = ['timestamp'];
    private maxValue: {};
    private data: Array<{}>;
    private chartX: string = 'elapsedDuration';
    private change: number = 0;
    private changeMeasure: string = null;
    static $inject = ['$mdMedia','$filter'];


    constructor(private $mdMedia: any, private $filter: any) {

    }

    $onInit() {
        let array: Array<string>;
        let sportBasic:string = this.item.activity.sportBasic;
        let calcMeasure = this.item.activity.intervalW.calcMeasures;
        let detailsMetrics: Array<Array<number>> = this.item.details.metrics;
        let detailsMeasure: {} = this.item.details.measures || {};
        this.maxValue = {};

        array = copy(this.measuresY);
        array.forEach(key => {
            if (detailsMeasure.hasOwnProperty(key) &&
                (!calcMeasure.hasOwnProperty(key) || (calcMeasure.hasOwnProperty(key) && calcMeasure[key].value > 0))) {
                this.measures[key] = detailsMeasure[key];
                this.measures[key]['show'] = true;
                if(calcMeasure[key] && calcMeasure[key].hasOwnProperty('minValue')) {
                    this.maxValue[key] = {
                        max: calcMeasure[key].maxValue,
                        min: calcMeasure[key].minValue
                    };
                }
            } else {
                this.measuresY.splice(this.measuresY.indexOf(key), 1);
            }
        });

        array = copy(this.measuresX);
        array.forEach(key => {
            if (detailsMeasure.hasOwnProperty(key) &&
                (!calcMeasure.hasOwnProperty(key) || (calcMeasure.hasOwnProperty(key) && calcMeasure[key].value > 0))) {
                this.measures[key] = detailsMeasure[key];
                this.measures[key]['show'] = true;
            } else {
                this.measuresX.splice(this.measuresX.indexOf(key), 1);
            }
        });

        this.measuresSecondary.forEach(key => {
            this.measures[key] = detailsMeasure[key];
            this.measures[key]['show'] = true;
        });

        this.data = [];
        this.item.details.metrics.forEach(info => {
            let cleaned = {};
            for (let key in this.measures) {
                let unit: string = this.$filter('measureUnit')(key, sportBasic);
                cleaned[key] = isPace(unit) ?
                    Math.max(info[this.measures[key]['idx']], getSportLimit(sportBasic,key)['min']) :
                    info[this.measures[key]['idx']];
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
        this.changeMeasure = measure;
        this.change++;
    }

    onSelectionRange(select: Array<{startTimestamp: number, endTimestamp}>){
        if (!select[0].startTimestamp) {
            let index = this.measures['timestamp']['idx'];
            select[0].startTimestamp = this.item.details.metrics[0][index];
        }
        this.item.addUserInterval(select[0]);
    }

    onChartSelect(segmentId){
        debugger;
        console.log('chart select interval=', segmentId);
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
