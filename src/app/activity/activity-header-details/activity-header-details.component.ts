import './activity-header-details.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {CalendarItemActivityCtrl} from "../../calendar-item/calendar-item-activity/calendar-item-activity.component";

class ActivityHeaderDetailsCtrl implements IComponentController {

    private item: CalendarItemActivityCtrl;
    public select: {};
    public onSelected: (result: {type: string, selected: Array<number>}) => IPromise<void>;
    static $inject = [];
    private intervals: {};
    private peaks: Array<any>;
    private changes: number = 0;
    private selectedIntervals: Array<string> = [];

    constructor() {

    }

    $onInit() {
        this.intervals = {};
        this.item.activity.intervalL
            .forEach((d,i) => this.intervals['L'+(i+1)] = {
                startTimestamp: d.startTimestamp,
                endTimestamp: d.endTimestamp,
                duration: d.calcMeasures.duration.value || '-',
                distance: d.calcMeasures.distance.value || '-'
            });

        this.peaks = this.item.activity.getPeaks();
    }

    $onChanges(change: any): void {
        if(!change.change.isFirstChange()) {
            this.selectedIntervals = this.select['L'].map(i => 'L'+(i+1));
        }
    }

    changeSelect() {
        this.changes++;
        console.log('changeSelect', this.selectedIntervals);
        this.onSelected({type: 'L', selected: this.selectedIntervals.map(i => Number(i.substr(1))-1)});
    }

    lapIndex(index: Array<string>):number {
        return index ? Number(index[0].substr(1))-1 : null;
    }
}

const ActivityHeaderDetailsComponent:IComponentOptions = {
    bindings: {
        data: '<',
        select: '<',
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