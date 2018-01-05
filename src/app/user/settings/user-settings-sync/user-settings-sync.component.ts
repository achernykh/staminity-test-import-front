import moment from 'moment/min/moment-with-locales.js';
import * as momentTimezone from 'moment-timezone';
import {IComponentOptions, IComponentController, ILocationService} from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import { ExternalProviderState } from "../../../../../api/sync";
import './user-settings-sync.component.scss';

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

class UserSettingsSyncCtrl {
    
    // bind
    owner: IUserProfile;
    currentUser: IUserProfile;

    adaptors = ["garmin", "strava"];

    static $inject = ['SyncAdaptorService', 'dialogs', 'message', '$mdDialog'];

    constructor (
        private syncAdaptorService: any,
        private dialogs: any,
        private message: any,
        private $mdDialog: any,
    ) {

    }

    isAdaptorEnabled (adaptor: string) : boolean {
        return false;
    }

    adaptorStatus (adaptor: string) : string {
        return "offSyncNeverEnabled";
    }

    handleSelectAdaptor (adaptor: string) {
        
    }

    adaptorState (adaptor: string) {
        return (value?: boolean) => {
            const isEnabled = this.isAdaptorEnabled(adaptor);

            if (typeof value === 'undefined') {
                return isEnabled;
            }

            if (!isEnabled && value) {
                this.enableAdaptor(adaptor);
            } else if (isEnabled && !value) {
                this.disableAdaptor(adaptor);
            }
        };
    }

    enableAdaptor (adaptor) {
        this.syncAdaptorService.showProviderDialog()
        .then(() => {
            this.message.toastInfo('settingsSaveComplete');
        });
    }

    disableAdaptor (adaptor) {
        const confirm = this.$mdDialog.confirm()
        .title('Вы хотите отключить синхронизацию?')
        .textContent('После отключения данные из внешнего источника останутся доступными, последующие данные синхронизированы не будут. Нажмите "Продолжить" для отключения или "Отменить" для сохранения параметров синхронизации')
        .ok('Продолжить')
        .cancel('Отменить');

        this.$mdDialog.show(confirm)
        .then(() => {
            return this.syncAdaptorService.put(adaptor.provider, adaptor.username, adaptor.password, moment(adaptor.startDate).format('YYYY-MM-DD'), adaptor.status.switch ? "Enabled" : "Disabled");
        });
    }
}

export const UserSettingsSyncComponent: IComponentOptions = {
    bindings: {
        owner: '<',
        currentUser: '<',
    },
    controller: UserSettingsSyncCtrl,
    template: require('./user-settings-sync.component.html') as string
} as any;