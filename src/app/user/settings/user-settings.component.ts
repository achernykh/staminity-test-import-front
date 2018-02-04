import './user-settings.component.scss';
import {IComponentOptions, IComponentController} from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import MessageService from "../../core/message.service";
import { SessionService } from "../../core/session/session.service";
import { UserSettingsService } from "./user-settings.service";
import { AgentService } from "./agent.service";

class UserSettingsCtrl implements IComponentController {

    // binding
    userId: number;
    owner: IUserProfile | IUserProfileShort;
    agentProfile: any;

    // inject
    static $inject = ['$scope', '$stateParams', 'message', 'SessionService', 'UserSettingsService', 'AgentService'];

    constructor (
        private $scope: any,
        private $stateParams: any,
        private message: MessageService,
        private sessionService: SessionService,
        private userSettingsService: UserSettingsService,
        private agentService: AgentService,
    ) {
        window['UserSettingsCtrl'] = this;
        userSettingsService.updates.subscribe((userProfile) => {
            if (userProfile.userId === this.userId) {
                this.owner = userProfile;
            }
            this.$scope.$apply();
        });
        agentService.updates.subscribe((agentProfile) => {
            this.agentProfile = agentProfile;
            this.$scope.$apply();
        });
    }

    get currentUser () : IUserProfile {
        return this.sessionService.getUser();
    }

    get athletes () : IUserProfileShort[] {
        return this.currentUser.public.isCoach && this.currentUser.connections.hasOwnProperty('allAthletes') ?
            this.currentUser.connections.allAthletes.groupMembers : [];
    }

    /**
     * Открыта собственная страница настроек
     * @returns {boolean}
     */
    isOwnSettings () : boolean {
        return this.currentUser.userId === this.userId;
    }
}

export const UserSettingsComponent: IComponentOptions = {
    bindings: {
        userId: '<',
        owner: '<',
        agentProfile: '<',
    },
    controller: UserSettingsCtrl,
    controllerAs: '$userSettingsCtrl',
    template: require('./user-settings.component.html') as string
} as any;