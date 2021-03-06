import { StateDeclaration } from "@uirouter/angularjs";
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
        item: ["CalendarService", "message", "$stateParams",
            (calendarService: CalendarService, message: MessageService, $stateParams) =>
            calendarService.getCalendarItem(null, null, null, null, $stateParams.calendarItemId)
                .then((response) => response && response[0])
                .catch((error) => {
                    message.systemWarning(error);
                    throw error;
                })],
        athlete: ["item", "UserService", "message", (item: ICalendarItem, UserService: UserService, message: MessageService) =>
            UserService.getProfile(item.userProfileOwner.userId).catch((error) => {
                message.systemWarning(error);
                throw error;
            })]
    },
    views: { application: { component: "activity" } },

};
