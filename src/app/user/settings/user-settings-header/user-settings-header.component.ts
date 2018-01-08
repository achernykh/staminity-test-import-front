import {IComponentOptions, IComponentController,ILocationService} from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import UserService from "../../../core/user.service";
import './user-settings-header.component.scss';

class UserSettingsHeaderCtrl {
    
    // bind
    owner: IUserProfile;
    currentUser: IUserProfile;

    static $inject = ['UserService', 'dialogs', 'message'];

    constructor (
        private userService: UserService,
        private dialogs: any,
        private message: any,
    ) {

    }

    /**
     * Выбор аватара
     */
    uploadAvatar () {
        this.dialogs.uploadPicture()
        .then(picture => this.userService.postProfileAvatar(picture))
        .then((response) => { 
            this.owner = response;
            this.message.toastInfo('updateAvatar');
        })
        .catch((info) => {
            this.message.systemWarning(info);
        });
    }

    /**
     * Выбор фона
     */
    uploadBackground () {
        this.dialogs.uploadPicture()
        .then((picture) => this.userService.postProfileBackground(picture))
        .then((response) => { 
            this.owner = response;
            this.message.toastInfo('updateBackgroundImage');
        })
        .catch((info) => {
            this.message.systemWarning(info);
        });
    }

}

export const UserSettingsHeaderComponent: IComponentOptions = {
    bindings: {
        owner: '<',
        currentUser: '<',
    },
    controller: UserSettingsHeaderCtrl,
    template: require('./user-settings-header.component.html') as string
} as any;