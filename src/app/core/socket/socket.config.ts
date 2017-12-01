export interface IConnectionSettings {

    delayOnHeartBeat: number;
    delayOnOpen: number; // задержка на получение ответа об открытие сессии
    delayOnReopen: number; // начальная задержка на переоткрытие
    delayOnResponse: number; // лимит ожидания ответа
    delayExceptions: {
        [responseType: string]: number, // исключения delayOnResponse по типам запросов сессии
    };
    internetResource: string; // ресурс на сервер для проверки интернета
    delayOnInternetConnectionCheck: number;

}

export const ConnectionSettings: IConnectionSettings = {

    delayOnHeartBeat: 30 * 1000, // 30 sec
    delayOnOpen: 300, // таймаут для завершения соедниения сессии (мс)
    delayOnReopen: 5 * 1000, // 5 sec
    delayOnResponse: 10 * 1000, // 10 sec
    delayExceptions: {
        getActivityIntervals: 10.0 * 1000,
        postUserExternalAccount: 60.0 * 1000,
        putUserExternalAccountSettingSuccess: 10.0 * 1000,
        getCalendarItem: 30.0 * 1000,
        calculateActivityRange: 15.0 * 1000,
        putCalendarItem: 15.0 * 1000,
        getActivityCategory: 10.0 * 1000,
        postCalendarItem: 10.0 * 1000,
        getGroupManagementProfile: 10.0 * 1000,
    },
    internetResource: "/favicon.ico",
    delayOnInternetConnectionCheck: 5 * 1000, // 5 sec задержка на опрос состояния интернета

};
