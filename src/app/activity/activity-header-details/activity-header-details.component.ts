import {IComponentController, IComponentOptions, IPromise} from "angular";
import {ICalcMeasures} from "../../../../api/activity/activity.interface";
import {
    CalendarItemActivityCtrl,
    ISelectionIndex, SelectInitiator,
} from "../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import {Measure} from "../../share/measure/measure.constants";
import {ActivityIntervalL} from "../activity-datamodel/activity.interval-l";
import {MeasureChartData} from "../activity.function";
import "./activity-header-details.component.scss";

interface Select {
    type: string;
    startTimestamp: number;
    endTimestamp: number;
    duration: number;
    distance: number;
}

interface SelectionOptions<T> {
    [index: string]: any;
}
class ActivityHeaderDetailsCtrl implements IComponentController {

    hasImport: boolean;
    hasDetails: boolean;

    private item: CalendarItemActivityCtrl;
    private completeDetails: boolean = false;

    private selectionIndex: ISelectionIndex;
    onSelected: (result: {initiator: SelectInitiator, selection: ISelectionIndex}) => IPromise<void>;
    private chartData: MeasureChartData; // класс для расчета данных для графика

    private readonly intervalTypes = ["P", "L", "U"];
    private intervals: SelectionOptions<Select> = {};
    private changes: number = 0;
    private selectedIntervals: string[] = [];

    static $inject = [];

    constructor() {

    }

    prepareIntervals() {
        this.intervalTypes.forEach((type) =>
            this.item.activity.intervals.stack
                .filter((interval) => interval.type === type && interval.hasOwnProperty("calcMeasures"))
                .forEach((interval, i) =>
                    this.intervals[interval.type + (i + 1)] = {
                        type,
                        startTimestamp: interval.startTimestamp,
                        endTimestamp: interval.endTimestamp,
                        duration: interval.calcMeasures.hasOwnProperty("duration") && interval.calcMeasures.duration.value || "-",
                        distance: interval.calcMeasures.hasOwnProperty("distance") && interval.calcMeasures.distance.value || "-",
                    }),
        );
    }

    calculateIndex(selection: ISelectionIndex) {
        const type = Object.keys(selection);
        const selectionIndex: string[] = [];

        type.forEach((type) => {
            if (selection[type]) {
                selection[type].forEach((i) => selectionIndex.push(type + (i + 1)));
            }
        });

        return selectionIndex;

    }

    $onInit() {
        /**this.chartData = new MeasureChartData(
            this.item.activity.sportBasic, this.item.activity.intervalW.calcMeasures, this.item.details);**/
        this.prepareIntervals();
    }

    $onChanges(changes: any): void {

        if (changes.hasOwnProperty("change") && !changes.change.isFirstChange()) {
            this.prepareIntervals();
            this.selectedIntervals = this.calculateIndex(this.selectionIndex);
        }
        if (changes.hasOwnProperty("hasDetails") && changes.hasDetails.currentValue && !this.completeDetails) {
            this.chartData = new MeasureChartData(this.item.activity.sportBasic, this.item.activity.intervalW.calcMeasures, this.item.activity.details);
            this.completeDetails = true;
            this.prepareIntervals();
        }
        if (changes.hasOwnProperty("hasImport") && changes.hasImport.currentValue) {
            this.prepareIntervals();
        }
    }

    changeSelect() {

        this.changes++;
        const selection: ISelectionIndex = { L: [], P: [], U: []};

        this.intervalTypes.forEach((type) =>
            this.selectedIntervals.filter((i) => i.substr(0, 1) === type)
                .forEach((i) => selection[type].push(Number(i.substr(1)) - 1)));

        console.log("changeSelect", this.selectedIntervals);
        this.onSelected({
            initiator: "header",
            selection,
        });
    }

    getCalcMeasure(selection: string[]): ICalcMeasures {
        if (selection.length === 0) {
            return this.item.activity.intervalW.calcMeasures;
        }
        if (this.item.multiSelection) {
            return this.item.multiSelectionInterval.calcMeasures;
        }

        const type: string = "interval" + selection[0].substr(0, 1);
        const index: number = Number(selection[0].substr(1)) - 1;

        return this.item.activity[type][index].calcMeasures;
    }

    lapIndex(index: string[]): number {
        console.log("lapIndex", Number(index[0].substr(1)) - 1);
        return index ? Number(index[0].substr(1)) - 1 : null;
    }
}

const ActivityHeaderDetailsComponent: IComponentOptions = {
    bindings: {
        data: "<",
        selectionIndex: "<",
        hasDetails: "<",
        hasImport: "<",
        change: "<",
        onSelected: "&",
    },
    require: {
        item: "^calendarItemActivity",
    },
    controller: ActivityHeaderDetailsCtrl,
    template: require("./activity-header-details.component.html") as string,
};

export default ActivityHeaderDetailsComponent;
