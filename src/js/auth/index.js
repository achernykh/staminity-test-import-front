import {Auth} from './auth.component.js';

export let module = angular.module('staminity.auth', []);
module.component('auth', Auth);
module.config(($stateProvider)=> {
    // Представление Auth: SignIn
    $stateProvider
        .state('signin', {
            url: "/signin",
            loginRequired: false,
            authRequired: ['func1'],
            resolve: {
                view: function (ViewService) {
                    return ViewService.getParams('signin')
                }
            },
            views: {
                "background": {
                    component: "staminityBackground",
                    bindings: {view: 'view.background'}
                },
                "header": {
                    component: 'staminityHeader',
                    bindings: {view: 'view.header'}
                },
                "application": {
                    component: "auth",
                    bindings: {view: 'view.application'}
                },
                "form@signin": {
                    templateUrl: 'auth/state/signin.html'
                }
            }
        })
        // Представление Auth: SignUp
        .state('signup', {
            url: "/signup",
            loginRequired: false,
            authRequired: ['func1'],
            resolve: {
                view: function (ViewService) {
                    return ViewService.getParams('signup')
                }
            },
            views: {
                "background": {
                    component: "staminityBackground",
                    bindings: {view: 'view.background'}
                },
                "header": {
                    component: 'staminityHeader',
                    bindings: {view: 'view.header'}
                },
                "application": {
                    component: "auth",
                    bindings: {view: 'view.application'}
                },
                "form@signup": {
                    templateUrl: 'auth/state/signup.html'
                }
            }
        })
        // Представление Auth: SignOut
        .state('signout', {
            url: "/signout",
            loginRequired: true,
            authRequired: ['func1'],
            onEnter: ($state, SessionService, UserService) => {
                SessionService.delToken()
                $state.go('signin')
            }

        })
        // Представление Auth: Confirm
        .state('confirm', {
            url: "/confirm",
            loginRequired: false,
            authRequired: ['func1'],
            onEnter: ($state, $location, SessionService, AuthService, SystemMessageService) => {
                console.log('confirm=', $location.search(), $location.search().hasOwnProperty('request'))
                // Если пользователь проше по ссылке в письме
                if ($location.search().hasOwnProperty('request')) {
                    AuthService.confirm({request: $location.search().request})
                        .then((success) => {
                            console.log('confirm success=', success)
                            SystemMessageService.show(success.title, success.status, success.delay)
                            $state.go('signin')
                        }, (error) => {
                            SystemMessageService.show(error)
                            $state.go('signup')
                        })
                } else {
                    //TODO Добавить sysmessage
                    $state.go('signup')
                }
            }

        })
})


