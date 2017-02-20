import './activity-header-overview.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {Activity} from "../activity.datamodel";
import {CalendarItemActivityCtrl} from "../../calendar-item/calendar-item-activity/calendar-item-activity.component";

class ActivityHeaderOverviewCtrl implements IComponentController {

    private item: CalendarItemActivityCtrl;
    public mode: string;
    public activity: Activity;
    static $inject = [];

    constructor() {

    }

    $onInit() {
        // для удобства верстки создаем быстрый путь к данным
        this.mode = this.item.mode;
        this.activity = this.item.activity;
    }
}

const ActivityHeaderOverviewComponent:IComponentOptions = {
    require: {
        item: '^calendarItemActivity'
    },
    controller: ActivityHeaderOverviewCtrl,
    template: require('./activity-header-overview.component.html') as string
};

export default ActivityHeaderOverviewComponent;