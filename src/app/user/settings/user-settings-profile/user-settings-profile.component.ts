import moment from 'moment/min/moment-with-locales.js';
import { IComponentOptions, IComponentController,ILocationService } from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import { UserSettingsProfileDatamodel } from './user-settings-profile.datamodel';
import './user-settings-profile.component.scss';

class UserSettingsProfileCtrl {
    
    // bind
    currentUser: IUserProfile;    
    set owner (profile: IUserProfile) {
        this.datamodel = new UserSettingsProfileDatamodel(profile);
    };

    // public
    datamodel: UserSettingsProfileDatamodel;
    form: any;

    static $inject = ['UserService', 'dialogs', 'message'];

    constructor (
        private userService: any,
        private dialogs: any,
        private message: any,
    ) {

    }

    isDirty () : boolean {
        return true;//this.form.isDirty;
    }

    isValid () : boolean {
        return this.form.isValid;
    }

    submit () {
        this.userService.putProfile(this.datamodel.toUserProfile())
        .then((result) => {

        }, (error) => {

        });
    }
 
    getDateFormat () { 
        return moment().format('L'); 
    } 
}

export const UserSettingsProfileComponent: IComponentOptions = {
    bindings: {
        owner: '<',
        currentUser: '<',
    },
    controller: UserSettingsProfileCtrl,
    template: require('./user-settings-profile.component.html') as string
} as any;