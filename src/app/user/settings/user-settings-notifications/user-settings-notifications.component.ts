import {IComponentOptions, IComponentController,ILocationService} from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import { UserSettingsService } from '../user-settings.service';
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
    form: any;

    static $inject = ['UserSettingsService', 'dialogs', 'message'];

    constructor (
        private userSettingsService: UserSettingsService,
        private dialogs: any,
        private message: any,
    ) {
        window['UserSettingsNotificationsCtrl'] = this;
    }

    /**
     * Сохранить
     */
    submit () {
        this.userSettingsService.saveSettings(this.datamodel.toUserProfile())
        .then((result) => {
            this.form.$setPristine(true);
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