import './landing-scenario.component.scss';
import {IComponentOptions, IComponentController, ILocationService} from 'angular';
import { LandingConfig } from "../landing.constants";
import { saveUtmParams } from "../../share/location/utm.functions";

class LandingScenarioCtrl implements IComponentController {
    
    // bind
    data: any;
    onEvent: (response: Object) => Promise<void>;
     
    // private
    static $inject = ['$document', '$mdSidenav', 'landingConfig', '$state', '$location'];

    constructor (private $document, private $mdSidenav, private landingConfig: LandingConfig, private $state,
                 private $location: ILocationService) {
        saveUtmParams($location.search());
    }

    $onInit(): void {

    }

    toggleSlide(component) {
        this.$mdSidenav(component).toggle().then(_ => {});
    }
}

export const LandingScenarioComponent:IComponentOptions = {
    bindings: {
        scenario: '<',
        onEvent: '&'
    },
    controller: LandingScenarioCtrl,
    template: require('./landing-scenario.component.html') as string
};