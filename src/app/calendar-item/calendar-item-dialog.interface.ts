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
    templateOptions?: {
        templateId: number;
        code: string;
        visible: boolean;
        favourite: boolean;
        groupProfile: IGroupProfileShort;
    }; //
    trainingPlanMode?: boolean; // true - если режим ввода Долгосрочного плана
    trainingPlanOptions?: {
        planId?: number; // ссылка на долгосрочный план, если идет планирование в рамках него
        dayNumber?: number;
        weekNumber?: number;
    },
    isPro?: boolean; // Полномочия пользователя не режим Про
    athleteList?: Array<{profile: IUserProfile, active: boolean}>; // Перечень атлетов доступных для планирования
    calendarRange?: {dateStart: string, dateEnd: string}; // Содержит область видимости календаря, описывается с даты с по дату по
}

export interface ICalendarItemDialogResponse {
    formMode: FormMode;
    item: ICalendarItem;
}