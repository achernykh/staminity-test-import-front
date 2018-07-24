import './landing-sidenav.component.scss';
import {IComponentOptions, IComponentController} from 'angular';
import { LandingConfig } from "../landing.constants";
import DisplayService from "../../core/display.service";
import AuthService from "../../auth/auth.service";

class LandingSidenavCtrl implements IComponentController {

    // bind
    data: any;
    onEvent: (response: Object) => Promise<void>;

    // private

    // inject
    static $inject = ['$mdSidenav', 'landingConfig', '$state', 'DisplayService', 'AuthService'];

    constructor(private $mdSidenav, private landingConfig: LandingConfig, private $state,
                private display: DisplayService, private auth: AuthService) {

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
}

export const LandingSidenavComponent:IComponentOptions = {
    bindings: {
        data: '<',
    },
    controller: LandingSidenavCtrl,
    template: require('./landing-sidenav.component.html') as string
};