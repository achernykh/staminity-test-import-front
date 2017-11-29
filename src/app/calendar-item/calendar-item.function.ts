import { ICalendarItem } from "../../../api/calendar/calendar.interface";
import { IUserProfile } from "../../../api/user/user.interface";
import { profileShort } from "../core/user.function";

export const getCalendarItem = (type: string,
                                date: string,
                                owner: IUserProfile,
                                creator: IUserProfile,
                                params?: Object): ICalendarItem => {

    return Object.assign({
        calendarItemType: type,
        dateStart: date,
        dateEnd: date,
        userProfileOwner: profileShort(owner),
        userProfileCreator: profileShort(creator),
    }, params);

};