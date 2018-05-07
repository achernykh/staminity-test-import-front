import {StateDeclaration, StateProvider} from "@uirouter/angularjs";
import {DefaultTemplate, DisplayView} from "../core/display.constants";
import {_translateSearch} from "./search.translate";
//import {ITranslateProvider} from "angular-translate";

function configure($stateProvider: StateProvider,
                   $translateProvider: any) {

    $stateProvider
        .state("search", {
            url: "/search",
            loginRequired: true,
            authRequired: null,
            resolve: {
                view: () => new DisplayView("search"),
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
                    component: "search",
                    bindings: {
                        view: "view.application",
                    },
                },
            },
        } as StateDeclaration);

    // Текст представлений
    $translateProvider.translations("en", {search: _translateSearch.en});
    $translateProvider.translations("ru", {search: _translateSearch.ru});

}

configure.$inject = ["$stateProvider", "$translateProvider"];

export default configure;
