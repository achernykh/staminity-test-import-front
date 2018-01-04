import './user-settings.component.scss';
import {IComponentOptions, IComponentController} from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import MessageService from "../../core/message.service";
import AuthService from "../../auth/auth.service";

class UserSettingsCtrl implements IComponentController {

    // inject
    static $inject = ['$stateParams', 'message', 'SessionService'];

    constructor (
        private $stateParams: any,
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

    isOwnSettings () : boolean {
        return !!this.$stateParams.userId;
    }
}

export const UserSettingsComponent: IComponentOptions = {
    bindings: {
        
    },
    controller: UserSettingsCtrl,
    controllerAs: '$userSettingsCtrl',
    template: require('./user-settings.component.html') as string
};