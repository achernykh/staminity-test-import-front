import { element } from 'angular';
import { Subject } from "rxjs/Rx";
import { 
    GetAgentEnvironment, GetAgentProfile, PutAgentProfile, GetMonetaBindCardData,
    GetAgentWithdrawals, PostAgentWithdrawal, //CancelAgentWithdrawal,
    GetAgentExtAccounts, PutAgentExtAccount, DeleteAgentExtAccount,
    GetAgentAccountTransactions,
    IAgentProfile, IAgentEnvironment, IAgentWithdrawal, IAgentExtAccount, IAgentAccountTransaction, IMonetaBindCardData,
} from "../../../../api/agent";
import { server, protocol } from "../../core/env.js";
import { replace } from "../../share/utility/replace";
import DisplayService from "../../core/display.service";
import UserService from "../../core/user.service";
import { countriesList } from './user-settings.constants';
import { UserSettingsPasswordCtrl } from './user-settings-password/user-settings-password.dialog';

export class AgentService {

    public updatesProfile = new Subject<IAgentProfile>();
    public updatesEnvironment = new Subject<IAgentEnvironment>();

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
                this.updatesProfile.next(agentProfile);
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
            .then(_ => this.getAgentEnvironment())
            .then(e => this.updatesEnvironment.next(e))
            .catch(e => e && this.message.systemWarning(e));
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
     * Запрос MonetaBindCardData
     * @param {request: IAgentExtAccount}
     * @returns {Promise<IMonetaBindCardData>}
     */
    getMonetaBindCardData(): Promise<IMonetaBindCardData> {
        return this.SocketService.send(new GetMonetaBindCardData());
    }

    /**
     * Добавление карты
     * @returns {Promise<any>}
     */
    addCard(userId: number, agentEnvironment: IAgentEnvironment): Promise<any> {
        return this.getMonetaBindCardData()
        .then((monetaBindCardData) => new Promise((resolve, reject) => {
            const url = 'https://demo.moneta.ru/secureCardData.widget?' + [
                'publicId=a743f28a-8698-43f8-9326-5c40e4edf5d4',
                'MNT_ID=64994513',
                `MNT_TRANSACTION_ID=${monetaBindCardData.MNT_TRANSACTION_ID}`,
                `redirectUrl=${encodeURIComponent(protocol.rest + server)}%2Fapi%2Fpayout%2Fmoneta%2FtokenSwap`,
                `MNT_SIGNATURE=${monetaBindCardData.bindCardSignature}`, 
                'secure%5BCARDNUMBER%5D=required',
                'secure%5BCARDEXPIRATION%5D=required',
                'secure%5BCARDCVV2%5D=required', 
                'formTarget=_self', 
                'MNT_DESCRIPTION=', 
                'process=Submit'
            ].join('&');
            console.debug('agent service add card url', url);

            localStorage.setItem('moneta-result', '');

            const handler = (event) => {
                const result = localStorage.getItem('moneta-result');
                if (result === 'success') {
                    this.$mdDialog.hide(); 
                    resolve();
                } else if (result === 'fail') {
                    reject();
                    this.$mdDialog.hide(); 
                } else if (result === 'inprogress') {
                    resolve();
                    this.$mdDialog.hide(); 
                } else if (result === 'return') {
                    reject('return');
                    this.$mdDialog.hide(); 
                }
            };

            window.addEventListener('storage', handler, false);

            this.dialogs.iframe(url, "user.settings.agent.cards.addCard")
            .then(() => {
                window.removeEventListener('storage', handler, false);
                localStorage.removeItem('moneta-result');
            }, () => {
                window.removeEventListener('storage', handler, false);
                localStorage.removeItem('moneta-result');
                reject('close');
            });
        }));
    }
}
