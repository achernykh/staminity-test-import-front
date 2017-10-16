import { InjectionToken } from "@angular/core";

export let ConnectionSettingsConfig = new InjectionToken<IConnectionSettings>("socket.config");

export interface IConnectionSettings {
    delayOnHeartBeat: number;
    delayOnOpen: number; // задержка на получение ответа об открытие сессии
    delayOnReopen: number; // начальная задержка на переоткрытие
    delayOnResponse: number; // лимит ожидания ответа
    delayExceptions: {
        [responseType: string]: number // исключения delayOnResponse по типам запросов сессии
    };
    internetResource: string; // ресурс на сервер для проверки интернета
    delayOnInternetConnectionCheck: number;
}

export const ConnectionSettings = {
    delayOnHeartBeat: 30 * 1000, // 30 sec
    delayOnOpen: 300, // таймаут для завершения соедниения сессии (мс)
    delayOnResponse: 10 * 1000, // 10 sec
    delayExceptions: {
        getActivityIntervals: 10.0,
        postUserExternalAccount: 60.0,
        putUserExternalAccountSettingSuccess: 10.0,
        getCalendarItem: 30.0,
        calculateActivityRange: 15.0,
        putCalendarItem: 15.0,
        getActivityCategory: 10.0,
        postCalendarItem: 10.0,
        getGroupManagementProfile: 10.0
    },
    internetResource: '/favicon.ico',
    delayOnInternetConnectionCheck: 5 * 1000, // 5 sec задержка на опрос состояния интернета
};