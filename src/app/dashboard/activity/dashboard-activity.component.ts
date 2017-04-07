import './dashboard-activity.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {ICalendarItem} from "../../../../api/calendar/calendar.interface";
import {Activity} from "../../activity/activity.datamodel";

class DashboardActivityCtrl implements IComponentController {

    public item: ICalendarItem;
    private activity: Activity;

    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {
        this.activity = new Activity(this.item);
        this.activity.prepare();
    }
}

const DashboardActivityComponent:IComponentOptions = {
    bindings: {
        item: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: DashboardActivityCtrl,
    template: require('./dashboard-activity.component.html') as string
};

export default DashboardActivityComponent;