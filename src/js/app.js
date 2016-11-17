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

sessionStorage.setItem('authToken', '{ "token": "c5850e1b-80c8-c5b2-abd4-641ed2bb8af4", "userId": 4 }')
sessionStorage.setItem('userProfile#4', '{ "email": "sneik2@mail.ru", "public": { "lastName": "Евгений", "firstName": "Хабаров" }, "userId": 4, "revision": 1, "notifications": [ { "group": "act", "events": [ { "web": true, "name": "completedActivityByFriend", "email": true, "phone": true }, { "web": true, "name": "completedActivityByFollowing", "email": true, "phone": true }, { "web": true, "name": "modifiedActivityByUser", "email": true, "phone": true } ] }, { "group": "billing", "events": [ { "web": true, "name": "scheduledSubscriptionRenewal", "email": true, "phone": true } ] }, { "group": "group", "events": [ { "web": true, "name": "requestedGroupMembership", "email": true, "phone": true }, { "web": true, "name": "receivedGroupInvitation", "email": true, "phone": true }, { "web": true, "name": "acceptedGroupMembership", "email": true, "phone": true }, { "web": true, "name": "declinedGroupMembership", "email": true, "phone": true } ] }, { "group": "sync", "events": [ { "web": true, "name": "completedInitialProviderSync", "email": true, "phone": true }, { "web": true, "name": "uploadedActivityByProvider", "email": true, "phone": true } ] }, { "group": "userProfile", "events": [ { "web": true, "name": "zonesChangedByTrainer", "email": true, "phone": true }, { "web": true, "name": "zonesInconsistsBySystemAnalisys", "email": true, "phone": true }, { "web": true, "name": "zonesChangedByAthelete", "email": true, "phone": true } ] } ], "subscriptions": [ { "code": "user", "validThrough": "2026-07-07T10:15:29.599777" }, { "code": "proUser", "validThrough": "2019-04-02T10:15:29.599777" } ] }')

const requires = [
    'ngMaterial',
    'ngAnimate',
    'pascalprecht.translate',
    'ngWebSocket',
    'ui.router',
    'duScroll',
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
