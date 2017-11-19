import { IUserProfile } from "@api/user";
import { IActivityType } from "@api/activity";
import { IActivityCategory } from "@api/reference";
import { IGroupProfileShort } from "@api/group";
import { FormMode } from "../application.interface";

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
    formMode?: FormMode;
    // вид
    popupMode?: boolean;
    // Образы создания
    templateMode?: boolean;
    trainingPlanMode?: boolean;
}