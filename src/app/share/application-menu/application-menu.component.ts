import * as angular from 'angular';
import { IComponentOptions, IComponentController} from 'angular';
import { UserMenuSettings, AppMenuSettings } from './application-menu.constants';
import {StateService} from "angular-ui-router";
import {IUserProfile} from "../../../../api/user/user.interface";
import { Observable} from 'rxjs/Observable';
import './application-menu.component.scss';
import SessionService from "../../core/session.service";

class ApplicationMenuCtrl implements IComponentController{

    private appmenu: Array<any> = AppMenuSettings;
    private usermenu: Array<any> = UserMenuSettings;
    private user: IUserProfile;
    private profile$: Observable<IUserProfile>;
    public showUserMenu: boolean = false;

    static $inject = ['$mdSidenav','AuthService','SessionService','$state'];

    constructor(
        private $mdSidenav: any,
        private AuthService: any,
        private SessionService: SessionService,
        private $state: StateService) {

        this.profile$ = SessionService.profile.subscribe(profile=> this.user = angular.copy(profile));
    }

    avatarUrl() {
        //return _connection.content + (this.user? '/content/user/avatar/' + this.user.public.avatar : '/assets/avatar/default.png')
    }

    backgroundUrl() {
        //return _connection.content + (this.user? '/content/user/background/' + this.user.public.background : '/assets/picture/pattern0.jpg')
    }

    toggleSlide(){
        this.$mdSidenav("appmenu").toggle().then(() => angular.noop);
    }

    checkAuth(role) {
        return this.AuthService.isAuthorized(role).then(()=> {return true;}, ()=> {return false;});
    }

    transitionToState(url, param) {
        if (this.$state.current.name === url && param === this.$state.params['uri']) {
            return;
        }
        if(url.includes('http')) {
            window.open(url);
        } else if (!param){
            if (url !== 'user' && url !== 'settings/user' && url !== 'calendar') {
                this.$state.go(url);
            } else {
                this.$state.go(url,{uri: this.user.public.uri});
            }
        } else {
            this.$state.go(url,{uri: param});
        }
        this.toggleSlide();
    }

    close () {
        this.$mdSidenav('appmenu').toggle();
    }

}

let ApplicationMenuComponent: IComponentOptions = {
    transclude: false,
    controller: ApplicationMenuCtrl,
    template: require('./application-menu.component.html') as string
};
export default ApplicationMenuComponent;