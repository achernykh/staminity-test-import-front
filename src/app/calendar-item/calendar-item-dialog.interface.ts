import { IUserProfile } from "@api/user";
import { IActivityType } from "@api/activity";
import { IActivityCategory } from "@api/reference";
import { IGroupProfileShort } from "@api/group";
import { FormMode } from "../application.interface";
import { ICalendarItem } from "@api/calendar";

enum CalendarItemTabs {

}

export interface ICalendarItemDialogOptions {
    dateStart?: string; // предустановленная дата начала итема
    activityType?: IActivityType; // предустановленный вид спорта для activity
    activityCategory?: IActivityCategory; // предустановленная категория для activity
    currentUser: IUserProfile; // текущий пользователь сервис, от чьего лица ведутся действия
    owner: IUserProfile; // будущий или текущий владелец итема
    groupCreator?: IGroupProfileShort;
    currentTab?: CalendarItemTabs;
    formMode?: FormMode; // режим формы: просмотр, изменение, создание
    popupMode?: boolean; // true - если режим показа в формате всплывающего окна, false - для отдельного экрана
    templateMode?: boolean; // true - если режим ввода шаблона
    trainingPlanMode?: boolean; // true - если режим ввода Долгосрочного плана
    planId?: number; // ссылка на долгосрочный план, если идет планирование в рамках него
    isPro?: boolean; // Полномочия пользователя не режим Про
    athleteList?: Array<{profile: IUserProfile, active: boolean}>; // Перечень атлетов доступных для планирования
}

export interface ICalendarItemDialogResponse {
    formMode: FormMode;
    item: ICalendarItem;
}