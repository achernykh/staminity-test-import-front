import {IComponentController, IComponentOptions, IPromise} from "angular";
import {ICalendarItem} from "../../../api/calendar/calendar.interface";
import {IUserProfile} from "../../../api/user/user.interface";
import "./activity.component.scss";
import {SessionService} from "@app/core";
import {ICalendarItemDialogOptions} from "@app/calendar-item/calendar-item-dialog.interface";
import {FormMode} from "../application.interface";

export class ActivityCtrl implements IComponentController {

    item: ICalendarItem;
    options: ICalendarItemDialogOptions;
    athlete: IUserProfile;
    onEvent: (response: Object) => IPromise<void>;
    static $inject = ['SessionService'];

    constructor(private session: SessionService) {

    }

    $onInit() {
        this.options = {
            currentUser: this.session.getUser(),
            owner: this.session.getUser(),
            popupMode: true,
            formMode: FormMode.View,
            trainingPlanMode: false,
        }
    }
}

const ActivityComponent: IComponentOptions = {
    bindings: {
        item: "<",
        athlete: "<",
        options: '<',
        onEvent: "&",
    },
    require: {
        //component: '^component'
    },
    controller: ActivityCtrl,
    template: require("./activity.component.html") as string,
};

export default ActivityComponent;
