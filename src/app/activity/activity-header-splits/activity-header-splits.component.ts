import {IComponentController, IComponentOptions, IPromise} from "angular";
import {IActivityIntervalL} from "../../../../api/activity/activity.interface";
import { CalendarItemActivityCtrl } from "../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import "./activity-header-splits.component.scss";

export class ActivityHeaderSplitsCtrl implements IComponentController {

    splits: IActivityIntervalL[];
    sport: string;
    onEvent: (response: Object) => IPromise<void>;

    private item: CalendarItemActivityCtrl;

    static $inject = [];

    constructor() {

    }

    $onInit() {
        this.splits = [...this.item.activity.intervals.L];
    }
}

const ActivityHeaderSplitsComponent: IComponentOptions = {
    bindings: {
        sport: "<",
    },
    require: {
        item: '^calendarItemActivity'
    },
    controller: ActivityHeaderSplitsCtrl,
    template: require("./activity-header-splits.component.html") as string,
};

export default ActivityHeaderSplitsComponent;
