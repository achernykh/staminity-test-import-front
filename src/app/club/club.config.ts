import {StateProvider, StateDeclaration, StateService} from 'angular-ui-router';
import {_translate} from './club.translate';
import { DisplayView, DefaultTemplate } from "../core/display.constants";
import {IAuthService} from "../auth/auth.service";
import GroupService from "../core/group.service";

function configure(
    $stateProvider:StateProvider,
    $translateProvider: any) {
    $stateProvider
        .state('club', <StateDeclaration>{
            url: "/club/:uri",
            loginRequired: false,
            //authRequired: ['func1'],
            resolve: {
                view: () => new DisplayView('club'),
                auth: ['AuthService', (AuthService: IAuthService) => AuthService.isAuthenticated()],
                //userId: ['SessionService', (SessionService) => SessionService.getUser().userId],
                club: ['GroupService','$stateParams','$location', 'auth',
                    (GroupService: GroupService,$stateParams, $location, auth: boolean) =>
                        GroupService.getProfile($stateParams.uri,'club',auth)
                            .catch(error => {
                                if(error.hasOwnProperty('errorMessage') && error.errorMessage === 'clubNotFound'){
                                    $location.path('/404');
                                }
                                throw error;
                            })]
            },
            views: DefaultTemplate('club')
        });

    // Текст представлений
    $translateProvider.translations('en', {"club": _translate['en']});
    $translateProvider.translations('ru', {"club": _translate['ru']});

}

configure.$inject = ['$stateProvider','$translateProvider'];

export default configure;