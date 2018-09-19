import './landing-scenario.component.scss';
import {IComponentOptions, IComponentController, ILocationService} from 'angular';
import { LandingConfig } from "../landing.constants";
import { saveUtmParams } from "../../share/location/utm.functions";
import DisplayService from "../../core/display.service";
import {fbqLog} from "../../share/facebook/fbq.functions";

class LandingScenarioCtrl implements IComponentController {
    
    // bind
    data: any;
    onEvent: (response: Object) => Promise<void>;
     
    // private
    static $inject = ['$document', '$mdSidenav', 'landingConfig', '$state', '$location', 'DisplayService'];

    constructor (private $document, private $mdSidenav, private landingConfig: LandingConfig, private $state,
                 private $location: ILocationService, private display: DisplayService) {
        saveUtmParams($location.search());
    }

    $onInit(): void { }

    toggleSlide(component) {
        this.$mdSidenav(component).toggle().then(_ => {});
    }

    getScenario (code: string): any {
        return this.landingConfig.scenario.filter(s => s.code === code)[0] || null;
    }

    action (state: string, params: Object): void {
        if (state === 'signup') { fbqLog('Lead', {content_name: this.$state.$current.name}); }
        this.$state.go(state, params);
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