 import {StateDeclaration, StateProvider, StateService} from "angular-ui-router";
import {SessionService} from "../core";
import {_display_view, DisplayView} from "../core/display.constants";
import {_translate} from "./auth.translate";

function configure(
    $stateProvider:StateProvider,
    $translateProvider: any) {

    $stateProvider
        .state("signin", <StateDeclaration>{
            url: "/signin",
            loginRequired: false,
            resolve: {
                view: () => new DisplayView("signin"),
            },
            params: {
                nextState: null,
                nextParams: null,
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
                    component: "auth",
                    bindings: "view.application",
                },
                "form@signin": {
                    template: require("./view/signin.html"),
                },
            },
        })
        // Представление Auth: SignUp
        .state("signup", <StateDeclaration>{
            url: "/signup",
            loginRequired: false,
            params: {
                activatePremiumTrial: null,
                activateCoachTrial: null,
                activateClubTrial: null,
            },
            resolve: {
                view: () => new DisplayView("signup"),
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
                    component: "auth",
                    bindings: "view.application",
                },
                "form@signup": {
                    template: require("./view/signup.html"),
                },
            },
        })
        // Представление Auth: SignOut
        .state("signout", <StateDeclaration>{
            url: "/signout",
            loginRequired: true,
            //authRequired: ['func1'],
            /* waite for https://github.com/angular-ui/ui-router/issues/3260
            onEnter: ['$state','SessionService', ($state:StateService, SessionService: SessionService) => {
                SessionService.delToken();
                $state.go('signin');
            }]*/
            views: {
                "application": {
                    component: "auth",
                    bindings: "view.application",
                },
            },

        })
        // Представление Auth: Confirm
        .state("confirm", <StateDeclaration>{
            url: "/confirm",
            loginRequired: false,
            //authRequired: ['func1']
            views: {
                "application": {
                    component: "auth",
                    bindings: "view.application",
                },
                "form@signin": {
                    template: require("./view/signin.html"),
                },
            },

        })
        // Представление Auth: Confirm
        .state("invite", <StateDeclaration>{
            url: "/invite",
            loginRequired: false,
            views: {
                "header": {
                    component: "staminityHeader",
                    bindings: {
                        view: "view.header",
                    },
                },
                "application": {
                    component: "auth",
                    bindings: "view.application",
                },
                "form@invite": {
                    template: require("./view/invite.html"),
                },
            },

        })
        // Представление Auth: SetPassword
        .state("setpass", <StateDeclaration>{
            url: "/setpass",
            loginRequired: false,
            views: {
                "application": {
                    component: "auth",
                    bindings: "view.application",
                },
                "form@setpass": {
                    template: require("./view/setpass.html"),
                },
            },

        })
        // Представление Auth: Confirm
        .state("reset", <StateDeclaration>{
            url: "/reset",
            loginRequired: false,
            resolve: {
                view: () => new DisplayView("reset"),
            },
            params: {
                email: null,
            },
            views: {
                "application": {
                    component: "auth",
                    bindings: "view.application",
                },
                "header": {
                    component: "staminityHeader",
                    bindings: {
                        view: "view.header",
                    },
                },
                "form@reset": {
                    template: require("./view/reset.html"),
                },
            },

        });

    // Текст представлений
    $translateProvider.translations("en", {auth: _translate["en"]});
    $translateProvider.translations("ru", {auth: _translate["ru"]});

}

configure.$inject = ["$stateProvider","$translateProvider"];

export default configure;