import moment from 'moment/min/moment-with-locales.js';
import { IComponentOptions, IComponentController,ILocationService } from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import { IAgentProfile, IAgentWithdrawal } from "@api/agent";
import { UserSettingsService } from '../user-settings.service';
import { AgentService } from '../agent.service';
import DisplayService from "../../../core/display.service";
import './user-settings-withdrawal.component.scss';

class UserSettingsWithdrawalCtrl {
    
    // bind
    currentUser: IUserProfile; 
    agentProfile: IAgentProfile;
    owner: IUserProfile;
    withdrawals: Array<IAgentWithdrawal>;

    // public
    form: any;

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
        window['UserSettingsWithdrawalCtrl'] = this;
    }
}

export const UserSettingsWithdrawalComponent: IComponentOptions = {
    bindings: {
        owner: '<',
        currentUser: '<',
        agentProfile: '<',
        withdrawals: '<',
    },
    controller: UserSettingsWithdrawalCtrl,
    template: require('./user-settings-withdrawal.component.html') as string
} as any;