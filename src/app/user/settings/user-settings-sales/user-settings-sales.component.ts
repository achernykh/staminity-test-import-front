import moment from 'moment/min/moment-with-locales.js';
import { IComponentOptions, IComponentController,ILocationService } from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import { IAgentProfile, IAgentAccountTransaction } from "@api/agent";
import { UserSettingsService } from '../user-settings.service';
import { AgentService } from '../agent.service';
import DisplayService from "../../../core/display.service";
import './user-settings-sales.component.scss';

class UserSettingsSalesCtrl {
    
    // bind
    currentUser: IUserProfile; 
    agentProfile: IAgentProfile;
    owner: IUserProfile;
    transactions: Array<IAgentAccountTransaction>;

    // public
    form: any;
    currencies = ['RUB', 'USD'];

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
        window['UserSettingsSalesCtrl'] = this;
    }

    /**
     * Итого 
     * @param {currency: string}
     * @returns {number}
     */
    getTotal(currency: string): number {
        return this.transactions
        .filter((transaction) => transaction.account.currency === currency)
        .reduce((sum, transaction) => sum + transaction.grossAmount, 0);
    }
}

export const UserSettingsSalesComponent: IComponentOptions = {
    bindings: {
        owner: '<',
        currentUser: '<',
        agentProfile: '<',
        transactions: '<',
    },
    controller: UserSettingsSalesCtrl,
    template: require('./user-settings-sales.component.html') as string
} as any;