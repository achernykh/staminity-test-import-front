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

const syncAdaptors = [ 
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

class UserSettingsSyncCtrl {
    
    // bind
    owner: IUserProfile;
    currentUser: IUserProfile;

    adaptors: any[]; 
    toggle = {};

    static $inject = ['SyncAdaptorService', 'dialogs', 'message', '$mdDialog'];

    constructor (
        private syncAdaptorService: any,
        private dialogs: any,
        private message: any,
        private $mdDialog: any,
    ) {
    }

    $onInit () {
        this.adaptors = syncAdaptors.map((adaptor: any) => { 
            let settings = this.owner.externalDataProviders.filter((a) => a.provider === adaptor.provider)[0]; 
            adaptor = (settings && settings) || adaptor; 
            adaptor['status'] = syncStatus(adaptor.lastSync, adaptor.state); 
            adaptor['startDate'] = (adaptor.hasOwnProperty('startDate') && new Date(adaptor.startDate)) || new Date('2017-01-01'); 
            return adaptor; 
        }); 
    }

    syncEnabled (adaptor) { 
        return adaptor.state === "Enabled"; 
    }

    enableStrava (adaptor) {
        this.syncAdaptorService.setupOAuthProvider(this.owner.userId, adaptor)
        .then((response) => {
            // You have successfully linked an account.
            this.updateAdaptor(adaptor, response.data.data);
            console.log('response', response);
            this.toggle[adaptor.provider] = true;
        }, (error) => {
            if (error.hasOwnProperty('stack') && error.stack.indexOf('The popup window was closed') !== -1) {
                this.message.toastInfo('userCancelOAuth');
            } else {
                this.message.toastInfo(error.data.errorMessage || error.errorMessage || error);
            }
            this.toggle[adaptor.provider] = false;
        }).catch(response => {
            // (Handle) errors here.
            console.error('response', response);
            this.message.toastInfo(response);
            this.toggle[adaptor.provider] = false;
        });
    }

    enableGarmin (adaptor) {
        this.syncAdaptorService.showProviderDialog(adaptor)
        .then((form) => {
            if (adaptor.status.code === 'offSyncNeverEnabled') {
                this.syncAdaptorService.post(adaptor.provider, form.username, form.password, form.startDate)
                .then((response) => {
                    this.updateAdaptor(adaptor, response);
                    console.info(response);
                    this.toggle[adaptor.provider] = true;
                }, (error) => {
                    this.message.toastError(error);
                    return true;
                });
            } else { 
                this.syncAdaptorService.put(adaptor.provider, adaptor.username, adaptor.password, form.startDate, "Enabled")
                .then((response) => {
                    this.updateAdaptor(adaptor, response);
                    this.toggle[adaptor.provider] = true;
                }, (error) => {
                    this.message.toastError(error);
                    this.toggle[adaptor.provider] = false;
                });
            }
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
            return this.syncAdaptorService.put(adaptor.provider, adaptor.username, adaptor.password, moment(adaptor.startDate).format('YYYY-MM-DD'), "Disabled")
            .then((response) => {
                this.updateAdaptor(adaptor, response);
                console.info(response);
                this.toggle[adaptor.provider] = false;
            }, (error) => {
                console.error(error);
                this.toggle[adaptor.provider] = true;
            });
        }, (error) => {
            this.toggle[adaptor.provider] = true;
            //adaptor.status.switch = true;
        });
    }

    showProviderSettings (ev, adaptor, toggle) {
        if (!toggle && adaptor.status.switch) {
            this.disableAdaptor(adaptor);
        } else if (toggle && !adaptor.status.switch && adaptor.isOAuth && adaptor.status.code === 'offSyncNeverEnabled') { //2. Подключить OAuth синхронизацию
            this.enableStrava(adaptor);
        } else if (toggle) {
            this.enableGarmin(adaptor);
        }
    }

    updateAdaptor (adaptor, response) { 
        let idx = this.adaptors.findIndex(a => a.provider === adaptor.provider); 
        this.adaptors[idx].state = response.state; 
        this.adaptors[idx].lastSync = response.lastSync; 
        this.adaptors[idx].status = syncStatus(response.lastSync, response.state); 
        //this.$scope.$apply(); 
        this.message.toastInfo('settingsSaveComplete'); 
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