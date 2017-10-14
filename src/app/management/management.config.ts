import {StateDeclaration, StateService} from "@uirouter/angular";
import {_translate} from './management.translate';
import { DisplayView, DefaultTemplate } from "../core/display.constants";
import GroupService from "../core/group.service";
import {IAuthService} from "../auth/auth.service-ajs";
import MessageService from "../core/message.service";

function configure(
    $stateProvider: any,
    $translateProvider: any) {
    $stateProvider
        .state('management', <StateDeclaration>{
            url: "/management/:uri",
            loginRequired: true,
            authRequired: ['func1'],
            resolve: {
                view: () => new DisplayView('users'),
                checkPermissions: ['AuthService', '$stateParams', 'message',
                    (AuthService:IAuthService, $stateParams, message:MessageService)=> {
                        return AuthService.isMyClub($stateParams.uri).catch(error => {
                            message.systemWarning(error);
                            throw error;
                        });
                }],
                club: ['GroupService','$stateParams',
                    (GroupService: GroupService,$stateParams) => GroupService.getProfile($stateParams.uri, 'club')],
                management: ['GroupService','club',
                    (GroupService: GroupService, club) => GroupService.getManagementProfile(club.groupId,'club')]
            },
            views: DefaultTemplate('management')
        });

    // Текст представлений
    $translateProvider.translations('en', {"users": _translate['en']});
    $translateProvider.translations('ru', {"users": _translate['ru']});

}

configure.$inject = ['$stateProvider','$translateProvider'];

export default configure;