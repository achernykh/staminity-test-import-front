import {StateDeclaration} from '@uirouter/angularjs';
import { landingConfig } from "./landing.constants";

const main: any = {
    name: 'welcome',
    url: '/',
    loginRequired: false,
    authRequired: [],
    onEnter: () => window.scrollTo(0,0),
    views: {
        application: {component: 'stLandingMain'}
    }
};

const scenarios: any[] = landingConfig.scenario.map(s => ({
    name: s.code,
    title: `landing.${s.code}.title`,
    url: s.url,
    loginRequired: false,
    authRequired: [],
    onEnter: () => window.scrollTo(0,0),
    resolve: {
        scenario: () => s
    },
    views: {
        application: {component: 'stLandingScenario'}
    }
}));

const features: any = {
    name: landingConfig.features.code,
    title: `landing.${landingConfig.features.code}.title`,
    url: landingConfig.features.url,
    loginRequired: false,
    authRequired: [],
    onEnter: () => window.scrollTo(0,0),
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
    onEnter: () => window.scrollTo(0,0),
    views: {
        application: {component: "landingTariffs"},
    }
};

export const landingPageState: Array<StateDeclaration> = [main, tariffs, features, ...scenarios];