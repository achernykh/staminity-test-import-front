import './activity-segments.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {CalendarItemActivityCtrl} from "../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import {Interval} from "../activity.datamodel";

class ActivitySegmentsCtrl implements IComponentController {

    public item: CalendarItemActivityCtrl;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }

    addInterval() {
        let interval: Interval = new Interval('P');
        this.item.activity.completeInterval(interval);
    }

}

const ActivitySegmentsComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    require: {
        item: '^calendarItemActivity'
    },
    controller: ActivitySegmentsCtrl,
    template: require('./activity-segments.component.html') as string
};

export default ActivitySegmentsComponent;