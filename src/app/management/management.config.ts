import {StateProvider, StateDeclaration, StateService} from 'angular-ui-router';
import {_translate} from './management.translate';
import { DisplayView, DefaultTemplate } from "../core/display.constants";
import GroupService from "../core/group.service";

function configure(
    $stateProvider:StateProvider,
    $translateProvider: any) {
    $stateProvider
        .state('management', <StateDeclaration>{
            url: "/management/:uri",
            loginRequired: true,
            authRequired: ['func1'],
            resolve: {
                view: () => new DisplayView('users'),
                club: ['GroupService','$stateParams',
                    (GroupService: GroupService,$stateParams) => GroupService.getProfile($stateParams.uri, 'club')],
                management: ['GroupService','club',
                    (GroupService: GroupService, club) => GroupService.getManagementProfile(club.groupId)]
            },
            views: DefaultTemplate('management')
        });

    // Текст представлений
    $translateProvider.translations('en', {"users": _translate['en']});
    $translateProvider.translations('ru', {"users": _translate['ru']});

}

configure.$inject = ['$stateProvider','$translateProvider'];

export default configure;