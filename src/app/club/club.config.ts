import {StateProvider, StateDeclaration, StateService} from 'angular-ui-router';
import {_translate} from './club.translate';
import { DisplayView, DefaultTemplate } from "../core/display.constants";

function configure(
    $stateProvider:StateProvider,
    $translateProvider: any) {
    $stateProvider
        .state('club', <StateDeclaration>{
            url: "/club/:uri",
            loginRequired: true,
            authRequired: ['func1'],
            resolve: {
                view: () => new DisplayView('club'),
                userId: ['SessionService', (SessionService) => SessionService.getUser().userId],
                club: ['GroupService','$stateParams',
                    (GroupService,$stateParams) => GroupService.getProfile($stateParams.uri)]
            },
            views: DefaultTemplate('club')
        });

    // Текст представлений
    $translateProvider.translations('en', {"club": _translate['en']});
    $translateProvider.translations('ru', {"club": _translate['ru']});

}

configure.$inject = ['$stateProvider','$translateProvider'];

export default configure;