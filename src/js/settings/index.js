import Settings from './settings.component';

let module = angular.module('staminity.settings',[]);

    module
    .component('settings', Settings);
    
    module.config(($stateProvider)=>{
        $stateProvider
            .state('userSettings', {
                url: "/settings/user/:uri",
                loginRequired: true,
                authRequired: ['func1'],
                resolve: {
                    view: function (ViewService) {
                        return ViewService.getParams('settings')
                    },
                    user: function (UserService, $stateParams) {
                        return UserService.getProfile($stateParams.uri)
                    }
                },
                views: {
                    "background": {
                        component: "staminityBackground",
                        bindings: {
                            view: 'view.background'
                        }
                    },
                    "header": {
                        component: 'staminityHeader',
                        bindings: {
                            view: 'view.header'
                        }
                    },
                    "application": {
                        component: "settings",
                        bindings: {
                            view: 'view.application',
                            user: 'user'
                        }
                    }
                }
            })
            .state('settings', {
                url: "/settings",
                loginRequired: true,
                authRequired: ['func1'],
                resolve: {
                    view: function (ViewService) {
                        return ViewService.getParams('settings')
                    },
                    userId: function (SessionService) {
                        return SessionService.getUser().userId
                    },
                    user: function (UserService, userId) {
                        return UserService.getProfile(userId)
                    }
                },
                views: {
                    "background": {
                        component: "staminityBackground",
                        bindings: {
                            view: 'view.background'
                        }
                    },
                    "header": {
                        component: 'staminityHeader',
                        bindings: {
                            view: 'view.header'
                        }
                    },
                    "application": {
                        component: "settings",
                        bindings: {
                            view: 'view.application',
                            user: 'user'
                        }
                    }
                }
            })

    })

export default module;
