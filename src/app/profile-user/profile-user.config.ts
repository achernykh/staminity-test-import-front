import {StateProvider, StateDeclaration, StateService} from 'angular-ui-router';
import {_translate} from './profile-user.translate';
import { summaryStatisticsTranslate } from './summary-statistics.translate';
import { DisplayView, DefaultTemplate } from "../core/display.constants";
import UserService from "../core/user.service";

function configure(
    $stateProvider:StateProvider,
    $translateProvider: any) {
    $stateProvider
        .state('profile', <StateDeclaration>{
            url: "/user",
            loginRequired: true,
            authRequired: ['func1'],
            resolve: {
                view: () => new DisplayView('user'),
                userId: ['SessionService', function(SessionService){
                    return SessionService.getUser().userId;
                }],
                user: ['UserService', function (UserService, userId) {
                    return UserService.getProfile(userId);
                }]
            },
            views: DefaultTemplate('user')
        })
        .state('user', <StateDeclaration>{
            url: "/user/:uri",
            loginRequired: true,
            authRequired: ['func1'],
            resolve: {
                view: () => new DisplayView('user'),
                //userId: ['$stateParams', $stateParams =>  $stateParams.uri],
                user: ['UserService', '$stateParams', (UserService:UserService, $stateParams) =>
                    UserService.getProfile($stateParams.uri)]
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