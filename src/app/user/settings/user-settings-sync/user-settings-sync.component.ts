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

    adaptors:any[];

    static $inject = ['SyncAdaptorService', 'dialogs', 'message', '$mdDialog'];

    constructor (
        private syncAdaptorService: any,
        private dialogs: any,
        private message: any,
        private $mdDialog: any,
    ) {
        this.adaptors = syncAdaptors.map((adaptor: any) => {
            // let settings = this.owner.externalDataProviders.filter((a) => a.provider === adaptor.provider)[0];
            // adaptor = (settings && settings) || adaptor;
            // adaptor['status'] = syncStatus(adaptor.lastSync, adaptor.state);
            // adaptor['startDate'] = (adaptor.hasOwnProperty('startDate') && new Date(adaptor.startDate)) || new Date('2017-01-01');
            return adaptor;
        });
    }   


    syncEnabled (adaptor) {
        return adaptor.state === "Enabled";
    }

    showProviderSettings (ev, adaptor, toggle) {

        // //1. Отключить синхронизацию через тумблер switch == off
        // if(!toggle && adaptor.status.switch) {

        //     var confirm = this.$mdDialog.confirm()
        //         .title('Вы хотите отключить синхронизацию?')
        //         .textContent('После отключения данные из внешнего источника останутся доступными, последующие данные синхронизированы не будут. Нажмите "Продолжить" для отключения или "Отменить" для сохранения параметров синхронизации')
        //         .ariaLabel('Lucky day')
        //         .targetEvent(ev)
        //         .ok('Продолжить')
        //         .cancel('Отменить');

        //     this.$mdDialog.show(confirm)
        //         .then(() => this.syncAdaptorService.put(adaptor.provider, adaptor.username, adaptor.password,
        //             moment(adaptor.startDate).format('YYYY-MM-DD'), toggle ? "Enabled" : "Disabled")
        //             .then(response => {
        //                 this.updateAdaptor(adaptor, response);
        //                 console.info(response);
        //                 this.toggle[adaptor.provider] = toggle;
        //             }, error => {
        //                 console.error(error);
        //                 this.toggle[adaptor.provider] = !toggle;
        //             }), (error) => {
        //                 this.toggle[adaptor.provider] = !toggle;
        //                 //adaptor.status.switch = true;
        //             });

        // } else if(toggle && !adaptor.status.switch && adaptor.isOAuth && adaptor.status.code === 'offSyncNeverEnabled') { //2. Подключить OAuth синхронизацию
        //     // Подключение стравы
        //     this.$auth.link(adaptor.provider,{
        //         internalData: {
        //             userId: this.user.userId,
        //             startDate: moment().subtract(3,'months'),
        //             postAsExternalProvider: true,
        //             provider: adaptor.provider
        //         }
        //     }).then(response => {
        //         // You have successfully linked an account.
        //         this.updateAdaptor(adaptor, response.data.data);
        //         console.log('response', response);
        //         this.toggle[adaptor.provider] = toggle;
        //     }, error => {
        //             if (error.hasOwnProperty('stack') && error.stack.indexOf('The popup window was closed') !== -1) {
        //                 this.message.toastInfo('userCancelOAuth');
        //             } else {
        //                 this.message.toastInfo(error.data.errorMessage || error.errorMessage || error);
        //             }
        //             this.toggle[adaptor.provider] = !toggle;
        //         }).catch(response => {
        //             // Handle errors here.
        //             console.error('response', response);
        //             this.message.toastInfo(response);
        //             this.toggle[adaptor.provider] = !toggle;
        //     });
        // } //3. Подключить user/pass синхронизацию или 4. Изменить настройки синхронизации
        // else if(toggle) {
        //     this.$mdDialog.show({
        //         controller: DialogController,
        //         controllerAs: '$ctrl',
        //         template: require('./dialogs/provider.html'),
        //         parent: angular.element(document.body),
        //         targetEvent: ev,
        //         locals: {
        //             adaptor: adaptor
        //         },
        //         bindToController: true,
        //         clickOutsideToClose: true,
        //         escapeToClose: true,
        //         fullscreen: false // Only for -xs, -sm breakpoints.
        //     }).then((form) => {
        //         if (adaptor.status.code === 'offSyncNeverEnabled') {// подключение
        //             this.SyncAdaptorService.post(adaptor.provider, form.username, form.password, form.startDate)
        //                 .then(response => {
        //                 this.updateAdaptor(adaptor, response);
        //                 console.info(response);
        //                 this.toggle[adaptor.provider] = toggle;
        //             },
        //                 error => {
        //                     this.message.toastError(error);
        //                     return !toggle;
        //                 });
        //         } else { // операция изменения данных подключения
        //             this.SyncAdaptorService.put(adaptor.provider, adaptor.username, adaptor.password,
        //                 form.startDate, toggle ? "Enabled" : "Disabled")
        //                 .then(response => {
        //                     this.updateAdaptor(adaptor, response);
        //                     this.toggle[adaptor.provider] = toggle;
        //                 }, error => {
        //                     this.message.toastError(error);
        //                     this.toggle[adaptor.provider] = !toggle;
        //                 });
        //         }
        //     });/*, () => {
        //             // Если диалог открывается по вызову ng-change
        //             if (typeof ev === 'undefined') {
        //                 adaptor.status.switch = false
        //             }
        //             this.status = 'You cancelled the dialog.';
        //         });
        //     }*/
        // } else if (toggle && !adaptor.status.switch && typeof ev === 'undefined') {

        // }

        // return;


        // if (adaptor.status.switch) { // Идет подключение или настройка подключенного провайдера
        //     if(adaptor.isOAuth && adaptor.status.code === 'offSyncNeverEnabled') { // Если идет подключение по OAuth

        //     } else {  // Идет подключение или изменение синхронизации
        //         this.$mdDialog.show({
        //             controller: DialogController,
        //             controllerAs: '$ctrl',
        //             template: require('./dialogs/provider.html'),
        //             parent: angular.element(document.body),
        //             targetEvent: ev,
        //             locals: {
        //                 adaptor: adaptor
        //             },
        //             bindToController: true,
        //             clickOutsideToClose: true,
        //             escapeToClose: true,
        //             fullscreen: false // Only for -xs, -sm breakpoints.
        //         }).then((form) => {
        //             if (adaptor.status.switch) {// операция изменения данных подключения
        //                 this.SyncAdaptorService.post(adaptor.provider, form.username, form.password, form.startDate)
        //                     .then(response => {
        //                         this.updateAdaptor(adaptor, response);
        //                         console.info(response);
        //                     },
        //                     error => {
        //                         this.message.toastError(error);
        //                         adaptor.status.switch = false;
        //                     });
        //             } else { // подключение
        //                 this.SyncAdaptorService.put(adaptor.provider, adaptor.username, adaptor.password,
        //                     form.startDate, adaptor.status.switch ? "Enabled" : "Disabled")
        //                     .then(response => {
        //                         this.updateAdaptor(adaptor, response);
        //                     }, error => this.message.toastError(error));
        //             }
        //         }, () => {
        //             // Если диалог открывается по вызову ng-change
        //             if (typeof ev === 'undefined') {
        //                 adaptor.status.switch = false
        //             }
        //             this.status = 'You cancelled the dialog.';
        //         });
        //     }
        // } else { // Выполняется отлкючение синхронизации
        //     var confirm = this.$mdDialog.confirm()
        //         .title('Вы хотите отключить синхронизацию?')
        //         .textContent('После отключения данные из внешнего источника останутся доступными, последующие данные синхронизированы не будут. Нажмите "Продолжить" для отключения или "Отменить" для сохранения параметров синхронизации')
        //         .ariaLabel('Lucky day')
        //         .targetEvent(ev)
        //         .ok('Продолжить')
        //         .cancel('Отменить');

        //     this.$mdDialog.show(confirm)
        //         .then(() => this.syncAdaptorService.put(adaptor.provider, adaptor.username, adaptor.password,
        //             moment(adaptor.startDate).format('YYYY-MM-DD'), adaptor.status.switch ? "Enabled" : "Disabled")
        //             .then(response => {
        //                 this.updateAdaptor(adaptor, response);
        //                 console.info(response);
        //             }, error => {
        //                 console.error(error);
        //             }), (error) => {
        //                 //adaptor.status.switch = true;
        //             });
        // }
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