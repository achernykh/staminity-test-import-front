import './landing-main.component.scss';
import { IComponentOptions, IComponentController, ILocationService, element } from 'angular';
import { LandingConfig } from "../landing.constants";
import { saveUtmParams } from "../../share/location/utm.functions";
import {fbqLog} from "../../share/facebook/fbq.functions";

class LandingMainCtrl implements IComponentController {

    static $inject = ['$document', '$mdSidenav', 'landingConfig', '$state', '$location'];

    constructor (private $document, private $mdSidenav, private landingConfig: LandingConfig, private $state,
                 private $location: ILocationService) {
        saveUtmParams($location.search());
    }

    toggleSlide(component) {
        this.$mdSidenav(component).toggle().then(_ => {});
    }

    signUp (): void {
        fbqLog('Lead', {content_name: this.$state.$current.name});
        this.$state.go('signup');
    }

}

export const LandingMainComponent: IComponentOptions = {
    bindings: {

    },
    controller: LandingMainCtrl,
    template: require('./landing-main.component.html') as string
};