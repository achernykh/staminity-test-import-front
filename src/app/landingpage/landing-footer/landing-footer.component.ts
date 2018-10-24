import './landing-footer.component.scss';
import { IComponentOptions, IComponentController } from 'angular';
import { LandingConfig } from "../landing.constants";
import DisplayService from "../../core/display.service";
import {gtmEvent} from "../../share/google/google-analitics.functions";
import {StateService} from "@uirouter/angularjs";

class LandingFooterCtrl implements IComponentController {

    // inject
    static $inject = ['$mdSidenav', 'landingConfig', '$state', 'DisplayService'];

    constructor(private $mdSidenav,
                private landingConfig: LandingConfig,
                private $state: StateService,
                private display: DisplayService) {

    }

    onMenu($mdOpenMenu, ev) {
        const originatorEv = ev;
        $mdOpenMenu(ev);
    }

    appStore (): void {
        gtmEvent('appEvent','mobileApp',this.$state.$current.name, 'iOS');
        window.open("https://itunes.apple.com/app/true/id1257031952");
    }

    googlePlay (): void {
        gtmEvent('appEvent','mobileApp',this.$state.$current.name, 'iOS');
        window.open("https://play.google.com/store/apps/details?id=com.staminity.phoneapp");
    }
}

export const LandingFooterComponent: IComponentOptions = {
    bindings: {

    },
    controller: LandingFooterCtrl,
    template: require('./landing-footer.component.html') as string
};