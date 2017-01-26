import { IComponentOptions, IComponentController, ILocationService} from 'angular';
import { UserMenuSettings } from '../application-menu/application-menu.constants';
import {IUserProfile} from "../../../../api/user/user.interface";
import SessionService from "../../core/session.service";
import { Observable} from 'rxjs/Observable';
import {StateService} from "angular-ui-router";

class UserMenuCtrl implements IComponentController{

    private menu: Array<any> = UserMenuSettings;
    private user: IUserProfile;
    private profile$: Observable<IUserProfile>;

    static $inject = ['$mdSidenav','$location','SessionService', '$state'];

    constructor(
        private $mdSidenav: any,
        private $location: ILocationService,
        private SessionService: SessionService,
        private $state: StateService) {

        this.profile$ = SessionService.profile.subscribe(profile=> {
            this.user = angular.copy(profile);
        });
    }

    onUserMenu($mdOpenMenu, ev){
        let originatorEv = ev;
        $mdOpenMenu(ev);
    }

    transitionToState(url) {
        console.log('goto', url, this.user.public.uri);
        (url !== 'user' && url !== 'settings/user') ? this.$state.go(url) : this.$state.go(url,{uri: this.user.public.uri});
    }


}

let UserMenuComponent:IComponentOptions = {
    bindings: {
        id: '<'
    },
    transclude: false,
    controller: UserMenuCtrl,
    template: require('./user-menu.template.html') as string
};
export default UserMenuComponent;