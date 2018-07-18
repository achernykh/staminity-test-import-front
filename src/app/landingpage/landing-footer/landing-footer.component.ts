import './landing-footer.component.scss';
import { IComponentOptions, IComponentController } from 'angular';
import { LandingConfig } from "../landing.constants";

class LandingFooterCtrl implements IComponentController {

    // inject
    static $inject = ['$mdSidenav', 'landingConfig', '$state'];

    constructor(private $mdSidenav, private landingConfig: LandingConfig, private $state) {

    }
}

export const LandingFooterComponent: IComponentOptions = {
    bindings: {

    },
    controller: LandingFooterCtrl,
    template: require('./landing-footer.component.html') as string
};