import { StateDeclaration, Transition } from "@uirouter/angularjs";
import { SessionService } from "../core/session/session.service";

const userSettings: any = {
    name: 'user-settings',
    abstract: true,
    loginRequired: true,
    authRequired: [],
    reloadOnSearch: false,
    params: {
        userId: null,
    },
    resolve: {
        userId: ["$stateParams", "SessionService", ($stateParams, sessionService: SessionService) => $stateParams.userId || sessionService.getCurrentUserId()],
        owner: ["userId", "UserService", (userId, userService) => userService.getProfile(+userId)],
        //agentProfile: ["AgentService", (agentService) => agentService.getAgentProfile()],
        //agentEnvironment: ["AgentService", (agentService) => agentService.getAgentEnvironment()],
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
    template: require('./settings/user-settings-main/user-settings-main.template.html') as string,
    onEnter: ['$state', '$anchorScroll', ($state, $anchorScroll) => {
        $anchorScroll.yOffset = 72;
        setTimeout(_ => $anchorScroll(), 100);
    }],
};

const userSettingsProfile: any = {
    name: 'user-settings.profile',
    url: '/user-settings/profile?userId',
    loginRequired: false,
    authRequired: [],
    reloadOnSearch: false,
    template: require('./settings/user-settings-profile/user-settings-profile.template.html') as string
};

const userSettingsCoach: any = {
    name: 'user-settings.coach',
    url: '/user-settings/coach?userId',
    loginRequired: false,
    authRequired: [],
    reloadOnSearch: false,
    template: require('./settings/user-settings-coach/user-settings-coach.template.html') as string
};

const userSettingsAgent: any = {
    name: 'user-settings.agent',
    url: '/user-settings/agent?userId',
    loginRequired: false,
    authRequired: [],
    reloadOnSearch: false,
    template: require('./settings/user-settings-agent/user-settings-agent.template.html') as string
};

const userSettingsCards: any = {
    name: 'user-settings.cards',
    url: '/user-settings/cards?userId',
    loginRequired: false,
    authRequired: [],
    reloadOnSearch: false,
    resolve: {
        extAccounts: ["AgentService", (agentService) => agentService.getAgentExtAccounts()],
    },
    template: require('./settings/user-settings-cards/user-settings-cards.template.html') as string,
    controller: ['$scope', 'extAccounts', ($scope, extAccounts) => {
        $scope.extAccounts = extAccounts;
    }],
};

const userSettingsSales: any = {
    name: 'user-settings.sales',
    url: '/user-settings/sales?userId',
    loginRequired: false,
    authRequired: [],
    reloadOnSearch: false,
    resolve: {
        transactions: ["AgentService", (agentService) => agentService.getAgentAccountTransactions()],
    },
    template: require('./settings/user-settings-sales/user-settings-sales.template.html') as string,
    controller: ['$scope', 'transactions', ($scope, transactions) => {
        $scope.transactions = transactions;
    }],
};

const userSettingsWithdrawal: any = {
    name: 'user-settings.withdrawal',
    url: '/user-settings/withdrawal?userId',
    loginRequired: false,
    authRequired: [],
    reloadOnSearch: false,
    resolve: {
        withdrawals: ["AgentService", (agentService) => agentService.getAgentWithdrawals()],
    },
    template: require('./settings/user-settings-withdrawal/user-settings-withdrawal.template.html') as string,
    controller: ['$scope', 'withdrawals', ($scope, withdrawals) => {
        $scope.withdrawals = withdrawals;
    }],
};

const userSettingsFit: any = {
    name: 'user-settings.fit',
    url: '/user-settings/fit?userId',
    loginRequired: false,
    authRequired: [],
    reloadOnSearch: false,
    template: require('./settings/user-settings-fit/user-settings-fit.template.html') as string
};

const userSettingsPrivacy: any = {
    name: 'user-settings.privacy',
    url: '/user-settings/privacy?userId',
    loginRequired: false,
    authRequired: [],
    reloadOnSearch: false,
    template: require('./settings/user-settings-privacy/user-settings-privacy.template.html') as string
};

const userSettingsZones: any = {
    name: 'user-settings.zones',
    url: '/user-settings/zones?userId',
    loginRequired: false,
    authRequired: [],
    reloadOnSearch: false,
    template: require('./settings/user-settings-zones/user-settings-zones.template.html') as string
};

const userSettingsNotifications: any = {
    name: 'user-settings.notifications',
    url: '/user-settings/notifications?userId',
    loginRequired: false,
    authRequired: [],
    reloadOnSearch: false,
    template: require('./settings/user-settings-notifications/user-settings-notifications.template.html') as string
};

export const userState: Array<StateDeclaration> = [
    userSettings, 
    userSettingsMain,
    userSettingsProfile,
    userSettingsCoach,
    userSettingsAgent,
    userSettingsCards,
    userSettingsSales,
    userSettingsWithdrawal,
    userSettingsFit,
    userSettingsPrivacy,
    userSettingsZones,
    userSettingsNotifications,
];