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
import './users'
import './requests'
import './settings'
import './config/app.templates'
import './services'
import './api'
import './shared'
import './calendar-item'

const requires = [
    'ngMaterial', // npm/angular-material
    'ngAnimate', // npm/angular-animate
    'ngMessages', // npm/angular-messages
    'pascalprecht.translate', // npm/angular-translate
    'ngWebSocket', // npm/angular-websocket
    'ui.router', // npm/angular-router
    'duScroll', // npm/angular-scroll
    //'ui.scroll',
    //'ui.scroll.jqlite',
    'dndLists', // npm/angular-drag-and-drop-lists
    'hm.readmore', // bower/angular-read-more
    'staminity.components',
    'staminity.dialogs',
	//'rx',

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
    'staminity.services',
	'staminity.api',
    'staminity.shared',
    'staminity.calendar-item'
]


angular
	.module('staminity.application', requires)
	.config(appConfig)
	.run(appRun)

angular.bootstrap(document, ['staminity.application'], {strictDi: true});
