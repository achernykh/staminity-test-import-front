import {module, bootstrap} from 'angular';
import * as ngMaterial from 'angular-material';
import 'angular-translate/dist/angular-translate.js';
import uiRouter from 'angular-ui-router';
import 'angular-material/angular-material.scss';

import Core from './core/core.module';
import Share from './share/share.module';
import Auth from './auth/auth.module';
import Landing from './landingpage/landingpage.module';
import SettingsUser from './settings-user/settings-user.module';
import Calendar from './calendar/calendar.module';
import CalendarItemMeasurement from './calendar-item/calendar-item.module';
import Activity from './activity/activity.module';

import run from './app.run';
import configure from './app.config';

import AppComponent from './app.component';

const root = module('staminity.application', [
	'pascalprecht.translate',
	//Translate,
	ngMaterial,
	uiRouter,
	Core,
	Share,
	Auth,
	Landing,
	SettingsUser,
	Calendar,
	CalendarItemMeasurement,
	Activity
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