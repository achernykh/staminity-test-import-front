import {module, bootstrap} from 'angular';
import deferredBootstrapper from 'angular-deferred-bootstrap/angular-deferred-bootstrap.js';
import 'angular-drag-and-drop-lists/angular-drag-and-drop-lists.js';
import 'angularjs-scroll-glue/src/scrollglue.js';
import 'drag-drop-webkit-mobile/ios-drag-drop.js';

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
import { ActivityModule } from './activity';
import Profile from './profile-user/profile-user.module';
import SettingsClub from './settings-club/settings-club.module';
import Management from "./management/managment.module";
import Athletes from "./athletes/athletes.module";
import Club from "./club/club.module";
import Dashboard from './dashboard/dashboard.module';
import Search from "./search/search.module";
import Reference from "./reference/reference.module";
import Analytics from "./analytics/analytics.module";
import { SocketService } from "./core";

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
	'hm.readmore',
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
	ActivityModule,
	Profile,
	SettingsClub,
	Management,
	Athletes,
	Club,
	Dashboard,
	Search,
	Reference,
	Analytics
])
	.component('staminityApplication', AppComponent)
	.config(configure)
	.run(run)
	.name;

/*bootstrap(document, ['staminity.application'], {
	strictDi: true
});*/

deferredBootstrapper.bootstrap({
	element: document.body,
	module: 'staminity.application',
	bootstrapConfig: {
		strictDi: true
	},
	injectorModules: ['staminity.core', 'staminity.share'],
	moduleResolves: [{
		module: 'staminity.core',
		resolve: {
			WS_INIT: ['SocketService', (socket: SocketService) => socket.init()]
		}
	}]

});

export default root;