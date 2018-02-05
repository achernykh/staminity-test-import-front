import {IComponentOptions, IComponentController,ILocationService} from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import UserService from "../../../core/user.service";
import { UserSettingsService } from "../user-settings.service";
import './user-settings-main.component.scss';

class UserSettingsMainCtrl {
    
    // bind
    owner: IUserProfile;
    currentUser: IUserProfile;
    agentProfile: any;

    static $inject = ['UserService', 'dialogs', 'message', 'UserSettingsService'];

    constructor (
        private userService: UserService,
        private dialogs: any,
        private message: any,
        private userSettingsService: UserSettingsService,
    ) {
        window['UserSettingsMainCtrl'] = this;
    }

    /**
     * Открыта собственная страница настроек
     * @returns {boolean}
     */
    isOwnSettings () : boolean {
        return this.owner.userId === this.currentUser.userId;
    }

    /**
     * Смена пароля
     * @param event
     */
    showChangePassword (event) {
        this.userSettingsService.changePassword(event);
    }
}

export const UserSettingsMainComponent: IComponentOptions = {
    bindings: {
        owner: '<',
        currentUser: '<',
        agentProfile: '<',
    },
    controller: UserSettingsMainCtrl,
    template: require('./user-settings-main.component.html') as string
} as any;