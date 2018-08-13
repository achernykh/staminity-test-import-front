import {StateDeclaration} from '@uirouter/angularjs';
import { landingConfig } from "./landing.constants";

const main: any = {
    name: 'welcome',
    url: '/',
    title: 'landing.welcome.shortTitle',
    loginRequired: false,
    authRequired: [],
    onEnter: () => window.scrollTo(0,0),
    views: {
        application: {component: 'stLandingMain'}
    },
    urlLocRu: 'https://staminity.com/?lang=ru',
    urlLocEn: 'https://staminity.com/?lang=en',
    urlLoc: 'landing.main.urlLoc',
    breadcrumb: 'landing.main.breadcrumb',
    subtitle: 'landing.main.subtitle',
    imageUrl: 'https://264710.selcdn.ru/assets/images/website/screens/staminity-main.png'
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
    },
    urlLocRu: `landing.${s.code}.urlLocRu`,
    urlLocEn: `landing.${s.code}.urlLocEn`,
    urlLoc: `landing.${s.code}.urlLoc`,
    breadcrumb: `landing.${s.code}.breadcrumb`,
    subtitle: `landing.${s.code}.subtitle`,
    imageUrl: s.picture

}));

const features: any = {
    name: landingConfig.features.code,
    title: `landing.${landingConfig.features.code}.shortTitle`,
    url: landingConfig.features.url,
    loginRequired: false,
    authRequired: [],
    onEnter: () => window.scrollTo(0,0),
    resolve: {
        scenario: () => landingConfig.features,
    },
    views: {
        application: {component: 'stLandingScenario'}
    },
    urlLocRu: 'https://staminity.com/features?lang=ru',
    urlLocEn: 'https://staminity.com/features?lang=en',
    urlLoc: `landing.${landingConfig.features.code}.urlLoc`,
    breadcrumb: `landing.${landingConfig.features.code}.breadcrumb`,
    subtitle: `landing.${landingConfig.features.code}.subtitle`,
    imageUrl: landingConfig.features.picture
};

const tariffs: any = {
    name: 'tariffs',
    title: "landing.tariffs.shortTitle",
    url: "/tariffs",
    loginRequired: false,
    authRequired: null,
    onEnter: () => window.scrollTo(0,0),
    views: {
        application: {component: "landingTariffs"},
    },
    urlLocRu: 'https://staminity.com/tariffs?lang=ru',
    urlLocEn: 'https://staminity.com/tariffs?lang=en',
    urlLoc: 'landing.tariffs.urlLoc',
    breadcrumb: 'landing.tariffs.breadcrumb',
    subtitle: 'landing.tariffs.subtitle',
    imageUrl: 'https://264710.selcdn.ru/assets/images/website/screens/staminity-main.png'
};

export const landingPageState: Array<StateDeclaration> = [main, tariffs, features, ...scenarios];