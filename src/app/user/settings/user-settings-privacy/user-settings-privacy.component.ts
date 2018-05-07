import {IComponentOptions, IComponentController,ILocationService} from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import { UserSettingsService } from '../user-settings.service';
import { UserSettingsPrivacyDatamodel } from './user-settings-privacy.datamodel';
import './user-settings-privacy.component.scss';

export const privacyLevels = [{id: 50}, {id: 40}, {id: 10}];

class UserSettingsPrivacyCtrl {
    
    // bind
    currentUser: IUserProfile;
    set owner (profile: IUserProfile) {
        this.datamodel = new UserSettingsPrivacyDatamodel(profile);
    };

    // public
    datamodel: UserSettingsPrivacyDatamodel;
    privacyLevels = privacyLevels;
    form: any;

    static $inject = ['UserSettingsService', 'dialogs', 'message'];

    constructor (
        private userSettingsService: UserSettingsService,
        private dialogs: any,
        private message: any,
    ) {

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

export const UserSettingsPrivacyComponent: IComponentOptions = {
    bindings: {
        owner: '<',
        currentUser: '<',
    },
    controller: UserSettingsPrivacyCtrl,
    template: require('./user-settings-privacy.component.html') as string
} as any;