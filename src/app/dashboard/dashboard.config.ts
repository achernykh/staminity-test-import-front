import {StateDeclaration, StateProvider, StateService} from "@uirouter/angularjs";
import {IUserProfile} from "../../../api/user/user.interface";
import { SessionService, SocketService } from "../core";
import {DisplayView} from "../core/display.constants";
import GroupService from "../core/group.service";
import {translateDashboard, translateDashboardClub} from "./dashboard.translate";

function configure($stateProvider: StateProvider,
                   $translateProvider: any) {

    $stateProvider
        .state("dashboard", {
            url: "/dashboard",
            title: 'dashboard.coachfullTitle',
            loginRequired: true,
            authRequired: ["user"],
            resolve: {
                init: ['SocketService', (socket: SocketService) => socket.init()],
                coach: ["SessionService", (session: SessionService) => session.getUser()],
                clubUri: ["$stateParams", ($stateParams) => $stateParams.uri],
                groupId: ["coach", (coach: IUserProfile) => coach.connections.allAthletes.groupId],
                athletes: ["GroupService", "groupId", (group: GroupService, groupId: number) =>
                    group.getManagementProfile(groupId , "coach")],
            },
            views: {
                /**"background": {
                    component: "staminityBackground",
                    bindings: {
                        view: "view.background",
                    },
                },
                "header": {
                    component: "staminityHeader",
                    bindings: {
                        view: "view.header",
                    },
                },**/
                "application": {
                    component: "dashboard",
                },
            },
            urlLocRu: 'https://staminity.com/?lang=ru',
            urlLocEn: 'https://staminity.com/?lang=en',
            urlLoc: 'landing.main.urlLoc',
            breadcrumb: 'landing.main.breadcrumb',
            subtitle: 'landing.main.subtitle',
            imageUrl: 'https://264710.selcdn.ru/assets/images/website/screens/staminity-main.png'
        } as StateDeclaration)
        .state("dashboard/club", {
            url: "/dashboard/club/:uri",
            title: 'dashboard.clubfullTitle',
            loginRequired: true,
            authRequired: ["user"],
            resolve: {
                init: ['SocketService', (socket: SocketService) => socket.init()],
                coach: ["SessionService", (session: SessionService) => session.getUser()],
                clubUri: ["$stateParams", ($stateParams) => $stateParams.uri],
                groupId: ["coach", "clubUri", (coach: IUserProfile, clubUri: string) =>
                    coach.connections.ControlledClubs.filter((club) => club.groupUri === clubUri)[0].groupId],
                athletes: ["GroupService", "groupId", (group: GroupService, groupId: number) =>
                    group.getManagementProfile(groupId , "club").then((profile) => {
                        profile.members = profile.members.filter((member) => member.roleMembership.some((role) => role === "ClubAthletes"));
                        return profile;
                    })]
            },
            views: {
                /**"background": {
                    component: "staminityBackground",
                    bindings: {
                        view: "view.background",
                    },
                },
                "header": {
                    component: "staminityHeader",
                    bindings: {
                        view: "view.header",
                    },
                },**/
                "application": {
                    component: "dashboard",
                },
            },
            urlLocRu: 'https://staminity.com/?lang=ru',
            urlLocEn: 'https://staminity.com/?lang=en',
            urlLoc: 'landing.main.urlLoc',
            breadcrumb: 'landing.main.breadcrumb',
            subtitle: 'landing.main.subtitle',
            imageUrl: 'https://264710.selcdn.ru/assets/images/website/screens/staminity-main.png'
        } as StateDeclaration);

    // Текст представлений
    $translateProvider.translations("en", {dashboard: translateDashboard.en});
    $translateProvider.translations("ru", {dashboard: translateDashboard.ru});
    $translateProvider.translations("en", {dashboardClub: translateDashboardClub.en});
    $translateProvider.translations("ru", {dashboardClub: translateDashboardClub.ru});
}

configure.$inject = ["$stateProvider", "$translateProvider"];
export default configure;
