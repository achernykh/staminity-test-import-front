import * as angular from "angular";
import { IComponentController, IComponentOptions, IScope} from "angular";
import {StateService} from "angular-ui-router";
import {Subject} from "rxjs/Rx";
import {IUserProfile} from "../../../../api/user/user.interface";
import {IAuthService} from "../../auth/auth.service";
import { getPermissions, getUser, SessionService } from "../../core";
import * as env from "../../core/env.js";
import "./application-menu.component.scss";
import { AppMenuSettings, UserMenuSettings } from "./application-menu.constants";

class ApplicationMenuCtrl implements IComponentController {

    private appmenu: any[] = AppMenuSettings;
    private usermenu: any[] = UserMenuSettings;
    private user: IUserProfile;
    showUserMenu: boolean = false;
    private date: Date = new Date();
    private env: Object = env;
    private destroy = new Subject();

    static $inject = ["$scope", "$mdSidenav", "AuthService", "SessionService", "$state"];

    constructor(
        private $scope: IScope,
        private $mdSidenav: any,
        private AuthService: IAuthService,
        private session: SessionService,
        private $state: StateService,
    ) {
        session.getObservable()
        .takeUntil(this.destroy)
        .map(getUser)

        .subscribe((profile) => this.user = angular.copy(profile));

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

    toggleSlide() {
        this.$mdSidenav("appmenu").toggle().then(() => angular.noop);
    }

    checkAuth(roles: Array<string>): boolean {
        return !roles && true || this.AuthService.isAuthorized(roles, false);
    }

    transitionToState(url, param) {
        if (this.$state.current.name === url && param === this.$state.params["uri"]) {
            return;
        }
        if (url.includes("http")) {
            window.open(url);
        } else if (!param) {
            if (url !== "user" && url !== "settings/user" && url !== "calendar") {
                this.$state.go(url);
            } else {
                this.$state.go(url, {uri: this.user.public.uri});
            }
        } else {
            this.$state.go(url, {uri: param});
        }
        this.toggleSlide();
    }

    close() {
        this.$mdSidenav("appmenu").toggle();
    }

}

const ApplicationMenuComponent: IComponentOptions = {
    transclude: false,
    controller: ApplicationMenuCtrl,
    template: require("./application-menu.component.html") as string,
};
export default ApplicationMenuComponent;
