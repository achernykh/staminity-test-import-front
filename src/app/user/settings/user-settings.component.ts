import './user-settings.component.scss';
import {IComponentOptions, IComponentController,ILocationService} from 'angular';
import { IUserProfile, IUserProfileShort } from "../../../../api/user/user.interface";
import MessageService from "../../core/message.service";
import AuthService from "../../auth/auth.service";

class UserSettingsCtrl implements IComponentController {

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
        currentUser: '<',
    },
    controller: UserSettingsCtrl,
    controllerAs: '$userSettingsCtrl',
    template: require('./user-settings.component.html') as string
};