/**
 * Created by akexander on 22/07/16.
 */
//import { UserRoles, PageAccess } from './config/app.constants.js';
import appConfig from './config/app.config.js';
import appRun from './config/app.run.js'
import appMock from './config/e2e/app.mock.js';

import './layout';
import './landingpage';
import './auth';
import './calendar';
import './config/app.templates';
import './services';

const requires = [
    'ngMaterial',
    'ngAnimate',
    'pascalprecht.translate',
    'ngWebSocket',
    'ui.router',
    'ui.scroll',
    'ui.scroll.jqlite',
    'dndLists',
	'hm.readmore',
//    'staminity.mock',
    'staminity.layout',
    'staminity.templates',
    'staminity.landing',
    'staminity.auth',
    //calendar,
    'staminity.calendar',
    'staminity.services'
];

angular
    .module('staminity.application', requires)
    //.constant('_UserRoles', UserRoles)
    //.constant('_PageAccess', PageAccess)
    .config(appConfig)
    .run(appRun);

    angular.bootstrap(document, ['staminity.application'], {
        strictDi: true
});
