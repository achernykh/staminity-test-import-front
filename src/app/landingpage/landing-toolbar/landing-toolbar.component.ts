import './landing-toolbar.component.scss';
import {IComponentOptions, IComponentController, element} from 'angular';
import { LandingConfig } from "../landing.constants";

class LandingToolbarCtrl implements IComponentController {

    // bind
    data: any;
    onEvent: (response: Object) => Promise<void>;

    // private
    private toolbar: JQuery;
    // inject
    static $inject = ['$document', '$mdSidenav', 'landingConfig', '$state'];

    constructor(private $document, private $mdSidenav, private landingConfig: LandingConfig, private $state) {
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

export const LandingToolbarComponent:IComponentOptions = {
    bindings: {
        data: '<',
        solid: '<',
        onScenario: '&'
    },
    controller: LandingToolbarCtrl,
    template: require('./landing-toolbar.component.html') as string
};