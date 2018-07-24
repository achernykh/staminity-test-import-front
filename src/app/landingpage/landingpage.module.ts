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
import { LandingSidenavComponent } from "./landing-sidenav/landing-sidenav.component";
import { LandingToolbarComponent } from "./landing-toolbar/landing-toolbar.component";
import { LandingScenarioComponent } from "./landing-scenario/landing-scenario.component";
import { LandingSidenavScenarioComponent } from "./landing-sidenav-scenario/landing-sidenav-scenario.component";
import { LandingReviewsComponent } from "./landing-reviews/landing-reviews.component";
import { landingTariffsConfig } from "./landing-tariffs/landing-tariffs.constants";

const Landing = module("staminity.landing", [])
    .component("landingPage", LandingPageComponent)
    .component("landingTariffs", LandingTariffsComponent)
    .component('stLandingMain', LandingMainComponent)
    .component('stLandingContentBlock', LandingContentBlockComponent)
    .component('stLandingFooter', LandingFooterComponent)
    .component('stLandingSidenav', LandingSidenavComponent)
    .component('stLandingToolbar', LandingToolbarComponent)
    .component('stLandingScenario', LandingScenarioComponent)
    .component('stLandingSidenavScenario', LandingSidenavScenarioComponent)
    .component('stLandingReviews', LandingReviewsComponent)
    .constant('landingConfig', landingConfig)
    .constant('tariffConfig', landingTariffsConfig)
    .config(configure)
    .config(['$stateProvider', ($stateProvider: StateProvider) => landingPageState.map(s => $stateProvider.state(s))])
    .name;

export default Landing;
