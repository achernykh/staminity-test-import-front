import './landing-sidenav.component.scss';
import {IComponentOptions, IComponentController} from 'angular';
import { LandingConfig } from "../landing.constants";

class LandingSidenavCtrl implements IComponentController {

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

export const LandingSidenavComponent:IComponentOptions = {
    bindings: {
        data: '<',
    },
    controller: LandingSidenavCtrl,
    template: require('./landing-sidenav.component.html') as string
};