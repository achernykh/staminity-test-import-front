import { IUserProfile } from "@api/user";
import { IActivityType } from "@api/activity";
import { IActivityCategory } from "@api/reference";
import { IGroupProfileShort } from "@api/group";

enum CalendarItemTabs {

}

export interface ICalendarItemDialogOptions {
    dateStart?: string;
    activityType?: IActivityType;
    activityCategory?: IActivityCategory;
    currentUser: IUserProfile;
    owner: IUserProfile;
    groupCreator?: IGroupProfileShort;
    currentTab?: CalendarItemTabs;
    // вид
    popup?: boolean;
    // Образы создания
    template?: boolean;
    trainingPlan?: boolean;
}