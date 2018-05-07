import moment from 'moment/min/moment-with-locales.js';
import { IComponentOptions, IComponentController,ILocationService } from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import './user-settings-provider.dialog.scss';

export class UserSettingsProviderCtrl {
    // public
    adaptor: any;

    static $inject = ['$mdDialog'];

    constructor (
        private $mdDialog: any,
    ) {

    }
    
    cancel () {
        this.$mdDialog.cancel();
    };
    
    confirm () {
        this.$mdDialog.hide(this.adaptor);
    };
}
