import { StateDeclaration } from "angular-ui-router";
import { IAuthService } from "../auth/auth.service";
import { DefaultTemplate, DisplayView } from "../core/display.constants";
import GroupService from "../core/group.service";
import MessageService from "../core/message.service";
import UserService from "../core/user.service";

const athletes = {
    name: "athletes",
    url: "/athletes",
    loginRequired: true,
    authRequired: ["func1"],
    resolve: {
        view: () => new DisplayView("athletes"),
        user: ["UserService", "SessionService", (UserService: UserService, SessionService) => {
            return UserService.getProfile(SessionService.getUser().userId);
        }],
        management: ["GroupService", "user", (GroupService: GroupService, user) => {
            return GroupService.getManagementProfile(user.connections.allAthletes.groupId, "coach");
        }],
    },
    views: { application: {component: 'stAthletes'} }
    //views: DefaultTemplate("athletes"),
} as StateDeclaration;

export const athletesStates: StateDeclaration[] = [athletes];
