import {StateProvider, StateDeclaration, StateService} from 'angular-ui-router';
import {_translate} from './profile-user.translate';
import { summaryStatisticsTranslate } from './summary-statistics.translate';
import { DisplayView, DefaultTemplate } from "../core/display.constants";
import UserService from "../core/user.service";
import AuthService from "../auth/auth.service";

function configure(
    $stateProvider:StateProvider,
    $translateProvider: any) {
    $stateProvider
        .state('profile', <StateDeclaration>{
            url: "/user",
            loginRequired: false,
            //authRequired: ['func1'],
            resolve: {
                view: () => new DisplayView('user'),
                auth: ['AuthService', (AuthService: AuthService) => AuthService.isAuthenticated()],
                userId: ['SessionService', function(SessionService){
                    return SessionService.getUser().userId;
                }],
                user: ['UserService','auth', function (UserService, userId, auth: boolean) {
                    return UserService.getProfile(userId, auth);
                }]
            },
            views: DefaultTemplate('user')
        })
        .state('user', <StateDeclaration>{
            url: "/user/:uri",
            loginRequired: false,
            //authRequired: ['func1'],
            resolve: {
                view: () => new DisplayView('user'),
                auth: ['AuthService', (AuthService: AuthService) => AuthService.isAuthenticated()],
                userId: ['$stateParams', $stateParams =>  $stateParams.uri],
                user: ['UserService','userId','auth', function (UserService, userId, auth: boolean) {
                    return UserService.getProfile(userId, auth).catch(error => {
                        throw error;
                    });
                }]
            },
            views: DefaultTemplate('user')
        });

    // Текст представлений
    $translateProvider.translations('en', {"user": _translate['en']});
    $translateProvider.translations('ru', {"user": _translate['ru']});

    // Текст представлений
    $translateProvider.translations('en', {"summaryStatistics": summaryStatisticsTranslate['en']});
    $translateProvider.translations('ru', {"summaryStatistics": summaryStatisticsTranslate['ru']});
}

configure.$inject = ['$stateProvider','$translateProvider'];

export default configure;