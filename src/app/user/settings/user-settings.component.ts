import './user-settings.component.scss';
import {IComponentOptions, IComponentController, IScope} from 'angular';
import { IUserProfile, IUserProfileShort } from "@api/user";
import { IAgentProfile, IAgentEnvironment, IAgentWithdrawal, IAgentExtAccount, IAgentAccountTransaction } from "@api/agent";
import MessageService from "../../core/message.service";
import { SessionService } from "../../core/session/session.service";
import { UserSettingsService } from "./user-settings.service";
import { AgentService } from "./agent.service";

class UserSettingsCtrl implements IComponentController {

    // binding
    userId: number;
    owner: IUserProfile | IUserProfileShort;
    agentProfile: IAgentProfile;
    agentEnvironment: IAgentEnvironment;

    // inject
    static $inject = ['$scope', '$anchorScroll', '$stateParams', '$mdMedia', 'message', 'SessionService',
        'UserSettingsService', 'AgentService'];

    constructor (
        private $scope: IScope,
        private $anchorScroll,
        private $stateParams: any,
        private $mdMedia: any,
        private message: MessageService,
        private sessionService: SessionService,
        private userSettingsService: UserSettingsService,
        private agentService: AgentService,
    ) {
        window['UserSettingsCtrl'] = this;
        $anchorScroll.yOffset = 72;
        userSettingsService.updates.subscribe((userProfile) => {
            if (userProfile.userId === this.userId) {
                this.owner = userProfile;
            }
            this.$scope.$applyAsync();
        });
        agentService.updates.subscribe((agentProfile) => {
            this.agentProfile = agentProfile;
            this.$scope.$applyAsync();
        });
    }

    $onInit(): void {
        this.$anchorScroll();
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

    /**
     * Мобильная вёрстка
     * @returns {boolean}
     */
    isMobileLayout(): boolean {
        return this.$mdMedia(`(max-width: 959px)`);
    }
}

export const UserSettingsComponent: IComponentOptions = {
    bindings: {
        userId: '<',
        owner: '<',
        agentProfile: '<',
        agentEnvironment: '<',
    },
    controller: UserSettingsCtrl,
    controllerAs: '$userSettingsCtrl',
    template: require('./user-settings.component.html') as string
} as any;