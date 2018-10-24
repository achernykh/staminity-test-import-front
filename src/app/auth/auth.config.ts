 import {StateDeclaration, StateProvider, StateService} from "@uirouter/angularjs";
 import {SessionService} from "../core";
 import {_display_view, DisplayView} from "../core/display.constants";
 import {_translate} from "./auth.translate";
 import DisplayService from "@app/core/display.service";
 declare var dataLayer: any[];

 function configure(
    $stateProvider: StateProvider,
    $translateProvider: any) {

    $stateProvider
        .state("signin", {
            url: "/signin",
            title: 'auth.signin.shortTitle',
            loginRequired: false,
            onEnter: () => {
                dataLayer.push({'screenPath': 'signin', 'screenName': 'SignIn'});
                dataLayer.push({'event': 'appScreenView'});
            },
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
            },
            urlLocRu: 'https://staminity.com/signin?lang=ru',
            urlLocEn: 'https://staminity.com/signin?lang=en',
            urlLoc: 'landing.main.urlLoc',
            breadcrumb: 'landing.main.breadcrumb',
            subtitle: 'landing.main.subtitle',
            imageUrl: 'https://264710.selcdn.ru/assets/images/website/screens/staminity-main.png'
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
            },
            urlLocRu: 'https://staminity.com/?lang=ru',
            urlLocEn: 'https://staminity.com/?lang=en',
            urlLoc: 'landing.main.urlLoc',
            breadcrumb: 'landing.main.breadcrumb',
            subtitle: 'landing.main.subtitle',
            imageUrl: 'https://264710.selcdn.ru/assets/images/website/screens/staminity-main.png'
        } as StateDeclaration)
        // Представление Auth: SignOut
        .state("signout", {
            url: "/signout",
            title: 'auth.signout.shortTitle',
            loginRequired: false,
            onEnter: () => {
                dataLayer.push({'screenPath': 'signout', 'screenName': 'SignOut'});
                dataLayer.push({'event': 'appScreenView'});
            },
            params: {
                activatePremiumTrial: null,
                activateCoachTrial: null,
                activateClubTrial: null,
            },
            views: {
                "application": { component: "auth" },
            },
            urlLocRu: 'https://staminity.com/?lang=ru',
            urlLocEn: 'https://staminity.com/?lang=en',
            urlLoc: 'landing.main.urlLoc',
            breadcrumb: 'landing.main.breadcrumb',
            subtitle: 'landing.main.subtitle',
            imageUrl: 'https://264710.selcdn.ru/assets/images/website/screens/staminity-main.png'

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
            },
            urlLocRu: 'https://staminity.com/?lang=ru',
            urlLocEn: 'https://staminity.com/?lang=en',
            urlLoc: 'landing.main.urlLoc',
            breadcrumb: 'landing.main.breadcrumb',
            subtitle: 'landing.main.subtitle',
            imageUrl: 'https://264710.selcdn.ru/assets/images/website/screens/staminity-main.png'
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
            },
            urlLocRu: 'https://staminity.com/?lang=ru',
            urlLocEn: 'https://staminity.com/?lang=en',
            urlLoc: 'landing.main.urlLoc',
            breadcrumb: 'landing.main.breadcrumb',
            subtitle: 'landing.main.subtitle',
            imageUrl: 'https://264710.selcdn.ru/assets/images/website/screens/staminity-main.png'
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
            },
            urlLocRu: 'https://staminity.com/?lang=ru',
            urlLocEn: 'https://staminity.com/?lang=en',
            urlLoc: 'landing.main.urlLoc',
            breadcrumb: 'landing.main.breadcrumb',
            subtitle: 'landing.main.subtitle',
            imageUrl: 'https://264710.selcdn.ru/assets/images/website/screens/staminity-main.png'
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
            },
            urlLocRu: 'https://staminity.com/?lang=ru',
            urlLocEn: 'https://staminity.com/?lang=en',
            urlLoc: 'landing.main.urlLoc',
            breadcrumb: 'landing.main.breadcrumb',
            subtitle: 'landing.main.subtitle',
            imageUrl: 'https://264710.selcdn.ru/assets/images/website/screens/staminity-main.png'
        } as StateDeclaration);

    // Текст представлений
    $translateProvider.translations("en", {auth: _translate.en});
    $translateProvider.translations("ru", {auth: _translate.ru});

}

 configure.$inject = ["$stateProvider", "$translateProvider"];

 export default configure;
