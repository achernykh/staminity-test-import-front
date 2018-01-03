import { merge } from "angular";
import { StateDeclaration, StateProvider, StateService } from "angular-ui-router";

import { IGroupProfile } from "../../../api/group/group.interface";
import { IUserProfile } from "../../../api/user/user.interface";

import AuthService from "../auth/auth.service";
import { isMember } from "../club/club.datamodel";
import {SessionService} from "../core";
import { DefaultTemplate, DisplayView } from "../core/display.constants";
import GroupService from "../core/group.service";
import UserService from "../core/user.service";
import ReferenceService from "./reference.service";
import * as translate from "./reference.translate";

function configure(
    $stateProvider: StateProvider,
    $translateProvider,
) {
    $stateProvider
    .state("club-reference", {
        url: "/reference/club/:uri",
        loginRequired: true,
        authRequired: ["user"],
        resolve: {
            view: () => merge(new DisplayView("reference"), {
                header: {
                    fullTitle: "reference.club.fullTitle",
                    shortTitle: "reference.club.shortTitle",
                },
            }),
            clubUri: ["$stateParams", ($stateParams) => $stateParams.uri],
            club: ["GroupService", "clubUri", (GroupService: GroupService, clubUri: string) => GroupService.getProfile(clubUri, "club", true)],
            userId: ["SessionService", (SessionService: SessionService) => SessionService.getUser().userId],
            user: ["UserService", "userId", (UserService: UserService, userId: number) => UserService.getProfile(userId, true)],
            access: ["club", "user", (club: IGroupProfile, user: IUserProfile) => {
                if (!isMember(user, club)) {
                    throw new Error("noMembership");
                }
            }],
        },
        views: DefaultTemplate("reference"),
    } as StateDeclaration)
    .state("reference", {
        url: "/reference",
        loginRequired: true,
        authRequired: ["user"],
        resolve: {
            view: () => new DisplayView("reference"),
            userId: ["SessionService", (SessionService: SessionService) => SessionService.getUser().userId],
            user: ["UserService", "userId", (UserService: UserService, userId: number) => UserService.getProfile(userId, true)],
        },
        views: DefaultTemplate("reference"),
    } as StateDeclaration);

    $translateProvider.translations("en", translate.en);
    $translateProvider.translations("ru", translate.ru);
}

configure.$inject = ["$stateProvider", "$translateProvider"];

export default configure;
