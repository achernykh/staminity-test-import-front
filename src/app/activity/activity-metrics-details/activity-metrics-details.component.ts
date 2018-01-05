import './activity-metrics-details.component.scss';
import {IComponentOptions, IComponentController, IPromise, copy} from 'angular';
import {CalendarItemActivityCtrl} from "../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import {Activity} from "../activity-datamodel/activity.datamodel";
import {isPace, getSportLimit} from "../../share/measure/measure.constants";
import {MeasureChartData} from "../activity.function";
import {IChartMeasureData} from "../activity-datamodel/activity.details";

class ActivityMetricsDetailsCtrl implements IComponentController {

    private hasDetails: boolean = false;
    private completeDetails: boolean = false;

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

    private chartOptions: Array<string> = ['measures','segments'];
    private chartOption: 'measures' | 'segments';

    private tableOptions: Array<string> = ['laps','segments'];
    private tableOption: 'laps' | 'segments';

    private chartData: IChartMeasureData; // класс для расчета данных для графика

    private chartX: string = 'elapsedDuration';
    private change: number = 0;
    private changeMeasure: string = null;
    static $inject = ['$mdMedia','$filter'];


    constructor (private $mdMedia: any, private $filter: any) {

    }

    $onChanges (changes){
        if(changes.hasOwnProperty('hasDetails') && changes.hasDetails.currentValue) {
            this.chartData = this.item.activity.details.chartData(this.item.activity.header.sportBasic, this.item.activity.intervals.W.calcMeasures);
            this.completeDetails = true;
        }
    }

    $onInit () {

        this.item.activity.isStructured ? this.tableOption = 'segments' : this.tableOption = 'laps';
        this.item.activity.isStructured ? this.chartOption = 'segments' : this.chartOption = 'measures';
    }

    toggleMap () {
        return this.showMap = !this.showMap;
    }

    toggleChart () {
        return this.showChart = !this.showChart;
    }

    toggleTable () {
        return this.showTable = !this.showTable;
    }

    changeChartX (measure) {
        this.chartX = measure;
        this.change++;
    }

    changeChartMetrics (measure) {
        this.chartData.measures[measure]['show'] = !this.chartData.measures[measure]['show'];
        this.changeMeasure = measure;
        this.change++;
    }

    onSelectionRange (select: Array<{startTimestamp: number, endTimestamp}>){
        if(select.length === 0) {
            this.item.clearUserInterval();
        } else {
            if (!select[0].startTimestamp) {
                let index = this.chartData.measures['timestamp']['idx'];
                select[0].startTimestamp = this.item.activity.details.metrics[0][index];
            }
            this.item.addUserInterval(select[0]);
        }
    }

    onChartSelect (segmentId){
        console.log('chart select interval=', segmentId);
    }
}

const ActivityMetricsDetailsComponent: IComponentOptions = {
    bindings: {
        hasDetails: '<',
    },
    require: {
        item: '^calendarItemActivity'
    },
    controller: ActivityMetricsDetailsCtrl,
    template: require('./activity-metrics-details.component.html') as string
};

export default ActivityMetricsDetailsComponent;
