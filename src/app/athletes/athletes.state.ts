import { StateDeclaration } from "angular-ui-router";
import { DisplayView, DefaultTemplate } from "../core/display.constants";
import GroupService from "../core/group.service";
import UserService from "../core/user.service";
import { IAuthService } from "../auth/auth.service";
import MessageService from "../core/message.service";

const athletes = <StateDeclaration> {
    name: 'athletes',
    url: '/athletes',
    loginRequired: true,
    authRequired: ['func1'],
    resolve: {
        view: () => new DisplayView("athletes"),
        user: ["UserService", "SessionService", (UserService: UserService, SessionService) => {
            return UserService.getProfile(SessionService.getUser().userId);
        }],
        management: ["GroupService","user", (GroupService: GroupService, user) => {
            return GroupService.getManagementProfile(user.connections.allAthletes.groupId, "coach");
        }],
    },
    views: DefaultTemplate('athletes')
};

export const athletesStates: Array<StateDeclaration> = [athletes];
