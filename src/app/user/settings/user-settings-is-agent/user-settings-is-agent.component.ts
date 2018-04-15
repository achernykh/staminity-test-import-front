import moment from 'moment/min/moment-with-locales.js';
import { IComponentOptions, IComponentController,ILocationService } from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import { AgentService } from '../agent.service';
import DisplayService from "../../../core/display.service";
import './user-settings-is-agent.component.scss';

class UserSettingsIsAgentCtrl {
    
    // bind
    currentUser: IUserProfile;
    owner: IUserProfile;
    agentProfile: any;

    static $inject = ['DisplayService', 'dialogs', 'message', 'AgentService', '$scope'];

    constructor (
        private displayService: DisplayService,
        private dialogs: any,
        private message: any,
        private agentService: AgentService,
        private $scope: any,
    ) {
        window['UserSettingsIsAgentCtrl'] = this;
    }

    /**
     * Неактивность переключателя
     * @returns {boolean}
     */
    isDisabled () : boolean {
        return this.owner.public.isCoach && this.agentProfile.isActive && this.agentProfile.hasPlanPubs;
    }

    /**
     * Геттер-сеттер isAgent
     * @param value?: boolean
     * @returns {boolean | void}
     */
    isAgent (value?: boolean) : boolean | void { 
        if (typeof value === 'undefined') { 
            return this.agentProfile.isActive; 
        } 
 
        this.agentService.putAgentProfile({
            ...this.agentProfile,
            isActive: value,
        }) 
        .then(() => { 
            this.message.toastInfo('settingsSaveComplete'); 
            this.$scope.$apply(); 
        })
        .catch((info) => { 
            this.message.systemWarning(info); 
        }); 
    }
}

export const UserSettingsIsAgentComponent: IComponentOptions = {
    bindings: {
        owner: '<',
        currentUser: '<',
        agentProfile: '<',
    },
    controller: UserSettingsIsAgentCtrl,
    template: require('./user-settings-is-agent.component.html') as string
} as any;