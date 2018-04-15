import {IComponentOptions, IComponentController, ILocationService} from 'angular';
import { StateService } from 'angular-ui-router';
import { IUserProfile, IUserProfileShort } from "@api/user";
import { IAgentProfile, IAgentEnvironment } from "@api/agent";
import './user-settings-menu.component.scss';

class UserSettingsMenuCtrl implements IComponentController {
    
    // bind
    owner: IUserProfile;
    currentUser: IUserProfile;
    agentProfile: IAgentProfile;
   
    // inject
    static $inject = ['$location', '$state','$anchorScroll'];

    constructor (
        private $location: ILocationService,
        private $state: StateService,
        private $anchorScroll,
    ) {
        //$anchorScroll.yOffset = 72;
    }

    /**
     * Открыта собственная страница настроек
     * @returns {boolean}
     */
    isOwnSettings () : boolean {
        return this.owner.userId === this.currentUser.userId;
    }

    /**
     * Перейти к секции
     * @param hash: string
     */
    go (hash: string) {
        this.$location.hash(hash);
        this.$anchorScroll();
        //let trans = this.$state.go('user-settings.main', { userId: this.owner.userId, '#': hash }).transition;
        //trans.onSuccess({}, _ => this.$anchorScroll(), {priority: -1});
    } 
}

export const UserSettingsMenuComponent:IComponentOptions = {
    bindings: {
        owner: '<',
        currentUser: '<',
        agentProfile: '<',
    },
    controller: UserSettingsMenuCtrl,
    template: require('./user-settings-menu.component.html') as string
} as any;