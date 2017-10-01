import {module, bootstrap} from 'angular';
import * as hmReedmore from "../../bower_components/angular-read-more";
import 'angular-drag-and-drop-lists/angular-drag-and-drop-lists.js';
import 'angularjs-scroll-glue/src/scrollglue.js';
import 'drag-drop-webkit-mobile/ios-drag-drop.js';
//import 'material-design-icons/iconfont/MaterialIcons-Regular.eot';
//import 'material-design-icons/iconfont/MaterialIcons-Regular.woff2';
//import 'material-design-icons/iconfont/MaterialIcons-Regular.woff';
//import 'material-design-icons/iconfont/MaterialIcons-Regular.ttf';

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
import Reference from "./reference/reference.module";
import TrainingPlans from "./training-plans/training-plans.module";
import Analytics from "./analytics/analytics.module";

const root = module('staminity.application', [
	'pascalprecht.translate', // translate
	'ngMaterial',
	'ngMessages',
	'ngAnimate',
	'ngAria',
	'ui.router',
	'md.data.table',
	'nemLogging',
	'ui-leaflet',
	hmReedmore,
	'tmh.dynamicLocale',
	'toaster',
	//'ngTouch',
	'angular-carousel',
	'dndLists',
	'luegg.directives',

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
	Search,
	Reference,
	Analytics,
	TrainingPlans
])
	.component('staminityApplication', AppComponent)
	.config(configure)
	.run(run)
	.name;

bootstrap(document, ['staminity.application'], {
	strictDi: true
});

export default root;