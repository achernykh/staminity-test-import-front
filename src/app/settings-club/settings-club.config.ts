import {StateDeclaration, StateProvider, StateService} from "@uirouter/angularjs";
import {IAuthService} from "../auth/auth.service";
import { DefaultTemplate, DisplayView } from "../core/display.constants";
import GroupService from "../core/group.service";
import MessageService from "../core/message.service";
import {_translate} from "./settings-club.translate";

function configure(
    $stateProvider: StateProvider,
    $translateProvider: any) {

        $stateProvider
            .state("settings/club", {
                url: "/settings/club/:uri",
                loginRequired: true,
                authRequired: ["func1"],
                resolve: {
                    view: () => new DisplayView("settingsClub"),
                    checkPermissions: ["AuthService", "$stateParams", "message",
                        (AuthService: IAuthService, $stateParams, message: MessageService) => {
                            return AuthService.isMyClub($stateParams.uri).catch((error) => {
                                message.systemWarning(error);
                                throw error;
                            });
                        }],
                    club: ["GroupService", "$stateParams", (GroupService: GroupService, $stateParams) =>
                        GroupService.getProfile($stateParams.uri, "club")],
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
                        component: "settingsClub",
                        bindings: {
                            view: "view.application",
                            club: "club",
                        },
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
        $translateProvider.translations("en", {"settingsClub": _translate.en});
        $translateProvider.translations("ru", {"settingsClub": _translate.ru});

}

configure.$inject = ["$stateProvider", "$translateProvider"];

export default configure;
