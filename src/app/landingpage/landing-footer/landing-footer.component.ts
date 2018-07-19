import './landing-footer.component.scss';
import { IComponentOptions, IComponentController } from 'angular';
import { LandingConfig } from "../landing.constants";
import DisplayService from "../../core/display.service";

class LandingFooterCtrl implements IComponentController {

    // inject
    static $inject = ['$mdSidenav', 'landingConfig', '$state', 'DisplayService'];

    constructor(private $mdSidenav, private landingConfig: LandingConfig, private $state, private display: DisplayService) {

    }

    onMenu($mdOpenMenu, ev) {
        const originatorEv = ev;
        $mdOpenMenu(ev);
    }
}

export const LandingFooterComponent: IComponentOptions = {
    bindings: {

    },
    controller: LandingFooterCtrl,
    template: require('./landing-footer.component.html') as string
};