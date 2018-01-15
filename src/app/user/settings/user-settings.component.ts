import './user-settings.component.scss';
import {IComponentOptions, IComponentController} from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import MessageService from "../../core/message.service";
import { SessionService } from "../../core/session/session.service";
import { UserSettingsService } from "./user-settings.service";

class UserSettingsCtrl implements IComponentController {

    // inject
    static $inject = ['$stateParams', 'message', 'SessionService', 'UserSettingsService'];

    constructor (
        private $stateParams: any,
        private message: MessageService,
        private sessionService: SessionService,
        private userSettingsService: UserSettingsService,
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

    /**
     * Открыта собственная страница настроек
     * @returns {boolean}
     */
    isOwnSettings () : boolean {
        return this.owner.userId !== this.currentUser.userId;
    }
}

export const UserSettingsComponent: IComponentOptions = {
    bindings: {
        
    },
    controller: UserSettingsCtrl,
    controllerAs: '$userSettingsCtrl',
    template: require('./user-settings.component.html') as string
} as any;