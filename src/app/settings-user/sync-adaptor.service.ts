import {
    DeleteUserExternalAccountRequest, PostUserExternalAccountRequest,
    PutUserExternalAccountRequest } from "../../../api";
import { SocketService, RESTService, PostData } from "../core";

export default class SyncAdaptorService {

    static $inject = ["SocketService", "RESTService"];

    constructor(
        private SocketService: SocketService,
        private RESTService: RESTService) {

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
        return this.RESTService.postData(
                new PostData('/api/wsgate',
                new PutUserExternalAccountRequest(provider, username, password, startDate, state)))
            .then(response => response.data);
        //return this.SocketService.send(new PutUserExternalAccountRequest(provider, username, password, startDate, state));
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
        return this.RESTService.postData(
            new PostData('/api/wsgate',
                new PostUserExternalAccountRequest(provider, username, password, startDate)))
            .then(response => response.data);
        //return this.SocketService.send(new PostUserExternalAccountRequest(provider, username, password, startDate));
    }

}
