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
        application: {component: 'auth'},
        "form@signup": {
            template: require("./view/signup.html"),
        },
    }
};

export const authState: Array<StateDeclaration> = [signup];