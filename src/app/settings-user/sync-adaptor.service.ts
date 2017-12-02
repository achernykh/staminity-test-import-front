import {
    DeleteUserExternalAccountRequest, PostUserExternalAccountRequest,
    PutUserExternalAccountRequest } from "../../../api";
import { SocketService} from "../core";

export default class SyncAdaptorService {

    public static $inject = ["SocketService"];

    constructor(private SocketService: SocketService) {

    }

    /**
     * Удаление настройки синхронизации
     * @param provider
     * @param deleteData
     * @returns {Promise<any>}
     */
    public delete(provider: string, deleteData: boolean = false): Promise<any> {
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
    public put(provider: string, username: string, password: string, startDate: Date, state: string): Promise<any> {
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
    public post(provider: string, username: string, password: string, startDate: Date): Promise<any> {
        return this.SocketService.send(new PostUserExternalAccountRequest(provider, username, password, startDate));
    }

}
