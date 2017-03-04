import './activity-header-overview.component.scss';
import {IComponentOptions, IComponentController, IPromise, INgModelController} from 'angular';
import {Activity} from "../activity.datamodel";
import {CalendarItemActivityCtrl} from "../../calendar-item/calendar-item-activity/calendar-item-activity.component";

class ActivityHeaderOverviewCtrl implements IComponentController {

    private item: CalendarItemActivityCtrl;
    public mode: string;
    public activity: Activity;
    public form: INgModelController;
    static $inject = [];

    constructor() {

    }

    $onInit() {
        // для удобства верстки создаем быстрый путь к данным
        this.mode = this.item.mode;
        this.activity = this.item.activity;
    }

    onChangeForm(plan,actual,form) {
        this.form = form;
        this.item.updateAssignment(plan,actual);
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