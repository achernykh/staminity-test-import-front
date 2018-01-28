import moment from 'moment/min/moment-with-locales.js';
import { IComponentOptions, IComponentController,ILocationService } from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import { UserSettingsService } from '../user-settings.service';
import DisplayService from "../../../core/display.service";
import './user-settings-is-coach.component.scss';

class UserSettingsIsCoachCtrl {
    
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
     * Геттер-сеттер isCoach
     * @param value?: boolean
     * @returns {boolean | void}
     */
    isCoach (value?: boolean) : boolean | void { 
        if (typeof value === 'undefined') { 
            return this.owner.public['isCoach']; 
        } 
 
        this.userSettingsService.saveSettings({ 
            userId: this.owner.userId,
            revision: this.owner.revision,
            public: { 
                ...this.owner.public,
                isCoach: value,
            },
        }) 
        .then(() => { 
            this.owner.public['isCoach'] = value; 
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

export const UserSettingsIsCoachComponent: IComponentOptions = {
    bindings: {
        owner: '<',
        currentUser: '<',
    },
    controller: UserSettingsIsCoachCtrl,
    template: require('./user-settings-is-coach.component.html') as string
} as any;