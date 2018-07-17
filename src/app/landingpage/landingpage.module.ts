import { module } from "angular";
import { StateProvider } from "@uirouter/angularjs";
import LandingTariffsComponent from "./landing-tariffs/landing-tariffs.component";
import LandingPageComponent from "./landing/landingpage.component";
import configure from "./landingpage.config";
import {landingPageState} from './landing-page.state';
import {LandingMainComponent} from './landing-main/landing-main.component';
import {LandingContentBlockComponent} from "./landing-content-block/landing-content-block.component";
import {LandingFooterComponent} from "./landing-footer/landing-footer.component";
import {landingConfig} from "./landing.constants";

const Landing = module("staminity.landing", [])
    .component("landingPage", LandingPageComponent)
    .component("landingTariffs", LandingTariffsComponent)
    .component('stLandingMain', LandingMainComponent)
    .component('stLandingContentBlock', LandingContentBlockComponent)
    .component('stLandingFooter', LandingFooterComponent)
    .constant('landingConfig', landingConfig)
    .config(configure)
    .config(['$stateProvider', ($stateProvider: StateProvider) => landingPageState.map(s => $stateProvider.state(s))])
    .name;

export default Landing;
