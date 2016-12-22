import Settings from './settings.component';

let module = angular.module('staminity.settings',[]);
    module.component('settings', Settings);
    module.config(($stateProvider)=>{
        $stateProvider
            .state('settings', {
                url: "/settings/:uri",
                loginRequired: true,
                authRequired: ['func1'],
                resolve: {
                    view: function (ViewService) {
                        return ViewService.getParams('settings')
                    },
                    wsRequired: function(SocketService, UserService, $stateParams) {
                        return SocketService.open()
                    },
                    user: function (wsRequired, UserService, $stateParams, SystemMessageService) {
                        return UserService.getProfile($stateParams.uri)
                            .catch((error) => {
                                SystemMessageService.show(error,'warning')
                                // TODO перейти на страницу 404
                                throw error
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
