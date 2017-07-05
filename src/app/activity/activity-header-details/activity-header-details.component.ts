import './activity-header-details.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {
    CalendarItemActivityCtrl,
    ISelectionIndex, SelectInitiator
} from "../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import {ICalcMeasures} from "../../../../api/activity/activity.interface";
import {Measure} from "../../share/measure/measure.constants";
import {MeasureChartData} from "../activity.function";

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
export class ActivityHeaderDetailsCtrl implements IComponentController {

    private item: CalendarItemActivityCtrl;
    private selectionIndex: ISelectionIndex;
    public onSelected: (result: {initiator: SelectInitiator, selection: ISelectionIndex}) => IPromise<void>;
    protected chartData: MeasureChartData; // класс для расчета данных для графика

    private readonly intervalTypes = ['L','U'];
    private intervals: SelectionOptions<Select> = {};
    protected changes: number = 0;
    private selectedIntervals: Array<string> = [];

    static $inject = [];

    constructor() {

    }

    prepareIntervals() {
        this.intervalTypes.forEach(type => {
            this.item.activity.header.intervals
                .filter(i => i.type === type)
                .forEach((d,i) => this.intervals[d.type+(i+1)] = {
                    type: type,
                    startTimestamp: d.startTimestamp,
                    endTimestamp: d.endTimestamp,
                    duration: d.calcMeasures.hasOwnProperty('duration') && d.calcMeasures.duration.value || '-',
                    distance: d.calcMeasures.hasOwnProperty('distance') && d.calcMeasures.distance.value || '-'
                });
        });
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
        this.chartData = new MeasureChartData(
            this.item.activity.sportBasic, this.item.activity.intervalW.calcMeasures, this.item.details);
        this.prepareIntervals();
    }

    $onChanges(change: any): void {
        if(change.hasOwnProperty('change') && !change.change.isFirstChange()) {
            this.prepareIntervals();
            this.selectedIntervals = this.calculateIndex(this.selectionIndex);
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
            return this.item.activity.intervalW.calcMeasures;
        }
        if (this.item.multiSelection) {
            return this.item.multiSelectionInterval.calcMeasures;
        }

        let type: string = 'interval' + selection[0].substr(0,1);
        let index: number = Number(selection[0].substr(1))-1;

        return this.item.activity[type][index].calcMeasures;
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
