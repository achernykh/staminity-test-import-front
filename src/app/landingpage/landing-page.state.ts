import {StateDeclaration} from '@uirouter/angularjs';

const main: any = {
    name: 'main',
    url: '/main',
    loginRequired: false,
    authRequired: [],
    views: {
        application: {component: 'stLandingMain'}
    }

};

export const landingPageState: Array<StateDeclaration> = [main];