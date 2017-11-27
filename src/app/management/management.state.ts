import { StateDeclaration } from "angular-ui-router";
import { DisplayView, DefaultTemplate } from "../core/display.constants";
import GroupService from "../core/group.service";
import {IAuthService} from "../auth/auth.service";
import MessageService from "../core/message.service";

const management = <StateDeclaration> {
    name: 'management',
    url: 'management/:uri',
    loginRequired: true,
    authRequired: ['func1'],
    resolve: {
        test: () => { console.log('here ok'); },
        view: () => new DisplayView('users'),
        test1: () => { console.log('here ok 1'); },
        checkPermissions: [
            'AuthService', '$stateParams', 'message', 
            (AuthService: IAuthService, $stateParams, message: MessageService) => {
                return AuthService.isMyClub($stateParams.uri)
                .catch((error) => {
                    message.systemWarning(error);
                    throw error;
                });
            }
        ],
        test2: () => { console.log('here ok 2'); },
        club: [
            'GroupService', '$stateParams',
            (GroupService: GroupService, $stateParams) => GroupService.getProfile($stateParams.uri, 'club')
        ],
        test3: () => { console.log('here ok 3'); },
        management: [
            'GroupService', 'club',
            (GroupService: GroupService, club) => GroupService.getManagementProfile(club.groupId,'club')
        ],
        test4: () => { console.log('here ok 4'); },
    },
    views: DefaultTemplate('management')
};

export const managementStates: Array<StateDeclaration> = [management];