import ClubSettings from './clubSettings.component';

let module = angular.module('staminity.clubSettings',[]);

    module
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

    })

export default module;
