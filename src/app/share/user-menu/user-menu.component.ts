import { IComponentOptions, IComponentController, ILocationService} from 'angular';
import { UserMenuSettings } from '../application-menu/application-menu.constants';
import {IUserProfile} from "../../../../api";
import { SessionService, getUser } from "../../core";
import { Subject } from "rxjs/Rx";
import {StateService} from "angular-ui-router";
import DisplayService from "../../core/display.service";

class UserMenuCtrl implements IComponentController{

    private menu: Array<any> = UserMenuSettings;
    private user: IUserProfile;
    private destroy = new Subject();

    static $inject = ['$mdSidenav','$location','SessionService', '$state', 'DisplayService'];

    constructor(
        private $mdSidenav: any,
        private $location: ILocationService,
        private SessionService: SessionService,
        private $state: StateService,
        private display: DisplayService
    ) {
        SessionService.getObservable()
        .takeUntil(this.destroy)
        .map(getUser)
        .subscribe((userProfile) => {
            this.user = userProfile;
        });
    }

    $onDestroy() {
        this.destroy.next(); 
        this.destroy.complete();
    }

    onUserMenu($mdOpenMenu, ev){
        let originatorEv = ev;
        $mdOpenMenu(ev);
    }

    transitionToState(url) {
        if (this.$state.current.name === url) {
            return;
        }
        if(url.includes('http')) {
            window.open(url);
        } else {
            if (url !== 'user' && url !== 'settings/user') {
                this.$state.go(url);
            } else {
                this.$state.go(url,{uri: this.user.public.uri});
            }
        }
    }
}

let UserMenuComponent: IComponentOptions = {
    bindings: {
        id: '<'
    },
    transclude: false,
    controller: UserMenuCtrl,
    template: require('./user-menu.template.html') as string
};
export default UserMenuComponent;