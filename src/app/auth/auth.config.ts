 import {StateDeclaration, StateProvider, StateService} from "@uirouter/angularjs";
 import {SessionService} from "../core";
 import {_display_view, DisplayView} from "../core/display.constants";
 import {_translate} from "./auth.translate";
 import DisplayService from "@app/core/display.service";

 function configure(
    $stateProvider: StateProvider,
    $translateProvider: any) {

    $stateProvider
        .state("signin", {
            url: "/signin",
            title: 'auth.signin.shortTitle',
            loginRequired: false,
            params: {
                activatePremiumTrial: null,
                activateCoachTrial: null,
                activateClubTrial: null,
            },
            resolve: {
                signUpButton: () => true,
            },
            views: {
                "application": { component: "auth" },
                "form@signin": { template: require("./view/signin.html") },
            }
        } as StateDeclaration)
        // Представление Auth: SignUp
        .state("signup", {
            url: "/signup",
            title: 'auth.signup.shortTitle',
            loginRequired: false,
            params: {
                activatePremiumTrial: null,
                activateCoachTrial: null,
                activateClubTrial: null,
            },
            views: {
                "application": { component: "auth" },
                "form@signup": { template: require("./view/signup.html") },
            }
        } as StateDeclaration)
        // Представление Auth: SignOut
        .state("signout", {
            url: "/signout",
            title: 'auth.signout.shortTitle',
            loginRequired: false,
            params: {
                activatePremiumTrial: null,
                activateCoachTrial: null,
                activateClubTrial: null,
            },
            views: {
                "application": { component: "auth" },
            }

        } as StateDeclaration)
        // Представление Auth: Confirm
        .state("confirm", {
            url: "/confirm",
            title: 'auth.confirm.shortTitle',
            loginRequired: false,
            params: {
                activatePremiumTrial: null,
                activateCoachTrial: null,
                activateClubTrial: null,
            },
            views: {
                "application": { component: "auth" },
                "form@signin": { template: require("./view/signin.html") },
            }
        } as StateDeclaration)
        // Представление Auth: Confirm
        .state("invite", {
            url: "/invite",
            title: 'auth.invite.shortTitle',
            loginRequired: false,
            params: {
                activatePremiumTrial: null,
                activateCoachTrial: null,
                activateClubTrial: null,
            },
            views: {
                "application": { component: "auth" },
                "form@invite": { template: require("./view/invite.html") },
            }
        } as StateDeclaration)
        // Представление Auth: SetPassword
        .state("setpass", {
            url: "/setpass",
            title: 'auth.setpass.shortTitle',
            loginRequired: false,
            params: {
                activatePremiumTrial: null,
                activateCoachTrial: null,
                activateClubTrial: null,
            },
            views: {
                "application": { component: "auth" },
                "form@setpass": { template: require("./view/setpass.html") },
            }
        } as StateDeclaration)
        // Представление Auth: Confirm
        .state("reset", {
            url: "/reset",
            title: 'auth.reset.shortTitle',
            loginRequired: false,
            params: {
                email: null,
                activatePremiumTrial: null,
                activateCoachTrial: null,
                activateClubTrial: null,
            },
            views: {
                "application": { component: "auth" },
                "form@reset": { template: require("./view/reset.html") },
            }
        } as StateDeclaration);

    // Текст представлений
    $translateProvider.translations("en", {auth: _translate.en});
    $translateProvider.translations("ru", {auth: _translate.ru});

}

 configure.$inject = ["$stateProvider", "$translateProvider"];

 export default configure;
