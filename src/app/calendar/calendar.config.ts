import {StateDeclaration, StateProvider, StateService} from "angular-ui-router";
import {IUserProfile} from "../../../api/user/user.interface";
import {IAuthService} from "../auth/auth.service";
import {SessionService} from "../core";
import { DefaultTemplate, DisplayView } from "../core/display.constants";
import MessageService from "../core/message.service";
import UserService from "../core/user.service";
import {_translate} from "./calendar.translate";

function configure($stateProvider: StateProvider,
                   $translateProvider: any) {

    $stateProvider
        .state("calendar-my", {
            url: "/calendar",
            loginRequired: true,
            authRequired: ["user"],
            resolve: {
                view: () => new DisplayView("calendar"),
                user: ["SessionService", "message",
                    (SessionService: SessionService, message: MessageService, $stateParams) => SessionService.getUser()],
            },
            views: DefaultTemplate("calendar"),
        } as StateDeclaration)
        .state("calendar", {
            url: "/calendar/:uri",
            loginRequired: true,
            authRequired: ["user"],
            resolve: {
                view: () => new DisplayView("calendar"),
                user: ["UserService", "message", "$stateParams",
                    function(UserService: UserService, message: MessageService, $stateParams) {
                        return UserService.getProfile($stateParams.uri)
                            .catch((info) => {
                                message.systemWarning(info);
                                // TODO перейти на страницу 404
                                throw info;
                            });
                    }],
                athlete: ["SessionService", "user", (SessionService: SessionService, user: IUserProfile) =>
                    SessionService.getUser().userId !== user.userId ? user : null],
                checkPermissions: ["AuthService", "SessionService", "message", "athlete",
                    (AuthService: IAuthService, SessionService: SessionService, message: MessageService, athlete: IUserProfile) => {
                        if (athlete) {
                            if (AuthService.isCoach()) {
                                return AuthService.isMyAthlete(athlete)
                                    .catch((error) => {
                                        athlete = null;
                                        message.systemWarning(error);
                                        throw error;
                                    });
                            } else {
                                athlete = null;
                                message.systemWarning("forbidden_InsufficientRights");
                                throw new Error("need permissions");
                            }
                        }
                }],
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
                        athlete: "athlete",
                    },
                },
                "application": {
                    component: "calendar",
                    bindings: {
                        view: "view.application",
                    },
                },
            },
        } as StateDeclaration);

    // Текст представлений
    $translateProvider.translations("en", {calendar: _translate.en});
    $translateProvider.translations("ru", {calendar: _translate.ru});

}

configure.$inject = ["$stateProvider", "$translateProvider"];

export default configure;
