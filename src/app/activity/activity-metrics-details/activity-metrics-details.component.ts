import {copy, IComponentController, IComponentOptions, IPromise} from "angular";
import {CalendarItemActivityCtrl} from "../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import {getSportLimit, isPace} from "../../share/measure/measure.constants";
import {IChartMeasureData} from "../activity-datamodel/activity.details";
import {Activity} from "../activity.datamodel";
import {MeasureChartData} from "../activity.function";
import "./activity-metrics-details.component.scss";

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

    private chartOptions: string[] = ["measures", "segments"];
    private chartOption: "measures" | "segments";

    private tableOptions: string[] = ["laps", "segments"];
    private tableOption: "laps" | "segments";

    private chartData: IChartMeasureData; // класс для расчета данных для графика

    private chartX: string = "elapsedDuration";
    private change: number = 0;
    private changeMeasure: string = null;
    public static $inject = ["$mdMedia", "$filter"];

    constructor(private $mdMedia: any, private $filter: any) {

    }

    public $onChanges(changes) {
        if (changes.hasOwnProperty("hasDetails") && changes.hasDetails.currentValue) {
            this.chartData = this.item.activity.details.chartData(this.item.activity.sportBasic, this.item.activity.intervalW.calcMeasures);
            //this.chartData = new MeasureChartData(this.item.activity.sportBasic, this.item.activity.intervalW.calcMeasures, this.item.activity.details);
            this.completeDetails = true;
        }
    }

    public $onInit() {

        this.item.activity.structured ? this.tableOption = "segments" : this.tableOption = "laps";
        this.item.activity.structured ? this.chartOption = "segments" : this.chartOption = "measures";

        //debugger;
        /*

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
        });*/
    }

    public toggleMap() {
        return this.showMap = !this.showMap;
    }

    public toggleChart() {
        return this.showChart = !this.showChart;
    }

    public toggleTable() {
        return this.showTable = !this.showTable;
    }

    public changeChartX(measure) {
        this.chartX = measure;
        this.change++;
    }

    public changeChartMetrics(measure) {
        this.chartData.measures[measure].show = !this.chartData.measures[measure].show;
        this.changeMeasure = measure;
        this.change++;
    }

    public onSelectionRange(select: Array<{startTimestamp: number, endTimestamp}>) {
        if (select.length === 0) {
            this.item.clearUserInterval();
        } else {
            if (!select[0].startTimestamp) {
                const index = this.chartData.measures.timestamp.idx;
                select[0].startTimestamp = this.item.activity.details.metrics[0][index];
            }
            this.item.addUserInterval(select[0]);
        }
    }

    public onChartSelect(segmentId) {
        console.log("chart select interval=", segmentId);
    }
}

const ActivityMetricsDetailsComponent: IComponentOptions = {
    bindings: {
        hasDetails: "<",
    },
    require: {
        item: "^calendarItemActivity",
    },
    controller: ActivityMetricsDetailsCtrl,
    template: require("./activity-metrics-details.component.html") as string,
};

export default ActivityMetricsDetailsComponent;
