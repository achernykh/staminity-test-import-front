import { PutUserExternalAccount, DeleteUserExternalAccount } from '../../../api/sync/sync.request';
import {ISocketService} from '../core/socket.service';

export default class SyncAdaptorService {

    static $inject = ['SocketService'];

    constructor(private SocketService:ISocketService) {

    }

    /**
     * Удаление настройки синхронизации
     * @param provider
     * @param deleteData
     * @returns {Promise<any>}
     */
    delete(provider:string, deleteData: boolean = false):Promise<any> {
        return this.SocketService.send(new DeleteUserExternalAccount(provider,deleteData));
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
    put(provider:string, username: string, password: string, startDate: Date, enabled: boolean):Promise<any> {
        return this.SocketService.send(new PutUserExternalAccount(provider,username,password,startDate,enabled));
    }


}