import {IComponentOptions, IComponentController, ILocationService} from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import './user-settings-menu.component.scss';

class UserSettingsMenuCtrl implements IComponentController {
    
    // bind
    owner: IUserProfile;
    currentUser: IUserProfile;
   
    // inject
    static $inject = ['$location'];

    constructor (private $location: ILocationService) {

    }

    isOwnSettings () : boolean {
        return this.owner.userId === this.currentUser.userId;
    }

    go (hash: string) {
        this.$location.hash(hash);
    }
}

export const UserSettingsMenuComponent:IComponentOptions = {
    bindings: {
        owner: '<',
        currentUser: '<',
    },
    controller: UserSettingsMenuCtrl,
    template: require('./user-settings-menu.component.html') as string
};