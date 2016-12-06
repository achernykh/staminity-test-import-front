import { IGroupProfile } from '../group/group.interface'
type TrainingZonesType = 'bpm' | 'power' | 'pace';

export interface IUserProfilePublic {
    avatar: string; // <userId>.jpg без указания всего относительног пути. Только название файла
    background: string; // <userId>.jpg без указания всего относительног пути. Только название файла
    firstName: string;
    lastName: string;
    uri: string; // персональный адрес страницы пользователя. По умолчанию = /user/<userId>
    isPremium: boolean;
    isCoach: boolean;
};

interface IZones {
    id: number;
    code: string;
    validFrom: Date;
    validTo: Date;
}

interface IThresholds {
    id: number;
    code: string;
    validFrom: Date;
    value: number;
}

interface ITrainingZonesActivity {
    name: number;
    unit: string;
    measure: string;
    zones: IZones;
    thresholds: IThresholds;
}

interface ITrainingZonesType {
    type: TrainingZonesType;
    activity: Array<ITrainingZonesActivity>;
}

interface IPrivacy {
    name: string;
    setup: number; // все = 10, друзья = 40, я и тренер = 50
}

interface ITariff {

}

interface IBill {

}

export interface IUserProfile {
    userId: number;
    revision: number;
    public: IUserProfilePublic;
    personal: {
        extEmail?: string;
        phone: string;
        weight: number;
        height: number;
        level: number;
    };
    display: {
        language: string;
        timezone: string;
        units: string;
        timeFormat: string;
        numberFormat: string;
        dateFormat: string;
        firstDayOfWeek: string;
    };
    trainingZonesLastChanged?: Date; // дата + время последнего изменения зон
    trainingZones: Array<ITrainingZonesType>
    privacy: Array<IPrivacy>;
    // настройки синхронизации с внешними провайдерами данных
    externalDataProviders: {
        GarminConnect: {
            login?: string;
            password?: string;
            lastSync?: Date;
            startDate?: Date;
            enabled: boolean;
        };
        Strava: {
            lastSync: Date;
            startDate: Date;
            enabled: boolean;
        };
        PolarFlow: {
            login?: string;
            password?: string;
            lastSync?: Date;
            startDate?: Date;
            enabled: boolean;
        };
        MoveCount: {
            login?: string;
            password?: string;
            lastSync?: Date;
            startDate?: Date;
            enabled: boolean;
        };
    };
    // данные о доступных OAuth аутентификациях
    OAuthData: {
        ProviderName: any; //данные, полученные от OAuth провайдера
    };
    // Billing
    billing: {
        tariffs: Array<ITariff>; // детали по тарифным планам, активным на дату зароса информации из профиля
        bills: Array<IBill>; // счета, срок которых покрывает дату зароса информации из профиля
    };
    // Connections
    connections: {
        coaches: IGroupProfile; // тренеры текущего владельца профиля
        clubs: IGroupProfile; // клубы, в которых состоит владелец профиля
        athletes: IGroupProfile; // атлеты, которых тренирует владелец профиля
        followers: IGroupProfile; // подписчики владельца профиля
        following: IGroupProfile; // подписки владельца профиля
        friends: IGroupProfile; // список друзей владельца профиля
    };
    // Кнопки возможного взаимодействия, доступные посетителю профиля
    availableInteractions: {
        btnStartCoaching: boolean;
        btnStopCoaching: boolean;
        btnCancelCoaching: boolean;
        btnJoinFriends: boolean;
        btnCancelJoinFriends: boolean;
        btnLeaveFriends: boolean;
        btnFollow: boolean;
        btnUnFollow: boolean;
    };
}

/**
 * Краткая версия профиля пользователя
 */
export interface IUserProfileShort {
    userId: number;
    public: IUserProfilePublic;
}