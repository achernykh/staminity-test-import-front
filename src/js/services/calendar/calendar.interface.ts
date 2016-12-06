import {IUserProfileShort} from '../user/user.interface'

// Заголовок Тренировки календаря
export interface IActivityHeader {

}

// Заголовок События календаря
export interface IEventHeader {
    eventType: string; //RestDay/...,
    target: string; // установка от тренера
}

// Заголовок Измерения календаря
export interface IMeasurementHeader {

}

// Заголовок Соревнования календаря
export interface ICompetitionHeader {
    raceClass: string;
    goals: { // плановые значения
        timeLength: number; // длительность
        distance: number; // дистанция
        agePlace: number; // место в AG
        overallPlace: number; // место в абсолюте
        finish: boolean; // факт финиша
        personalRecord: boolean; // получить персональный рекорд
        trainerComment: string; // установка тренера на гонку
    },
    results: { // фактические данные
        timeLength: number; // длительность
        distance: number; // пройденная дистанция
        agePlace: number; // место в AG
        ageGroupAthletesCount: number; // общее кол-во атлетов в данной AG
        overallPlace: number; // место а абсолюте
        overallAthletesCount: number; // общее кол-во участников
        genderPlace: number; // место среди спортсменов того же пола, что и текущий
        genderAthletesCount: number; // общее кол-во спортсменов того же пола
    },
    activities: Array<IActivityHeader>; // связанные тренировки
}

export interface ICalendarItem {
    calendarItemId: number;
    calendarItemCode: string; //некий текстовый код записи
    calendarItemType: string; //activity/competition/event/measurement/...,
    revision: number;
    date: Date; // timestamp записи
    created: Date; // дата + время создания записи
    userProfileOwner: IUserProfileShort;
    userProfileCreator: IUserProfileShort;
    activityHeader?: IActivityHeader;
    competitionHeader?: ICompetitionHeader;
    eventHeader?: IEventHeader;
    measurementHeader?: IMeasurementHeader;
    social: {
        userLikesCount: number;
        trainerCommentsCount: number;
        userCommentsCount: number;
        isPublic: boolean;
    }
}