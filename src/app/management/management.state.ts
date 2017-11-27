import { StateDeclaration } from "angular-ui-router";
import { DisplayView, DefaultTemplate } from "../core/display.constants";
import GroupService from "../core/group.service";
import {IAuthService} from "../auth/auth.service";
import MessageService from "../core/message.service";

const management = <StateDeclaration> {
    name: 'management',
    url: '/management/:uri',
    loginRequired: true,
    authRequired: ['func1'],
    resolve: {
        view: () => new DisplayView('users'),
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
        club: [
            'GroupService', '$stateParams',
            (GroupService: GroupService, $stateParams) => GroupService.getProfile($stateParams.uri, 'club')
        ],
        management: [
            'GroupService', 'club',
            (GroupService: GroupService, club) => GroupService.getManagementProfile(club.groupId, 'club')
        ],
    },
    views: DefaultTemplate('management')
};

export const managementStates: Array<StateDeclaration> = [management];