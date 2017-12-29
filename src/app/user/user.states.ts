import { StateDeclaration, Transition } from "angular-ui-router";
import { SessionService } from "../core/session/session.service";

const userSettings: any = {
    name: 'user-settings',
    url: '/user-settings?userId',
    loginRequired: false,
    authRequired: [],
    reloadOnSearch: false,
    params: {
        userId: null,
    },
    resolve: {
        currentUser: ['SessionService', (session: SessionService) => session.getUser()]
    },
    views: {
        "application": {
            component: 'stUserSettings'
        }
    }
};

const userSettingsDetails: any = {
    name: 'user-settings-details',
    loginRequired: false,
    authRequired: [],
    reloadOnSearch: false,
    params: {
        userId: null,
    },
    resolve: {
        currentUser: ['SessionService', (session: SessionService) => session.getUser()]
    },
    views: {
        "application": {
            component: 'stUserSettingsDetails'
        }
    }
};

const userSettingsProfile: any = {
    name: 'user-settings-details.profile',
    url: '/user-settings/profile?userId',
    loginRequired: false,
    authRequired: [],
    reloadOnSearch: false,
    params: {
        userId: null,
    },
    resolve: {
        currentUser: ['SessionService', (session: SessionService) => session.getUser()]
    },
    views: {
        settingsSectionTitle: {
            template: 'Основная информация'
        },
        settingsSectionContent: {
            component: 'stUserSettingsProfile',
        },
    },
};

const userSettingsFit: any = {
    name: 'user-settings-details.fit',
    url: '/user-settings/fit?userId',
    loginRequired: false,
    authRequired: [],
    reloadOnSearch: false,
    params: {
        userId: null,
    },
    resolve: {
        currentUser: ['SessionService', (session: SessionService) => session.getUser()]
    },
    component: 'stUserSettingsFit',
};

const userSettingsPrivacy: any = {
    name: 'user-settings-details.privacy',
    url: '/user-settings/privacy?userId',
    loginRequired: false,
    authRequired: [],
    reloadOnSearch: false,
    params: {
        userId: null,
    },
    resolve: {
        currentUser: ['SessionService', (session: SessionService) => session.getUser()]
    },
    component: 'stUserSettingsPrivacy',
};

const userSettingsZones: any = {
    name: 'user-settings-details.zones',
    url: '/user-settings/zones?userId',
    loginRequired: false,
    authRequired: [],
    reloadOnSearch: false,
    params: {
        userId: null,
    },
    resolve: {
        currentUser: ['SessionService', (session: SessionService) => session.getUser()]
    },
    component: 'stUserSettingsZones',
};

const userSettingsNotifications: any = {
    name: 'user-settings-details.notifications',
    url: '/user-settings/notifications?userId',
    loginRequired: false,
    authRequired: [],
    reloadOnSearch: false,
    params: {
        userId: null,
    },
    resolve: {
        currentUser: ['SessionService', (session: SessionService) => session.getUser()]
    },
    component: 'stUserSettingsNotifications',
};

export const userState: Array<StateDeclaration> = [
    userSettings, 
    userSettingsDetails, 
    userSettingsProfile,
    userSettingsFit,
    userSettingsPrivacy,
    userSettingsZones,
    userSettingsNotifications,
];