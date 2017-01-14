import Settings from './settings.component';
import ClubSettings from './clubSettings.component';

let module = angular.module('staminity.settings',[]);

    module
    .component('settings', Settings)
    .component('clubSettings', ClubSettings);
    
    module.config(($stateProvider)=>{
        $stateProvider
            .state('clubSettings', {
                url: "/settings/club/:uri",
                loginRequired: true,
                authRequired: ['func1'],
                resolve: {
                    view: function (ViewService) {
                        return ViewService.getParams('settings')
                    },
                    club: function (GroupService, $stateParams) {
                        return GroupService.getProfile('/club/' + $stateParams.uri)
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
                        component: "clubSettings",
                        bindings: {
                            view: 'view.application',
                            club: 'club'
                        }
                    }
                }
            })
            .state('settings', {
                url: "/settings/user/:uri",
                loginRequired: true,
                authRequired: ['func1'],
                resolve: {
                    view: function (ViewService) {
                        return ViewService.getParams('settings')
                    },
                    user: function (UserService, SystemMessageService, $stateParams) {
                        return UserService.getProfile($stateParams.uri)
                                .catch((error)=> {
                                    SystemMessageService.show(error,'warning');
                                    // TODO перейти на страницу 404
                                    throw error;
                                })
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
