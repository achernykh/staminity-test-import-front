import { StateDeclaration } from "@uirouter/angularjs";
import {IAuthService} from "../auth/auth.service";
import { DefaultTemplate, DisplayView } from "../core/display.constants";
import GroupService from "../core/group.service";
import MessageService from "../core/message.service";

const management = {
    name: "management",
    url: "/management/:uri",
    title: "users.fullTitle",
    loginRequired: true,
    authRequired: ["func1"],
    resolve: {
        view: () => new DisplayView("users"),
        checkPermissions: [
            "AuthService", "$stateParams", "message",
            (AuthService: IAuthService, $stateParams, message: MessageService) => {
                return AuthService.isMyClub($stateParams.uri)
                    .catch((error) => {
                        message.systemWarning(error);
                        throw error;
                    });
            },
        ],
        club: [
            "GroupService", "$stateParams",
            (GroupService: GroupService, $stateParams) => GroupService.getProfile($stateParams.uri, "club"),
        ],
        management: [
            "GroupService", "club",
            (GroupService: GroupService, club) => GroupService.getManagementProfile(club.groupId, "club"),
        ],
    },
    views: { application: {component: 'stManagement'} },
    urlLocRu: 'https://staminity.com/?lang=ru',
    urlLocEn: 'https://staminity.com/?lang=en',
    urlLoc: 'landing.main.urlLoc',
    breadcrumb: 'landing.main.breadcrumb',
    subtitle: 'landing.main.subtitle',
    imageUrl: 'https://264710.selcdn.ru/assets/images/website/screens/staminity-main.png'
    //views: DefaultTemplate("management"),
} as StateDeclaration;

export const managementStates: StateDeclaration[] = [management];
