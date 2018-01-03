import {StateDeclaration, StateProvider, StateService} from "angular-ui-router";
import {IUserProfile} from "../../../api/user/user.interface";
import {SessionService} from "../core";
import {DisplayView} from "../core/display.constants";
import GroupService from "../core/group.service";
import {translateDashboard, translateDashboardClub} from "./dashboard.translate";

function configure($stateProvider: StateProvider,
                   $translateProvider: any) {

    $stateProvider
        .state("dashboard", {
            url: "/dashboard",
            loginRequired: true,
            authRequired: ["user"],
            resolve: {
                view: () => new DisplayView("dashboard"),
                coach: ["SessionService", (session: SessionService) => session.getUser()],
                groupId: ["coach", (coach: IUserProfile) => coach.connections.allAthletes.groupId],
                athletes: ["GroupService", "groupId", (group: GroupService, groupId: number) =>
                    group.getManagementProfile(groupId , "coach")],
            },
            views: {
                "background": {
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
                },
                "application": {
                    component: "dashboard",
                    bindings: {
                        view: "view.application",
                    },
                },
            },
        } as StateDeclaration)
        .state("dashboard/club", {
            url: "/dashboard/club/:uri",
            loginRequired: true,
            authRequired: ["user"],
            resolve: {
                view: () => new DisplayView("dashboardClub"),
                coach: ["SessionService", (session: SessionService) => session.getUser()],
                groupId: ["coach", "$stateParams", (coach: IUserProfile, $stateParams) =>
                    coach.connections.ControlledClubs.filter((club) => club.groupUri === $stateParams.uri)[0].groupId],
                athletes: ["GroupService", "groupId", (group: GroupService, groupId: number) =>
                    group.getManagementProfile(groupId , "club").then((profile) => {
                        profile.members = profile.members.filter((member) => member.roleMembership.some((role) => role === "ClubAthletes"));
                        return profile;
                    })],
            },
            views: {
                "background": {
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
                },
                "application": {
                    component: "dashboard",
                    bindings: {
                        view: "view.application",
                    },
                },
            },
        } as StateDeclaration);

    // Текст представлений
    $translateProvider.translations("en", {dashboard: translateDashboard.en});
    $translateProvider.translations("ru", {dashboard: translateDashboard.ru});
    $translateProvider.translations("en", {dashboardClub: translateDashboardClub.en});
    $translateProvider.translations("ru", {dashboardClub: translateDashboardClub.ru});
}

configure.$inject = ["$stateProvider", "$translateProvider"];
export default configure;
