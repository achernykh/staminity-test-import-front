import {StateDeclaration, StateProvider, StateService} from "@uirouter/angularjs";
import {IAuthService} from "../auth/auth.service";
import { DefaultTemplate, DisplayView } from "../core/display.constants";
import GroupService from "../core/group.service";
import {_translate} from "./club.translate";

function configure(
    $stateProvider: StateProvider,
    $translateProvider: any) {
    $stateProvider
        .state("club", {
            url: "/club/:uri",
            loginRequired: false,
            title: 'club.fullTitle',
            //authRequired: ['func1'],
            resolve: {
                view: () => new DisplayView("club"),
                auth: ["AuthService", (AuthService: IAuthService) => AuthService.isAuthenticated()],
                //userId: ['SessionService', (SessionService) => SessionService.getUser().userId],
                club: ["GroupService", "$stateParams", "$location", "auth",
                    (GroupService: GroupService, $stateParams, $location, auth: boolean) =>
                        GroupService.getProfile($stateParams.uri, "club", auth)
                            .catch((error) => {
                                if (error.hasOwnProperty("errorMessage") && error.errorMessage === "groupNotFound") {
                                    $location.path("/404");
                                }
                                throw error;
                            })],
            },
            views: DefaultTemplate("club"),
            urlLocRu: 'https://staminity.com/?lang=ru',
            urlLocEn: 'https://staminity.com/?lang=en',
            urlLoc: 'landing.main.urlLoc',
            breadcrumb: 'landing.main.breadcrumb',
            subtitle: 'landing.main.subtitle',
            imageUrl: 'https://264710.selcdn.ru/assets/images/website/screens/staminity-main.png'
        } as StateDeclaration);

    // Текст представлений
    $translateProvider.translations("en", {"club": _translate.en});
    $translateProvider.translations("ru", {"club": _translate.ru});

}

configure.$inject = ["$stateProvider", "$translateProvider"];

export default configure;
