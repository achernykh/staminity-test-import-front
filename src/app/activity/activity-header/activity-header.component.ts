import './activity-header.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {CalendarItemActivityCtrl} from "../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import {Activity} from "../activity.datamodel";

export class ActivityHeaderCtrl implements IComponentController {

    public item: CalendarItemActivityCtrl;
    public calendarActivity: CalendarItemActivityCtrl;
    public mode: string;
    public activity: Activity;
    private peaks: Array<any>;

    constructor(private $mdMedia: any) {
    }

    static $inject = ['$mdMedia'];

    $onInit() {
        this.peaks = this.item.activity.getPeaks();
    }
}

const ActivityHeaderComponent:IComponentOptions = {
    require: {
        item: '^calendarItemActivity'
    },
    controller: ActivityHeaderCtrl,
    template: require('./activity-header.component.html') as string
};

export default ActivityHeaderComponent;