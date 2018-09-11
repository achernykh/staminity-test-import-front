import './landing-toolbar.component.scss';
import {IComponentOptions, IComponentController, element, IScope} from 'angular';
import { LandingConfig } from "../landing.constants";
import AuthService from "../../auth/auth.service";
import {fbqLog} from "../../share/facebook/fbq.functions";

class LandingToolbarCtrl implements IComponentController {

    // bind
    monoLogo: any;
    onEvent: (response: Object) => Promise<void>;

    // private
    private toolbar: JQuery;
    private content: Element;
    private scroll: boolean = false;
    // inject
    static $inject = ['$document', '$mdSidenav', 'landingConfig', '$state', '$mdMedia', '$scope', 'AuthService'];

    constructor(private $document, private $mdSidenav, private landingConfig: LandingConfig, private $state,
                private $mdMedia, private $scope: IScope, private authService: AuthService) {
        this.subscribeOnScroll();
    }

    $onInit(): void {}

    subscribeOnScroll(): void {
        setTimeout(() => {
            this.toolbar = element(this.$document[0].querySelector('#toolbar'));
            this.content = document.querySelector('.landing-main__welcome');
            this.content.addEventListener('scroll', () => {
                this.toolbar.addClass(this.content.scrollTop > 64 ? 'solid md-whiteframe-z3' : 'background');
                this.toolbar.removeClass(this.content.scrollTop <= 64 ? 'solid md-whiteframe-z3' : 'background');
                this.scroll = (this.content.scrollTop > 64);
                this.$scope.$applyAsync();
            });
        }, 100);
    }

    toggleSlide(component) {
        this.$mdSidenav(component).toggle().then(_ => {});
    }

    goToPage (state: string): void {
        if (state === 'signup') { fbqLog('Lead', {content_name: this.$state.$current.name}); }
        this.$state.go(state);
    }
}

export const LandingToolbarComponent:IComponentOptions = {
    bindings: {
        data: '<',
        monoLogo: '<',
        solid: '<',
        signUp: '<',
        onScenario: '&'
    },
    controller: LandingToolbarCtrl,
    template: require('./landing-toolbar.component.html') as string
};