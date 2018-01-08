import {IComponentOptions, IComponentController,ILocationService} from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import UserService from "../../../core/user.service";
import { UserSettingsNotificationsDatamodel, groups } from './user-settings-notifications.datamodel';
import './user-settings-notifications.component.scss';

class UserSettingsNotificationsCtrl {
    
    // bind
    currentUser: IUserProfile;
    set owner (profile: IUserProfile) {
        this.datamodel = new UserSettingsNotificationsDatamodel(profile);
    };

    // public
    groups = groups;
    datamodel: UserSettingsNotificationsDatamodel;

    static $inject = ['UserService', 'dialogs', 'message'];

    constructor (
        private userService: UserService,
        private dialogs: any,
        private message: any,
    ) {
        window['UserSettingsNotificationsCtrl'] = this;
    }

    /**
     * Сохранить
     */
    submit () {
        this.userService.putProfile(this.datamodel.toUserProfile())
        .then((result) => {

        }, (error) => {

        });
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