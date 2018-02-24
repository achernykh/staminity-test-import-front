import moment from 'moment/min/moment-with-locales.js';
import { IComponentOptions, IComponentController,ILocationService } from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import { IAgentProfile, IAgentAccount } from "@api/agent";
import { AgentService } from '../agent.service';
import DisplayService from "../../../core/display.service";
import './user-settings-balance.component.scss';

class UserSettingsBalanceCtrl {
    
    // bind
    currentUser: IUserProfile;
    owner: IUserProfile;
    agentProfile: IAgentProfile;
    account: IAgentAccount;

    static $inject = ['DisplayService', 'dialogs', 'message', 'AgentService', '$scope'];

    constructor (
        private displayService: DisplayService,
        private dialogs: any,
        private message: any,
        private agentService: AgentService,
        private $scope: any,
    ) {
        window['UserSettingsBalanceCtrl'] = this;
    }

    withdraw ($event) {
        const noCommissionLimit = this.account['defExtAccount'].limits && this.account['defExtAccount'].limits.noCommissionLimit;
        return this.dialogs.confirm({
            title: "user.settings.agent.balance.withdrawConfirmationHeader",
            text: this.account.balance < noCommissionLimit ? 
                "user.settings.agent.balance.withdrawWithCommissionConfirmation" : 
                "user.settings.agent.balance.withdrawNoCommissionConfirmation",
        })
        .then(() => this.agentService.postAgentWithdrawal({
            account: this.account,
        } as any));
        ;
    }
}

export const UserSettingsBalanceComponent: IComponentOptions = {
    bindings: {
        owner: '<',
        currentUser: '<',
        agentProfile: '<',
        account: '<',
    },
    controller: UserSettingsBalanceCtrl,
    template: require('./user-settings-balance.component.html') as string
} as any;