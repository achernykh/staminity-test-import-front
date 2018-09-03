import {StateDeclaration} from '@uirouter/angularjs';

const signup: any = {
    name: 'signup-new',
    url: '/signup-new',
    loginRequired: false,
    authRequired: [],
    params: {
        activatePremiumTrial: null,
        activateCoachTrial: null,
        activateClubTrial: null,
    },
    views: {
        "application": {
            component: "auth",
            bindings: "view.application",
        },
        "form@signup": {
            template: require("./view/signup.html"),
        },
    },
    urlLocRu: 'https://staminity.com/?lang=ru',
    urlLocEn: 'https://staminity.com/?lang=en',
    urlLoc: 'landing.main.urlLoc',
    breadcrumb: 'landing.main.breadcrumb',
    subtitle: 'landing.main.subtitle',
    imageUrl: 'https://264710.selcdn.ru/assets/images/website/screens/staminity-main.png'
};

export const authState: Array<StateDeclaration> = [signup];