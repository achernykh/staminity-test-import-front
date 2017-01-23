import { module } from 'angular';
import LandingPageComponent from './landingpage.component';
import configure from './landingpage.config';

const Landing = module('staminity.landing', [])
	.component('landingPage', LandingPageComponent)
	.config(configure)
	.name;

export default Landing;