import { element } from 'angular';
import { Subject } from "rxjs/Rx";
import { 
    GetAgentEnvironment, GetAgentProfile, PutAgentProfile, 
    GetAgentWithdrawals, PostAgentWithdrawal, //CancelAgentWithdrawal,
    GetAgentExtAccounts, PutAgentExtAccount, DeleteAgentExtAccount,
    GetAgentAccountTransactions,
    IAgentProfile, IAgentEnvironment, IAgentWithdrawal, IAgentExtAccount, IAgentAccountTransaction,
} from "../../../../api/agent";
import DisplayService from "../../core/display.service";
import UserService from "../../core/user.service";
import { countriesList } from './user-settings.constants';
import { UserSettingsPasswordCtrl } from './user-settings-password/user-settings-password.dialog';

export class AgentService {

    public updates = new Subject<IAgentProfile>();

    static $inject = ['SocketService', '$mdDialog', 'message'];

    constructor (
        private SocketService,
        private $mdDialog,
        private message,
    ) {

    }

    /**
     * Запрос профиля продавца ТП
     * @returns {Promise<IAgentProfile>}
     */
    getAgentProfile() : Promise<IAgentProfile> {
        return this.SocketService.send(new GetAgentProfile());
    }

    /**
     * Изменение профиля продавца ТП
     * @param {profile: IAgentProfile}
     * @returns {Promise<any>}
     */
    putAgentProfile(profile: IAgentProfile) : Promise<any> {
        return this.SocketService.send(new PutAgentProfile(profile))
        .then(() => {
            this.getAgentProfile()
            .then((agentProfile) => {
                this.updates.next(agentProfile);
            });
        });
    }

    /**
     * Запрос IAgentEnvironment
     * @returns {Promise<any>}
     */
    getAgentEnvironment() : Promise<any> {
        return this.SocketService.send(new GetAgentEnvironment());
    }

    /**
     * Реестр поручения на вывод средств
     * @param {limit: number}
     * @param {offset: number}
     * @param {orderBy: string}
     * @param {ascOrder: boolean}
     * @returns {Promise<Array<IAgentWithdrawal>>}
     */
    getAgentWithdrawals(limit: number = 0, offset: number = 0, orderBy: string = '', ascOrder: boolean = false) : Promise<Array<IAgentWithdrawal>> {
        return this.SocketService.send(new GetAgentWithdrawals(limit, offset, orderBy, ascOrder));
    }

    /**
     * Формирование поручения на вывод средств со счета
     * @param {request: IAgentWithdrawal}
     * @returns {Promise<any>}
     */
    postAgentWithdrawal(request: IAgentWithdrawal) : Promise<any> {
        return this.SocketService.send(new PostAgentWithdrawal(request));
    }

    // /**
    //  * Отмена поручения на вывод средств со счета
    //  * @param {request: IAgentWithdrawal}
    //  * @returns {Promise<any>}
    //  */
    // сancelAgentWithdrawal(request: IAgentWithdrawal) : Promise<any> {
    //     return this.SocketService.send(new CancelAgentWithdrawal(request));
    // }

    /**
     * Список доступных средств вывода
     * @returns {Promise<Array<IAgentExtAccount>>}
     */
    getAgentExtAccounts() : Promise<Array<IAgentExtAccount>> {
        return this.SocketService.send(new GetAgentExtAccounts());
    }

    /**
     * Изменение средства вывода денег
     * @param {request: IAgentExtAccount}
     * @returns {Promise<any>}
     */
    putAgentExtAccount(request: IAgentExtAccount) : Promise<any> {
        return this.SocketService.send(new PutAgentExtAccount(request));
    }

    /**
     * Удаление средства вывода денег
     * @param {request: IAgentExtAccount}
     * @returns {Promise<any>}
     */
    deleteAgentExtAccount(request: IAgentExtAccount) : Promise<any> {
        return this.SocketService.send(new DeleteAgentExtAccount(request));
    }

    /**
     * Внесение изменений в профиль продавца планов
     * @param {request: IAgentExtAccount}
     * @returns {Promise<Array<IAgentAccountTransaction>>}
     */
    GetAgentAccountTransactions() : Promise<Array<IAgentAccountTransaction>> {
        return this.SocketService.send(new GetAgentAccountTransactions());
    }
}
