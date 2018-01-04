import {IComponentOptions, IComponentController,ILocationService} from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import './user-settings-main.component.scss';

class UserSettingsMainCtrl {
    
    // bind
    owner: IUserProfile;
    currentUser: IUserProfile;

    static $inject = ['UserService', 'dialogs', 'message', 'UserSettingsService'];

    constructor (
        private userService: any,
        private dialogs: any,
        private message: any,
        private userSettingsService: any,
    ) {
        window['UserSettingsMainCtrl'] = this;
    }

    isOwnSettings () : boolean {
        return this.owner.userId === this.currentUser.userId;
    }

    showChangePassword (event) {
        this.userSettingsService.changePassword(event);
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