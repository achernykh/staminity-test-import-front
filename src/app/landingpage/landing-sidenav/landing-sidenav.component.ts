import './landing-sidenav.component.scss';
import {IComponentOptions, IComponentController} from 'angular';
import { LandingConfig } from "../landing.constants";
import DisplayService from "../../core/display.service";
import AuthService from "../../auth/auth.service";
import {fbqLog} from "../../share/facebook/fbq.functions";

class LandingSidenavCtrl implements IComponentController {

    // bind
    data: any;
    onEvent: (response: Object) => Promise<void>;

    // private

    // inject
    static $inject = ['$mdSidenav', 'landingConfig', '$state', 'DisplayService', 'AuthService', '$mdMedia'];

    constructor(private $mdSidenav, private landingConfig: LandingConfig, private $state,
                private display: DisplayService, private auth: AuthService, private $mdMedia) {

    }

    $onInit(): void {

    }

    toggleSlide(component) {
        this.$mdSidenav(component).toggle().then(_ => {});
    }

    onMenu($mdOpenMenu, ev) {
        const originatorEv = ev;
        $mdOpenMenu(ev);
    }

    signUp (): void {
        fbqLog('Lead', {content_name: this.$state.$current.name});
        this.$state.go('signup');
    }
}

export const LandingSidenavComponent:IComponentOptions = {
    bindings: {
        data: '<',
    },
    controller: LandingSidenavCtrl,
    template: require('./landing-sidenav.component.html') as string
};