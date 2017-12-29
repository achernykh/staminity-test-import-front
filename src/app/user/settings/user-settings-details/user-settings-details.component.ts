import {IComponentOptions, IComponentController,ILocationService} from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import './user-settings-details.component.scss';

class UserSettingsDetailsCtrl {
    
    // bind
    owner: IUserProfile;
    currentUser: IUserProfile;

    static $inject = ['BillingService', 'dialogs', 'message', '$mdDialog'];

    constructor (
        private billingService: any,
        private dialogs: any,
        private message: any,
        private $mdDialog: any,
    ) {

    }
}

export const UserSettingsDetailsComponent: IComponentOptions = {
    bindings: {
        owner: '<',
        currentUser: '<',
    },
    controller: UserSettingsDetailsCtrl,
    template: require('./user-settings-details.component.html') as string
} as any;