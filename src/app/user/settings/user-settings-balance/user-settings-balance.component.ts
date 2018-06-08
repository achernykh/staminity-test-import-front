import { IComponentOptions } from "angular";
import { IUserProfile } from "@api/user";
import { IAgentProfile, IAgentAccount } from "@api/agent";
import { AgentService } from "../agent.service";
import DisplayService from "../../../core/display.service";
import "./user-settings-balance.component.scss";
import MessageService from "../../../core/message.service";

class UserSettingsBalanceCtrl {

    // bind
    currentUser: IUserProfile;
    owner: IUserProfile;
    agentProfile: IAgentProfile;
    account: IAgentAccount;

    static $inject = ['DisplayService', 'dialogs', 'message', 'AgentService', '$scope'];

    constructor (private displayService: DisplayService,
                 private dialogs: any,
                 private message: MessageService,
                 private agentService: AgentService,
                 private $scope: any,) {
        window['UserSettingsBalanceCtrl'] = this;
    }

    withdraw ($event) {
        const noCommissionLimit = this.account['defExtAccount'].limits && this.account['defExtAccount'].limits.noCommissionLimit;
        return this.dialogs.confirm({
            title: "user.settings.agent.balance.withdrawConfirmationHeader",
            text: this.account.balance < noCommissionLimit ?
            "user.settings.agent.balance.withdrawWithCommissionConfirmation." + this.account.currency :
            "user.settings.agent.balance.withdrawNoCommissionConfirmation." + this.account.currency,
        })
            .then(() => this.agentService.postAgentWithdrawal({ account: this.account, } as any))
            .then(() => this.message.toastInfo('agentWithdrawComplete'), e => e && this.message.toastError(e));
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