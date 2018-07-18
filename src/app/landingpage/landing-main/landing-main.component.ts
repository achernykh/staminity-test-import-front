import './landing-main.component.scss';
import { IComponentOptions, IComponentController, element } from 'angular';
import { LandingConfig } from "../landing.constants";

class LandingMainCtrl implements IComponentController {

    private toolbar: JQuery;
    static $inject = ['$document', '$mdSidenav', 'landingConfig', '$state'];

    constructor (private $document, private $mdSidenav, private landingConfig: LandingConfig, private $state) {
        this.subscribeOnScroll();
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

export const LandingMainComponent: IComponentOptions = {
    bindings: {

    },
    controller: LandingMainCtrl,
    template: require('./landing-main.component.html') as string
}