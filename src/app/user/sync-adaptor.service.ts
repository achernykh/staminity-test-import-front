import moment from 'moment/min/moment-with-locales.js';
import {
    DeleteUserExternalAccountRequest, PostUserExternalAccountRequest,
    PutUserExternalAccountRequest 
} from "../../../api";
import { SocketService } from "../core";
import { UserSettingsProviderCtrl } from "./settings/user-settings-provider/user-settings-provider.dialog";

export default class SyncAdaptorService {

    static $inject = ["SocketService", "$mdDialog", "$auth"];

    constructor(
        private SocketService: SocketService,
        private $mdDialog: any,
        private $auth: any
    ) {

    }

    /**
     * Удаление настройки синхронизации
     * @param provider
     * @param deleteData
     * @returns {Promise<any>}
     */
    delete(provider: string, deleteData: boolean = false): Promise<any> {
        return this.SocketService.send(new DeleteUserExternalAccountRequest(provider, deleteData));
    }

    /**
     * Измнение настроек синхронизации
     * @param provider
     * @param username
     * @param password
     * @param startDate
     * @param enabled
     * @returns {Promise<any>}
     */
    put(provider: string, username: string, password: string, startDate: Date, state: string): Promise<any> {
        return this.SocketService.send(new PutUserExternalAccountRequest(provider, username, password, startDate, state));
    }

    /**
     * Создание настроек синхронизации
     * @param provider
     * @param username
     * @param password
     * @param startDate
     * @param enabled
     * @returns {Promise<any>}
     */
    post(provider: string, username: string, password: string, startDate: Date): Promise<any> {
        return this.SocketService.send(new PostUserExternalAccountRequest(provider, username, password, startDate));
    }

    /**
     * Создание настроек синхронизации OAuth
     * @param userId
     * @param provider
     * @returns {Promise<any>}
     */
    setupOAuthProvider (userId: number, adaptor: any) : Promise<any> {
        return this.$auth.link(adaptor.provider, {
            internalData: {
                userId: userId,
                startDate: moment().subtract(3,'months'),
                postAsExternalProvider: true,
                provider: adaptor.provider
            }
        });
    }

    /**
     * Диалог настройки сихронизации
     * @param adaptor
     * @returns {Promise<any>}
     */
    showProviderDialog (adaptor: any) : Promise<any> {
        return this.$mdDialog.show({
            controller: UserSettingsProviderCtrl,
            controllerAs: '$ctrl',
            template: require('./settings/user-settings-provider/user-settings-provider.dialog.html'),
            parent: angular.element(document.body),
            locals: {
                adaptor: adaptor
            },
            bindToController: true,
            clickOutsideToClose: true,
            escapeToClose: true,
            fullscreen: false 
        });
    }

}
