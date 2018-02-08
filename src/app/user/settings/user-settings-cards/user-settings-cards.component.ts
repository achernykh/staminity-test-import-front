import moment from 'moment/min/moment-with-locales.js';
import { IComponentOptions, IComponentController,ILocationService } from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import { IAgentProfile, IAgentExtAccount } from "@api/agent";
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
        window['UserSettingsCardsCtrl'] = this;
    }
}

export const UserSettingsCardsComponent: IComponentOptions = {
    bindings: {
        owner: '<',
        currentUser: '<',
        agentProfile: '<',
        extAccounts: '<',
    },
    controller: UserSettingsCardsCtrl,
    template: require('./user-settings-cards.component.html') as string
} as any;