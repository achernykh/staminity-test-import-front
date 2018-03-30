import './activity-header-details.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {
    CalendarItemActivityCtrl,
    ISelectionIndex, SelectInitiator
} from "../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import {ICalcMeasures} from "../../../../api/activity/activity.interface";
import {Measure} from "../../share/measure/measure.constants";
import {MeasureChartData} from "../activity.function";
import {ActivityIntervalL} from "../activity-datamodel/activity.interval-l";
import { IChartMeasureData } from "../activity-datamodel/activity.details";

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
    public onSelected: (result: {initiator: SelectInitiator, selection: ISelectionIndex}) => IPromise<void>;
    private chartData: IChartMeasureData; // класс для расчета данных для графика

    private readonly intervalTypes = ['P','L','U'];
    private intervals: SelectionOptions<Select> = {};
    private changes: number = 0;
    private selectedIntervals: Array<string> = [];

    static $inject = [];

    constructor() {

    }

    prepareIntervals() {
        this.intervalTypes.forEach(type =>
            this.item.activity.intervals.stack
                .filter(interval => interval.type === type && interval.hasOwnProperty('calcMeasures'))
                .forEach((interval,i) =>
                    this.intervals[interval.type+(i+1)] = {
                        type: type,
                        startTimestamp: interval.startTimestamp,
                        endTimestamp: interval.endTimestamp,
                        duration: interval.calcMeasures.hasOwnProperty('duration') && interval.calcMeasures['duration'].value || '-',
                        distance: interval.calcMeasures.hasOwnProperty('distance') && interval.calcMeasures['distance'].value || '-'
                    })
        );
    }

    calculateIndex(selection: ISelectionIndex) {
        let type = Object.keys(selection);
        let selectionIndex: Array<string> = [];

        type.forEach(type => {
            if(selection[type]){
                selection[type].forEach(i => selectionIndex.push(type+(i+1)));
            }
        });

        return selectionIndex;

    }

    $onInit() {
        this.prepareIntervals();
    }

    $onChanges(changes: any): void {

        if(changes.hasOwnProperty('change') && !changes.change.isFirstChange()) {
            this.prepareIntervals();
            this.selectedIntervals = this.calculateIndex(this.selectionIndex);
        }
        if(changes.hasOwnProperty('hasDetails') && changes.hasDetails.currentValue && !this.completeDetails) {
            this.chartData = this.item.activity.details.chartData(this.item.activity.header.sportBasic, this.item.activity.intervals.W.calcMeasures);
            this.completeDetails = true;
            this.prepareIntervals();
        }
        if(changes.hasOwnProperty('hasImport') && changes.hasImport.currentValue) {
            this.prepareIntervals();
        }
    }

    changeSelect() {

        this.changes++;
        let selection: ISelectionIndex = { L: [], P: [], U: []};

        this.intervalTypes.forEach(type =>
            this.selectedIntervals.filter(i => i.substr(0,1) === type)
                .forEach(i => selection[type].push(Number(i.substr(1))-1)));

        console.log('changeSelect', this.selectedIntervals);
        this.onSelected({
            initiator: 'header',
            selection: selection
        });
    }

    getCalcMeasure(selection: Array<string>):ICalcMeasures {
        if (selection.length === 0) {
            return this.item.activity.intervals.W.calcMeasures;
        }
        if (this.item.multiSelection) {
            return this.item.multiSelectionInterval.calcMeasures;
        }

        let intervalType: string = selection[0].substr(0,1);
        let index: number = Number(selection[0].substr(1))-1;

        return this.item.activity.intervals[intervalType][index].calcMeasures;
    }

    lapIndex(index: Array<string>):number {
        console.log('lapIndex', Number(index[0].substr(1))-1);
        return index ? Number(index[0].substr(1))-1 : null;
    }
}

const ActivityHeaderDetailsComponent:IComponentOptions = {
    bindings: {
        data: '<',
        selectionIndex: '<',
        hasDetails: '<',
        hasImport: '<',
        change: '<',
        onSelected: '&'
    },
    require: {
        item: '^calendarItemActivity'
    },
    controller: ActivityHeaderDetailsCtrl,
    template: require('./activity-header-details.component.html') as string
};

export default ActivityHeaderDetailsComponent;