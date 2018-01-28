import moment from 'moment/min/moment-with-locales.js';
import { IComponentOptions, IComponentController,ILocationService } from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import { UserSettingsService } from '../user-settings.service';
import DisplayService from "../../../core/display.service";
import './user-settings-is-agent.component.scss';

class UserSettingsIsAgentCtrl {
    
    // bind
    currentUser: IUserProfile;
    owner: IUserProfile;

    static $inject = ['DisplayService', 'dialogs', 'message', 'UserSettingsService', '$scope'];

    constructor (
        private displayService: DisplayService,
        private dialogs: any,
        private message: any,
        private userSettingsService: UserSettingsService,
        private $scope: any,
    ) {
        window['UserSettingsIsCoachCtrl'] = this;
    }

    get isAvailable () : boolean {
        return true;
    }

    /**
     * Геттер-сеттер isAgent
     * @param value?: boolean
     * @returns {boolean | void}
     */
    isAgent (value?: boolean) : boolean | void { 
        if (typeof value === 'undefined') { 
            return this.owner.public['isAgent']; 
        } 
 
        this.userSettingsService.saveSettings({ 
            userId: this.owner.userId,
            revision: this.owner.revision,
            public: { 
                ...this.owner.public,
                isAgent: value,
            },
        }) 
        .then(() => { 
            this.owner.public['isAgent'] = value; 
            this.message.toastInfo('settingsSaveComplete'); 
            this.$scope.$apply(); 
        }) 
        .catch((info) => { 
            this.message.systemWarning(info); 
        }); 
    }

    /* 
     * Перезагрузить профиль
     */
    reload () {
        this.userSettingsService.reload(this.owner.userId); 
    }
}

export const UserSettingsIsAgentComponent: IComponentOptions = {
    bindings: {
        owner: '<',
        currentUser: '<',
    },
    controller: UserSettingsIsAgentCtrl,
    template: require('./user-settings-is-agent.component.html') as string
} as any;