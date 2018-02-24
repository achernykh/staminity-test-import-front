import { element } from 'angular';
import { Subject } from "rxjs/Rx";
import { 
    GetAgentEnvironment, GetAgentProfile, PutAgentProfile, 
    GetAgentWithdrawals, PostAgentWithdrawal, //CancelAgentWithdrawal,
    GetAgentExtAccounts, PutAgentExtAccount, DeleteAgentExtAccount,
    GetAgentAccountTransactions,
    IAgentProfile, IAgentEnvironment, IAgentWithdrawal, IAgentExtAccount, IAgentAccountTransaction,
} from "../../../../api/agent";
import { server, protocol } from "../../core/env.js";
import { replace } from "../../share/utility/replace";
import DisplayService from "../../core/display.service";
import UserService from "../../core/user.service";
import { countriesList } from './user-settings.constants';
import { UserSettingsPasswordCtrl } from './user-settings-password/user-settings-password.dialog';

export class AgentService {

    public updates = new Subject<IAgentProfile>();

    static $inject = ['SocketService', '$mdDialog', 'message', 'dialogs'];

    constructor (
        private SocketService,
        private $mdDialog,
        private message,
        private dialogs,
    ) {

    }

    /**
     * Запрос профиля продавца ТП
     * @returns {Promise<IAgentProfile>}
     */
    getAgentProfile(): Promise<IAgentProfile> {
        return this.SocketService.send(new GetAgentProfile());
    }

    /**
     * Изменение профиля продавца ТП
     * @param {profile: IAgentProfile}
     * @returns {Promise<any>}
     */
    putAgentProfile(profile: IAgentProfile): Promise<any> {
        return this.SocketService.send(new PutAgentProfile(profile))
        .then(() => {
            this.getAgentProfile()
            .then((agentProfile) => {
                this.updates.next(agentProfile);
            });
        })
        .catch((info) => { 
           this.message.systemWarning(info); 
       }); 
    }

    /**
     * Запрос IAgentEnvironment
     * @returns {Promise<any>}
     */
    getAgentEnvironment(): Promise<any> {
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
    getAgentWithdrawals(limit: number = 100, offset: number = 0, orderBy: string = '', ascOrder: boolean = false): Promise<Array<IAgentWithdrawal>> {
        return this.SocketService.send(new GetAgentWithdrawals(limit, offset, orderBy, ascOrder))
        .then((response) => response.arrayResult);
    }

    /**
     * Формирование поручения на вывод средств со счета
     * @param {request: IAgentWithdrawal}
     * @returns {Promise<any>}
     */
    postAgentWithdrawal(request: IAgentWithdrawal): Promise<any> {
        return this.SocketService.send(new PostAgentWithdrawal(request))
       .catch((info) => { 
           this.message.systemWarning(info); 
       }); 
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
    getAgentExtAccounts(): Promise<Array<IAgentExtAccount>> {
        return this.SocketService.send(new GetAgentExtAccounts())
        .then((response) => response.arrayResult);
    }

    /**
     * Изменение средства вывода денег
     * @param {request: IAgentExtAccount}
     * @returns {Promise<any>}
     */
    putAgentExtAccount(request: IAgentExtAccount): Promise<any> {
        return this.SocketService.send(new PutAgentExtAccount(request))
       .catch((info) => { 
           this.message.systemWarning(info); 
       }); 
    }

    /**
     * Удаление средства вывода денег
     * @param {request: IAgentExtAccount}
     * @returns {Promise<any>}
     */
    deleteAgentExtAccount(request: IAgentExtAccount): Promise<any> {
        return this.SocketService.send(new DeleteAgentExtAccount(request))
       .catch((info) => { 
           this.message.systemWarning(info); 
       }); 
    }

    /**
     * Внесение изменений в профиль продавца планов
     * @param {request: IAgentExtAccount}
     * @returns {Promise<Array<IAgentAccountTransaction>>}
     */
    getAgentAccountTransactions(): Promise<Array<IAgentAccountTransaction>> {
        return this.SocketService.send(new GetAgentAccountTransactions())
        .then((response) => response.arrayResult);
    }

    /**
     * Добавление карты
     * @returns {Promise<any>}
     */
    addCard(userId: number, bindCardSignature: string): Promise<any> {
        const url = `https://demo.moneta.ru/secureCardData.htm?publicId=a743f28a-8698-43f8-9326-5c40e4edf5d4&MNT_ID=64994513&MNT_TRANSACTION_ID=BIND_CARD.${userId}&redirectUrl=${encodeURIComponent(protocol.rest + server)}%2Fapi%2Fpayout%2Fmoneta%2FtokenSwap&MNT_SIGNATURE=${bindCardSignature}&secure%5BCARDNUMBER%5D=required&secure%5BCARDEXPIRATION%5D=required&secure%5BCARDCVV2%5D=required&formTarget=_top&MNT_DESCRIPTION=&process=Submit`;
        return this.dialogs.iframe(url, "user.settings.agent.cards.addCard");
    }
}
