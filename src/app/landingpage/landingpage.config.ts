import {StateDeclaration, StateProvider} from "angular-ui-router";
import {DefaultTemplate, DisplayView} from "../core/display.constants";
import { SocketService } from "../core/socket/socket.service";
import {_translate} from "./landingpage.translate";
//import {ITranslateProvider} from "angular-translate";

function configure($stateProvider: StateProvider,
                   $translateProvider: any) {

    $stateProvider
        .state("welcome", {
            url: "/",
            loginRequired: false,
            authRequired: null,
            resolve: {
                view: () => new DisplayView("landingPage"),
            },
            views: DefaultTemplate("landingPage"),
        } as StateDeclaration)
        .state("tariffs", {
            url: "/tariffs",
            loginRequired: false,
            authRequired: null,
            resolve: {
                view: () => new DisplayView("landingTariffs"),
            },
            views: DefaultTemplate("landingTariffs"),
        } as StateDeclaration);

    // Текст представлений
    $translateProvider.translations("en", {landing: _translate.en});
    $translateProvider.translations("ru", {landing: _translate.ru});

}

configure.$inject = ["$stateProvider", "$translateProvider"];

export default configure;
