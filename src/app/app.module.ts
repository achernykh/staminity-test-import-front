import {module, bootstrap} from 'angular';
//import {layoutModule} from '../js/layout/index.js'
//import * as translate from 'angular-translate/dist';
import * as ngMaterial from 'angular-material';
import 'angular-translate/dist/angular-translate.js';
import uiRouter from 'angular-ui-router';
//import 'angular-websocket/dist/angular-websocket.js';
import 'angular-material/angular-material.scss';

import Core from './core/core.module';
import Auth from './auth/auth.module';
import Landing from './landingpage/landingpage.module';

import run from './app.run';
import configure from './app.config';

import AppComponent from './app.component';

const root = module('staminity.application', [
	'pascalprecht.translate',
	//Translate,
	ngMaterial,
	uiRouter,
	//'ngWebSocket',
	Core,
	Auth,
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