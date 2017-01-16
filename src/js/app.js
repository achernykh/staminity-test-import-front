import appConfig from './config/app.config.js'
import appRun from './config/app.run.js'

import './components'
import './dialogs'
import './layout'
import './landingpage'
import './auth'
import './calendar'
import './user'
import './club'
import './management'
import './athletes'
import './requests'
import './settings'
import './config/app.templates'
import './services'
import './api'


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
	'rx',
    'staminity.layout',
    'staminity.templates',
    'staminity.landing',
    'staminity.auth',
    'staminity.calendar',
    'staminity.user',
    'staminity.club',
    'staminity.management',
    'staminity.athletes',
    'staminity.requests',
    'staminity.settings',
    'staminity.services',
	'staminity.api'
]


angular
	.module('staminity.application', requires)
	.config(appConfig)
	.run(appRun)

angular.bootstrap(document, ['staminity.application'], {strictDi: true});
