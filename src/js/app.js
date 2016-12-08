/**
 * Created by akexander on 22/07/16.
 */
//import { UserRoles, PageAccess } from './config/app.constants.js';
import appConfig from './config/app.config.js'
import appRun from './config/app.run.js'
import appMock from './config/e2e/app.mock.js'


import './components'
import './dialogs'
import './layout'
import './landingpage'
import './auth'
import './calendar'
import './user'
import './club'
import './users'
import './requests'
import './settings'
import './config/app.templates'
import './services'

sessionStorage.setItem('authToken', '{ "token": "75cbd20b-4729-f57a-96d0-f37c6cbfa50a", "userId": 21 }')


const requires = [
    'ngMaterial',
    'ngAnimate',
    'ngMessages',
    'pascalprecht.translate',
    'ngWebSocket',
    'ui.router',
    'duScroll',
    'ui.scroll',
    'ui.scroll.jqlite',
    'dndLists',
    'hm.readmore',
    'staminity.components',
    'staminity.dialogs',
    'staminity.layout',
    'staminity.templates',
    'staminity.landing',
    'staminity.auth',
    'staminity.calendar',
    'staminity.user',
    'staminity.club',
    'staminity.users',
    'staminity.requests',
    'staminity.settings',
    'staminity.services'
]


angular
	.module('staminity.application', requires)
	//.constant('_UserRoles', UserRoles)
	//.constant('_PageAccess', PageAccess)
	.config(appConfig)
	.run(appRun)

angular.bootstrap(document, ['staminity.application'], {strictDi: true});
