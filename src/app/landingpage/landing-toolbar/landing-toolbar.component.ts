import './landing-toolbar.component.scss';
import {IComponentOptions, IComponentController} from 'angular';
import { LandingConfig } from "../landing.constants";

class LandingToolbarCtrl implements IComponentController {

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

export const LandingToolbarComponent:IComponentOptions = {
    bindings: {
        data: '<',
        solid: '<',
        onScenario: '&'
    },
    controller: LandingToolbarCtrl,
    template: require('./landing-toolbar.component.html') as string
};