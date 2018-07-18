import './landing-scenario.component.scss';
import {IComponentOptions, IComponentController, element} from 'angular';
import { LandingConfig } from "../landing.constants";

class LandingScenarioCtrl implements IComponentController {
    
    // bind
    data: any;
    onEvent: (response: Object) => Promise<void>;
     
    // private
    private toolbar: JQuery;
    static $inject = ['$document', '$mdSidenav', 'landingConfig', '$state'];

    constructor (private $document, private $mdSidenav, private landingConfig: LandingConfig, private $state) {
        this.subscribeOnScroll();
    }

    $onInit(): void {

    }

    subscribeOnScroll(): void {
        setTimeout(() => {
            this.toolbar = element(this.$document[0].querySelector('#toolbar'));
            window.addEventListener('scroll', () => {
                this.toolbar.addClass(window.scrollY > window.innerHeight * 0.05 ? 'solid md-whiteframe-z3' : 'background');
                this.toolbar.removeClass(window.scrollY <= window.innerHeight * 0.05 ? 'solid md-whiteframe-z3' : 'background');
            });
        }, 100);
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