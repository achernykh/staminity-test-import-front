import moment from 'moment/min/moment-with-locales.js';
import { IComponentOptions, IComponentController,ILocationService } from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import { IAgentProfile, IAgentExtAccount, IAgentEnvironment } from "@api/agent";
import { UserSettingsService } from '../user-settings.service';
import { AgentService } from '../agent.service';
import DisplayService from "../../../core/display.service";
import './user-settings-cards.component.scss';

class UserSettingsCardsCtrl {
    
    // bind
    currentUser: IUserProfile; 
    agentProfile: IAgentProfile;
    owner: IUserProfile;
    extAccounts: Array<IAgentExtAccount>;
    agentEnvironment: IAgentEnvironment;

    // public
    form: any;
    currencies = ['RUB', 'USD', 'EUR'];

    static $inject = ['DisplayService', 'dialogs', 'message', 'UserSettingsService', 'AgentService', 'quillConfig', '$scope'];

    constructor (
        private displayService: DisplayService,
        private dialogs: any,
        private message: any,
        private userSettingsService: UserSettingsService,
        private agentService: AgentService,
        private quillConfig: any,
        private $scope: any,
    ) {
        window['UserSettingsCardsCtrl'] = this;
    }

    /**
     * Обновить список
     * @returns {Promise<any>}
     */
    reload(): Promise<any> {
        return this.agentService.getAgentExtAccounts()
        .then((extAccounts) => {
            this.extAccounts = extAccounts;
            this.$scope.$apply();
        });
    }

    /**
     * Еслть ли счета/карты в данной валюте
     * @param {currency: string}
     * @returns {boolean}
     */
    hasAccounts(currency: string): boolean {
        return !!this.extAccounts.find((account) => account.currency === currency);
    }

    /**
     * Счета/карты в данной валюте
     * @param {currency: string}
     * @returns {Array<IAgentExtAccount>}
     */
    getAccounts(currency: string): Array<IAgentExtAccount> {
        return this.extAccounts.filter((account) => account.currency === currency);
    }

    /**
     * Добавить счет/карту
     * @param {currency: string}
     * @returns {Promise<any>}
     */
    addAccount(currency: string): Promise<any> {
        return this.dialogs.confirm({
            title: "user.settings.agent.cards.addCard",
            text: "user.settings.agent.cards.addCardMessage",
        })
        .then(() => this.agentService.addCard(this.currentUser.userId, this.agentEnvironment))
        .then(() => {
            this.reload();
        });
    }

    /**
     * Удалить счет/карту
     * @param {account: IAgentExtAccount}
     * @returns {Promise<any>}
     */
    removeAccount(account: IAgentExtAccount): Promise<any> {
        return this.dialogs.confirm()
        .then(() => this.agentService.deleteAgentExtAccount(account))
        .then(() => {
            this.reload();
        });
    }

    /**
     * Установить аккаунт по умолчанию
     * @param {account: IAgentExtAccount}
     * @returns {Promise<any>}
     */
    setDefaultAccount(account: IAgentExtAccount): Promise<any> {
        return this.dialogs.confirm()
        .then(() => this.agentService.putAgentExtAccount({ ...account, isDefault: true }))
        .then(() => {
            this.reload();
        });
    }
}

export const UserSettingsCardsComponent: IComponentOptions = {
    bindings: {
        owner: '<',
        currentUser: '<',
        agentProfile: '<',
        extAccounts: '<',
        agentEnvironment: '<',
    },
    controller: UserSettingsCardsCtrl,
    template: require('./user-settings-cards.component.html') as string
} as any;