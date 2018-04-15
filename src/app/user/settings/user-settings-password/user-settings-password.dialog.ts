import moment from 'moment/min/moment-with-locales.js';
import { IComponentOptions, IComponentController,ILocationService } from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import './user-settings-password.dialog.scss';

export class UserSettingsPasswordCtrl {
    // public
    pass1 = '';
    pass2 = '';
    passwordStrength = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    static $inject = ['$mdDialog'];

    constructor (
        private $mdDialog: any,
    ) {

    }
    
    cancel () {
        this.$mdDialog.cancel();
    };
    
    confirm () {
        this.$mdDialog.hide(this.pass1);
    };
}
