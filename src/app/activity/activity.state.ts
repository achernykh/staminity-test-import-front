import { StateDeclaration } from "angular-ui-router";
import { ICalendarItem } from "../../../api/";
import { CalendarService } from "../calendar/calendar.service";
import { DisplayView } from "../core/display.constants";
import MessageService from "../core/message.service";
import UserService from "../core/user.service";

export const activityState = {

    name: "activity",
    url: "/activity/:calendarItemId",
    loginRequired: true,
    authRequired: ["user"],
    resolve: {
        view: () => new DisplayView("activity"),
        item: ["CalendarService", "message","$stateParams",
            (CalendarService: CalendarService, message: MessageService, $stateParams) =>
            CalendarService.getCalendarItem(null,null,null,null, $stateParams.calendarItemId)
                .then((response) => response && response[0])
                .catch((error) => {
                    message.systemWarning(error);
                    throw error;
                })],
        athlete: ["item","UserService","message", (item: ICalendarItem, UserService: UserService, message:MessageService) =>
            UserService.getProfile(item.userProfileOwner.userId).catch((error) => {
                message.systemWarning(error);
                throw error;
            })],
    },
    views: {
        "application": {
            component: "activity",
            bindings: {
                view: "view.application",
            },
        },
    },

};