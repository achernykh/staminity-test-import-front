import {IComponentOptions, IComponentController,ILocationService} from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import { UserSettingsPrivacyDatamodel } from './user-settings-privacy.datamodel';
import './user-settings-privacy.component.scss';

const privacyLevels = [{id: 50}, {id: 40}, {id: 10}];

class UserSettingsPrivacyCtrl {
    
    // bind
    currentUser: IUserProfile;
    set owner (profile: IUserProfile) {
        this.datamodel = new UserSettingsPrivacyDatamodel(profile);
    };

    // public
    datamodel: UserSettingsPrivacyDatamodel;
    privacyLevels = privacyLevels;

    static $inject = ['UserService', 'dialogs', 'message'];

    constructor (
        private userService: any,
        private dialogs: any,
        private message: any,
    ) {

    }

    submit () {
        this.userService.putProfile(this.datamodel.toUserProfile())
        .then((result) => {

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