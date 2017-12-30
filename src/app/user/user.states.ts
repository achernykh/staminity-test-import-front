import { StateDeclaration, Transition } from "angular-ui-router";
import { SessionService } from "../core/session/session.service";

const userSettings: any = {
    name: 'user-settings',
    abstract: true,
    loginRequired: false,
    authRequired: [],
    reloadOnSearch: false,
    params: {
        userId: null,
    },
    resolve: {
        
    },
    views: {
        "application": {
            component: 'stUserSettings'
        }
    },
};

const userSettingsMain: any = {
    name: 'user-settings.main',
    url: '/user-settings?userId',
    loginRequired: false,
    authRequired: [],
    reloadOnSearch: false,
    template: require('./settings/user-settings-main/user-settings-main.template.html') as string
};

const userSettingsProfile: any = {
    name: 'user-settings.profile',
    url: '/user-settings/profile?userId',
    loginRequired: false,
    authRequired: [],
    reloadOnSearch: false,
    template: require('./settings/user-settings-profile/user-settings-profile.template.html') as string
};

const userSettingsFit: any = {
    name: 'user-settings.fit',
    url: '/user-settings/fit?userId',
    loginRequired: false,
    authRequired: [],
    reloadOnSearch: false,
    component: 'stUserSettingsFit',
};

const userSettingsPrivacy: any = {
    name: 'user-settings.privacy',
    url: '/user-settings/privacy?userId',
    loginRequired: false,
    authRequired: [],
    reloadOnSearch: false,
    component: 'stUserSettingsPrivacy',
};

const userSettingsZones: any = {
    name: 'user-settings.zones',
    url: '/user-settings/zones?userId',
    loginRequired: false,
    authRequired: [],
    reloadOnSearch: false,
    component: 'stUserSettingsZones',
};

const userSettingsNotifications: any = {
    name: 'user-settings.notifications',
    url: '/user-settings/notifications?userId',
    loginRequired: false,
    authRequired: [],
    reloadOnSearch: false,
    component: 'stUserSettingsNotifications',
};

export const userState: Array<StateDeclaration> = [
    userSettings, 
    userSettingsMain,
    userSettingsProfile,
    userSettingsFit,
    userSettingsPrivacy,
    userSettingsZones,
    userSettingsNotifications,
];