import {IComponentController, IComponentOptions, IPromise} from "angular";
import {ICalendarItem} from "../../../api/calendar/calendar.interface";
import {IUserProfile} from "../../../api/user/user.interface";
import "./activity.component.scss";

class ActivityCtrl implements IComponentController {

    public item: ICalendarItem;
    public athlete: IUserProfile;
    public onEvent: (response: Object) => IPromise<void>;
    public static $inject = [];

    constructor() {

    }

    public $onInit() {

    }
}

const ActivityComponent: IComponentOptions = {
    bindings: {
        item: "<",
        athlete: "<",
        onEvent: "&",
    },
    require: {
        //component: '^component'
    },
    controller: ActivityCtrl,
    template: require("./activity.component.html") as string,
};

export default ActivityComponent;
