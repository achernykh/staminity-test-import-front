import { module } from 'angular';
import LandingPageComponent from './landingpage.component';
import configure from './landingpage.config';

const landing = module('staminity.landing', [])
	.component('landingPage', LandingPageComponent)
	.config(configure)
	.name;

export default landing;