import './landing-sidenav-scenario.component.scss';
import {IComponentOptions, IComponentController} from 'angular';
import { LandingConfig } from "../landing.constants";

class LandingSidenavScenarioCtrl implements IComponentController {

    // bind
    data: any;
    onEvent: (response: Object) => Promise<void>;

    // private

    // inject
    static $inject = ['$mdSidenav', 'landingConfig', '$state'];

    constructor(private $mdSidenav, private landingConfig: LandingConfig, private $state) {

    }

    $onInit(): void {

    }

    toggleSlide(component) {
        this.$mdSidenav(component).toggle().then(_ => {});
    }
}

export const LandingSidenavScenarioComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    controller: LandingSidenavScenarioCtrl,
    template: require('./landing-sidenav-scenario.component.html') as string
};