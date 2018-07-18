import {StateDeclaration} from '@uirouter/angularjs';
import { landingConfig } from "./landing.constants";

const main: any = {
    name: 'main',
    url: '/main',
    loginRequired: false,
    authRequired: [],
    views: {
        application: {component: 'stLandingMain'}
    }
};

const scenarios: any[] = landingConfig.scenario.map(s => ({
    name: s.code,
    url: s.url,
    loginRequired: false,
    authRequired: [],
    resolve: {
        scenario: () => s
    },
    views: {
        application: {component: 'stLandingScenario'}
    }
}));

export const landingPageState: Array<StateDeclaration> = [main, ...scenarios];