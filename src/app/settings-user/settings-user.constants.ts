
import {ExternalProviderState} from "../../../api/sync/sync.interface";

export const _UNITS = ["metric", "imperial"];

export const _DELIVERY_METHOD = [{
    id: "W",
    name: "web",
}, {
    id: "P",
    name: "phone",
}, {
    id: "E",
    name: "email",
}];

export const _CalculationMethod = {
    heartRate: [{
        type: "lactateThreshold",
        method: ["JoeFrielHeartRateRunning7", "JoeFrielHeartRateCycling7"],
    }, {
        type: "restingAndMax",
        method: ["Karvonen5"],
    }, {
        type: "max",
        method: ["Yansen6"],
    }, {
        type: "custom",
        method: ["5", "7", "9"],
    }],
    power: [{
        type: "powerThreshold",
        method: ["AndyCoggan6"],
    }, {
        type: "custom",
        method: ["5", "7", "9"],
    }],
    speed: [
        {
            type: "paceThreshold",
            method: ["JoeFrielSpeed7"],
        }, {
            type: "custom",
            method: ["5", "7", "9"],
        },
    ],
};

export const _SYNC_ADAPTORS = [
    {
        provider: "garmin",
        isOAuth: false,
        state: ExternalProviderState.Disabled,
    },
    {
        provider: "strava",
        state: ExternalProviderState.Disabled,
        isOAuth: true,
    }, /*,
    {
        provider: 'polar',
        state: ExternalProviderState.Disabled,
        isOAuth: false
    }*/
];

const _SYNC_ADAPTORS_STATUS = {
    offNeverEnabled: {
        code: "offNeverEnabled",
        switch: false,
    },
    offEnabledEarly: {},
    onSyncing: {},
    onSyncComplete: {},
    ofSyncError: {},
};

export const syncStatus = (last, state) => {

    const status = {
        offSyncNeverEnabled: {
            code: "offSyncNeverEnabled",
            switch: false,
        },
        offSyncEnabledEarly: {
            code: "offSyncEnabledEarly",
            switch: false,
        },
        onSyncing: {
            code: "onSyncing",
            switch: true,
        },
        onSyncComplete: {
            code: "onSyncComplete",
            switch: true,
        },
        offSyncError: {
            code: "offSyncError",
            switch: false,
        },
        offSyncUnauthorized: {
            code: "offSyncUnauthorized",
            switch: false,
        },
        onSyncCreate: {
            code: "onSyncCreate",
            switch: true,
        },
        onSyncPendingRequest: {
            code: "onSyncCreate",
            switch: true,
        },
        onCheckRequisites: {
            code: "onSyncCreate",
            switch: true,
        },
    };

    // Статус 1: Интеграция выключена и ранее не выполнялась
    if (typeof last === "undefined" && (state === "Disabled" || typeof state === "undefined")) {
        return status.offSyncNeverEnabled;
    }

    // Статус 2: Интеграция выключена после того, как была ранее выполнена
    if (state === "Disabled") {
        return status.offSyncEnabledEarly;
    }

    // Статус 3: Интеграция включена, выполняется начальная синхронизация
    if (typeof last === "undefined" && state === "Enabled") {
        return status.onSyncing;
    }

    // Статус 4: Интеграция включена, синхронизация выполнена
    if (typeof last !== "undefined" && state === "Enabled") {
        return status.onSyncComplete;
    }

    // Статус 5: Интеграция выключена, ошибки авторизации
    if (state === "Unauthorized") {
        return status.offSyncUnauthorized;
    }

    //  Статус 6: Формирование запроса на соединение аккаунтов
    if (state === "Created") {
        return status.onSyncCreate;
    }

    //  Статус 7: Ожидается присоединение аккаунта пользователя к аккаунту сервсиа
    if (state === "PendingRequest") {
        return status.onSyncPendingRequest;
    }

    // Статус 8: Проверка реквизитов подключения
    if (state === "CheckRequisites") {
        return status.onCheckRequisites;
    }

};
