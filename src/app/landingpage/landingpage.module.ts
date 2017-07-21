import { module } from 'angular';
import LandingPageComponent from './landing/landingpage.component';
import configure from './landingpage.config';
import LandingTariffsComponent from "./landing-tariffs/landing-tariffs.component";

const Landing = module('staminity.landing', [])
	.component('landingPage', LandingPageComponent)
	.component('landingTariffs', LandingTariffsComponent)
	.config(configure)
	.name;

export default Landing;