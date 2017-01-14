import {module, bootstrap} from 'angular';
//import {layoutModule} from '../js/layout/index.js'
//import * as translate from 'angular-translate/dist';
import * as ngMaterial from 'angular-material';
import uiRouter from 'angular-ui-router';
import 'angular-material/angular-material.scss';

import Landing from './landingpage/landingpage.module';

import run from './app.run';
import configure from './app.config';

import AppComponent from './app.component';

const root = module('staminity.application', [
	'pascalprecht.translate',
	ngMaterial,
	uiRouter,
	Landing
	//translate
])
	.component('staminityApplication', AppComponent)
	.config(configure)
	.run(run)
	//.run(['$state', function ($state) {
	//	$state.go('welcome');
	//}])
	.name;

bootstrap(document, ['staminity.application'], {
	strictDi: true
});

export default root;