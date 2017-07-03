import {StateProvider, StateDeclaration, StateService} from 'angular-ui-router';
import {_translate} from './athletes.translate';
import { DisplayView, DefaultTemplate } from "../core/display.constants";
import {_translateAthleteInvitation} from "./athlete-invitation/athlete-invitation.translate";

function configure(
    $stateProvider:StateProvider,
    $translateProvider: any) {
    $stateProvider
        .state('athletes', <StateDeclaration>{
            url: "/athletes",
            loginRequired: true,
            authRequired: ['func1'],
            resolve: {
                view: () => new DisplayView('athletes'),
                user: ['UserService','SessionService', 
                    (UserService, SessionService) => UserService.getProfile(SessionService.getUser().userId)],
                management: ['GroupService','user',
                    (GroupService, user) => GroupService.getManagementProfile(user.connections.allAthletes.groupId, 'coach')]
            },
            views: DefaultTemplate('athletes')
        });

    // Текст представлений
    $translateProvider.translations('en', {"athletes": _translate['en']});
    $translateProvider.translations('ru', {"athletes": _translate['ru']});
    $translateProvider.translations('en', {"athlete-invitation": _translateAthleteInvitation['en']});
    $translateProvider.translations('ru', {"athlete-invitation": _translateAthleteInvitation['ru']});

}

configure.$inject = ['$stateProvider','$translateProvider'];

export default configure;