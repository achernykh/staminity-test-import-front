import {module, bootstrap} from 'angular';
import * as ngMaterial from 'angular-material';
import * as ngMessages from 'angular-messages';
import * as ngAnimate from 'angular-animate';
import * as ngAria from 'angular-aria';
import * as ngMaterialTable from 'angular-material-data-table';
import 'angular-translate/dist/angular-translate.js';
import uiRouter from 'angular-ui-router';
import 'angular-material/angular-material.scss';
import 'angular-material-data-table/dist/md-data-table.css';
import 'smdatetimerangepicker/src/picker';
import 'smdatetimerangepicker/src/picker.css';
import 'leaflet/dist/leaflet.css';
import 'ui-leaflet/dist/ui-leaflet.js';
import * as hmReedmore from "../../bower_components/angular-read-more";
import * as angularDynamicLocale from 'angular-dynamic-locale/src/tmhDynamicLocale.js';
import toaster from 'angularjs-toaster';
import 'angularjs-toaster/toaster.css';
import 'animate.css/animate.css';
import 'angular-carousel/dist/angular-carousel.js';
import 'angular-carousel/dist/angular-carousel.css';
import * as ngTouch from 'angular-touch';

import run from './app.run';
import configure from './app.config';
import AppComponent from './app.component';

import Core from './core/core.module';
import Share from './share/share.module';
import Auth from './auth/auth.module';
import Landing from './landingpage/landingpage.module';
import SettingsUser from './settings-user/settings-user.module';
import Calendar from './calendar/calendar.module';
import CalendarItemMeasurement from './calendar-item/calendar-item.module';
import Activity from './activity/activity.module';
import Profile from './profile-user/profile-user.module';
import SettingsClub from './settings-club/settings-club.module';
import Management from "./management/managment.module";
import Athletes from "./athletes/athletes.module";
import Club from "./club/club.module";
import Dashboard from './dashboard/dashboard.module';
import Search from "./search/search.module";

const root = module('staminity.application', [
	'pascalprecht.translate', // translate
	ngMaterial,
	ngMessages,
	ngAnimate,
	ngAria,
	uiRouter,
	ngMaterialTable,
	'smDateTimeRangePicker',
	'nemLogging',
	'ui-leaflet',
	hmReedmore,
	angularDynamicLocale,
	toaster,
	ngTouch,
	'angular-carousel',

	Core,
	Share,
	Auth,
	Landing,
	SettingsUser,
	Calendar,
	CalendarItemMeasurement,
	Activity,
	Profile,
	SettingsClub,
	Management,
	Athletes,
	Club,
	Dashboard,
	Search
])
	.component('staminityApplication', AppComponent)
	.config(configure)
	.run(run)
	.name;

bootstrap(document, ['staminity.application'], {
	strictDi: true
});

export default root;