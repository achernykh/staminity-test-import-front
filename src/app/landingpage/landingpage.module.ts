import { module } from 'angular';
import LandingPageComponent from './landing/landingpage.component';
import configure from './landingpage.config';
import LandingTariffsComponent from "./landing-tariffs/landing-tariffs.component";
import { downgradeInjectable } from "@angular/upgrade/static";
//import { NewPageDialogService } from "../new-page/new-page.service";

const Landing = module('staminity.landing', [])
	//.factory('NewPageDialogService', downgradeInjectable( NewPageDialogService ))
	.component('landingPage', LandingPageComponent)
	.component('landingTariffs', LandingTariffsComponent)
	.config(configure)
	.name;

export default Landing;