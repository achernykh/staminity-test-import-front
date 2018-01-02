import {IComponentOptions, IComponentController,ILocationService} from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import './user-settings-notifications.component.scss';

class UserSettingsNotificationsCtrl {
    
    // bind
    owner: IUserProfile;
    currentUser: IUserProfile;

    static $inject = ['UserService', 'dialogs', 'message'];

    constructor (
        private userService: any,
        private dialogs: any,
        private message: any,
    ) {
        window['UserSettingsNotificationsCtrl'] = this;
    }

}

export const UserSettingsNotificationsComponent: IComponentOptions = {
    bindings: {
        owner: '<',
        currentUser: '<',
    },
    controller: UserSettingsNotificationsCtrl,
    template: require('./user-settings-notifications.component.html') as string
} as any;