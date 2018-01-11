import {IComponentOptions, IComponentController,ILocationService} from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import UserService from "../../../core/user.service";
import { UserSettingsService } from "../user-settings.service";
import { isCoachProfileComplete } from '../user-settings-coach/user-settings-coach.functions';
import './user-settings-main.component.scss';

class UserSettingsMainCtrl {
    
    // bind
    owner: IUserProfile;
    currentUser: IUserProfile;

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

    /**
     * Заполнен ли профиль тренера
     * @returns {boolean}
     */
    isCoachProfileComplete () : boolean {
        return isCoachProfileComplete(this.currentUser);
    }
}

export const UserSettingsMainComponent: IComponentOptions = {
    bindings: {
        owner: '<',
        currentUser: '<',
    },
    controller: UserSettingsMainCtrl,
    template: require('./user-settings-main.component.html') as string
} as any;