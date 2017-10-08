import * as angular from 'angular';
import { IComponentOptions, IComponentController, IScope} from 'angular';
import { UserMenuSettings, AppMenuSettings } from './application-menu.constants';
import {StateService} from "@uirouter/angular";
import {IUserProfile} from "../../../../api/user/user.interface";
import {Subject} from 'rxjs/Rx';
import './application-menu.component.scss';
import { ISessionService, getUser, getPermissions } from "../../core/session.service";
import * as env from '../../core/env.js';
import {IAuthService} from "../../auth/auth.service";

class ApplicationMenuCtrl implements IComponentController{

    private appmenu: Array<any> = AppMenuSettings;
    private usermenu: Array<any> = UserMenuSettings;
    private user: IUserProfile;
    public showUserMenu: boolean = false;
    private date: Date = new Date();
    private env: Object = env;
    private destroy = new Subject();

    static $inject = ['$scope','$mdSidenav','AuthService','SessionService','$state'];

    constructor(
        private $scope: IScope,
        private $mdSidenav: any,
        private AuthService: IAuthService,
        private session: ISessionService,
        private $state: StateService
    ) {
        session.getObservable()
        .takeUntil(this.destroy)
        .map(getUser)

        .subscribe(profile=> this.user = angular.copy(profile));

        session.getObservable()
        .takeUntil(this.destroy)
        .map(getPermissions)
        .distinctUntilChanged()
        .subscribe(() => $scope.$evalAsync());
    }

    $onDestroy() {
        this.destroy.next(); 
        this.destroy.complete();
    }

    toggleSlide(){
        this.$mdSidenav("appmenu").toggle().then(() => angular.noop);
    }

    checkAuth(role) {
        return this.AuthService.isAuthorized(role);
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