import './activity-header-details.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {
    CalendarItemActivityCtrl,
    ISelectionIndex, SelectInitiator
} from "../../calendar-item/calendar-item-activity/calendar-item-activity.component";

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

    private item: CalendarItemActivityCtrl;
    private selectionIndex: ISelectionIndex;
    public onSelected: (result: {initiator: SelectInitiator, selection: ISelectionIndex}) => IPromise<void>;

    private readonly intervalTypes = ['L','U'];
    private intervals: SelectionOptions<Select> = {};
    private changes: number = 0;
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
                    duration: d.calcMeasures.duration.value || '-',
                    distance: d.calcMeasures.distance.value || '-'
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
        this.prepareIntervals();
    }

    $onChanges(change: any): void {
        if(!change.change.isFirstChange()) {
            this.prepareIntervals();
            this.selectedIntervals = this.calculateIndex(this.selectionIndex);
        }
    }

    changeSelect() {
        debugger;
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

    lapIndex(index: Array<string>):number {
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