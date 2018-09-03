import {module, bootstrap, IModule} from 'angular';
import * as localForage from "localforage";
import { dbDataVersion, dbSessionKey, dbDataKey } from './app.constants'
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
import Calendar from './calendar/calendar.module';
import { CalendarItem } from './calendar-item/calendar-item.module';
import { ActivityModule } from './activity';
import Profile from './profile-user/profile-user.module';
import SettingsClub from './settings-club/settings-club.module';
import Management from "./management/managment.module";
import Athletes from "./athletes/athletes.module";
import Club from "./club/club.module";
import Dashboard from './dashboard/dashboard.module';
import Search from "./search/search.module";
import Reference from "./reference/reference.module";
import { TrainingPlans } from "./training-plans/training-plans.module";
import Analytics from "./analytics/analytics.module";
import { Methodology } from './methodology/methodology.module';
import { TrainingSeason } from './training-season';
import { User } from './user';
import {StorageService, ISession} from "@app/core";
import {jsonld} from "./jsonld.directive";

const vendors = [
    'pascalprecht.translate', // translate
    'ngMaterial',
    'ngMessages',
    'ngAnimate',
    'ngAria',
    'ngSanitize',
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
    'ngQuill', // https://github.com/KillerCodeMonkey/ng-quill
    ];

const submodules = [
    Core,
    Share,
    Auth,
    Landing,
    Calendar,
    CalendarItem,
    ActivityModule,
    Profile,
    SettingsClub,
    Management,
    Athletes,
    Club,
    Dashboard,
    Search,
    Reference,
    Analytics,
    TrainingPlans,
    Methodology,
    TrainingSeason,
    User,
];

/*const root = module('staminity.application', )
    .component('staminityApplication', AppComponent)
    .config(configure)
	.run(run);*/

//.constant('configAuthData', null)

/**bootstrap(document, ['staminity.application'], {
	strictDi: true
});**/

const getRootModule = (session: ISession) => {
    return module('staminity.application', [...vendors, ...submodules] )
        .constant('configAuthData', session)
        .component('staminityApplication', AppComponent)
        .directive('jsonld', ['$filter', '$sce', jsonld])
        .config(configure)
        .run(run)
        .name;
};

const bootstrapApplication = (module) =>
    angular.element(document).ready(_ => bootstrap(document, [module], {strictDi: true}));

// async bootstrap
Promise.resolve()
    .then(_ => checkDB())
    .then(s => getRootModule(s))
    .then(r => bootstrapApplication(r));

const checkDB = (): Promise<ISession> => {
    return localForage.ready()
        .then(_ => localForage.getItem(dbDataKey))
        .then(r => r && localForage.getItem(dbSessionKey) || createDB(), e => {debugger;});
};

const createDB = (): Promise<ISession> => {
    return localForage.setItem(dbDataKey, dbDataVersion)
        .then(_ => {
            let session: ISession = JSON.parse(window.localStorage.getItem(dbSessionKey));
            if (session) { window.localStorage.removeItem(dbSessionKey);}
            return session || {};
        })
        .then(s => localForage.setItem(dbSessionKey, s));
};