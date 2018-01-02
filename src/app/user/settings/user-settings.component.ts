import './user-settings.component.scss';
import {IComponentOptions, IComponentController,ILocationService} from 'angular';
import { IUserProfile, IUserProfileShort } from "../../../../api/user/user.interface";
import MessageService from "../../core/message.service";
import AuthService from "../../auth/auth.service";

const menuItems = [{
    icon: "person",
    label: "settings.personalInfo.header",
    hash: "user-settings-profile",
}, {
    icon: "security",
    label: "settings.privacy.header",
    hash: "user-settings-privacy",
}, {
    icon: "dvr",
    label: "settings.display.header",
    hash: "user-settings-display",
}, {
    icon: "vpn_key",
    label: "settings.account.header",
    hash: "user-settings-account",
}, {
    icon: "sync",
    label: "settings.sync.header",
    hash: "user-settings-sync",
}, {
    icon: "straighten",
    label: "settings.zones.header",
    hash: "user-settings-zones",
}, {
    icon: "notifications",
    label: "settings.notification.header",
    hash: "user-settings-notifications",
}];

class UserSettingsCtrl implements IComponentController {

    menuItems = menuItems;

    // inject
    static $inject = ['$stateParams', '$location', '$mdMedia', 'message', 'SessionService'];

    constructor (
        private $stateParams: any,
        private $location: ILocationService,
        private $mdMedia: any,
        private message: MessageService,
        private sessionService: any,
    ) {
        window['UserSettingsCtrl'] = this;
    }

    get currentUser () : IUserProfile {
        return this.sessionService.getUser();
    }

    get athletes () : IUserProfileShort[] {
        return this.currentUser.public.isCoach && this.currentUser.connections.hasOwnProperty('allAthletes') ?
            this.currentUser.connections.allAthletes.groupMembers : [];
    }

    get owner () : IUserProfile | IUserProfileShort {
        const ownerId = Number(this.$stateParams.userId);
        return ownerId && this.athletes.find((user) => user.userId === ownerId) || this.currentUser;
    }
}

export const UserSettingsComponent: IComponentOptions = {
    bindings: {
        
    },
    controller: UserSettingsCtrl,
    controllerAs: '$userSettingsCtrl',
    template: require('./user-settings.component.html') as string
};