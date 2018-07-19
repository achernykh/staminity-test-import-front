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

const features: any = {
    name: landingConfig.features.code,
    url: landingConfig.features.url,
    loginRequired: false,
    authRequired: [],
    resolve: {
        scenario: () => landingConfig.features,
    },
    views: {
        application: {component: 'stLandingScenario'}
    }
};

const tariffs: any = {
    name: 'tariffs',
    url: "/tariffs",
    loginRequired: false,
    authRequired: null,
    views: {
        application: {component: "landingTariffs"},
    }
};

export const landingPageState: Array<StateDeclaration> = [main, tariffs, features, ...scenarios];