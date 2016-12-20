/**
 * Created by akexander on 22/07/16.
 */

import translateApp from './translate/appbox.translate'
import {_APP_MENU} from './translate/appmenu.translate.js'
import {_USER_MENU} from './translate/usermenu.translate.js'
import {_SETTINGS} from './translate/settings.translate.js'
import {_FORM} from './translate/form.translate.js'
import {_MESSAGE} from './translate/message.translate.js'

function AppConfig($locationProvider, $mdThemingProvider, $translateProvider, $stateProvider,
                   $urlRouterProvider, $sceDelegateProvider) {
    'ngInject';

    //TODO добавить коммент
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    })
    // https://docs.angularjs.org/api/ng/provider/$sceDelegateProvider#resourceUrlWhitelist
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://maps.googleapis.com/**'
    ])

    $urlRouterProvider.otherwise('/')


    // Настройка state (Представлений)
    // TODO переписать на какой-нибуь структурированный массив в Settings
    $stateProvider
        .state('welcome', {
            url: "/",
            access: [],
            resolve: {
                view: function (ViewService) {
                    return ViewService.getParams('welcome')
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
                    component: "landingPage",
                    bindings: {
                        view: 'view.application'
                    }
                }
            }
        })
        // Тестовое представления для отправки/получения запросов по WS
        .state('api', {
            url: "/api",
            loginRequired: false,
            authRequired: ['func1'],
            resolve: {
                view: function (ViewService) {
                    return ViewService.getParams('api')
                },
                wsRequired: function(SocketService) {
                    return SocketService.open()
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
                    component: "api",
                    bindings: {view: 'view.application'}
                }
            }
        })
        // Представление Календарь
        .state('calendar', {
            url: "/calendar",
            loginRequired: true,
            authRequired: ['func1'],
            resolve: {
                view: function (ViewService) {
                    return ViewService.getParams('calendar')
                },
                wsRequired: function(SocketService) {
                    return SocketService.open()
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
                    component: "calendar",
                    bindings: {
                        view: 'view.application'
                    }
                }
            }
        })
        .state('user', {
            url: "/user/:uri",
            loginRequired: true,
            authRequired: ['func1'],
            resolve: {
                view: function (ViewService) {
                    return ViewService.getParams('user')
                },
                user: function (UserService, $stateParams) {
                    return UserService.getProfile($stateParams.uri)
                },
                wsRequired: function (SocketService) {
                    return SocketService.open()
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
                    component: "user",
                    bindings: {
                        view: 'view.application'
                    }
                }
            }
        })
        .state('club', {
            url: "/club/:uri",
            loginRequired: true,
            authRequired: ['func1'],
            resolve: {
                view: function (ViewService) {
                    return ViewService.getParams('club')
                },
                user: function (UserService, $stateParams) {
                    return UserService.getProfile($stateParams.uri)
                },
                wsRequired: function (SocketService) {
                    return SocketService.open()
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
                    component: "club",
                    bindings: {
                        view: 'view.application'
                    }
                }
            }
        })
        .state('users', {
            url: "/users",
            loginRequired: true,
            authRequired: ['func1'],
            resolve: {
                view: function (ViewService) {
                    return ViewService.getParams('users')
                },
                wsRequired: function (SocketService) {
                    return SocketService.open()
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
                    component: "users",
                    bindings: {
                        view: 'view.application'
                    }
                }
            }
        })

    // Основная цветовая схема 'серо-голубой' с акцентом 'оранжевый'
    $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey', {
            'default': '500',
            'hue-1': '50',
            'hue-2': '600',
            'hue-3': '800'
        })
        .accentPalette('orange', {
            'default': 'A700',
            'hue-1': '50',
            'hue-2': '600',
            'hue-3': '800'
        })
        .warnPalette('red', {
            'default': 'A700'
        });
    // Дополнительная цветовая схема для контрастных форм и фрагментов,
    // с темным задним фоном
    $mdThemingProvider.theme('dark')
        .primaryPalette('deep-orange')
        .accentPalette('blue-grey', {
            'default': '800',
            'hue-1': '50',
            'hue-2': '600',
            'hue-3': '800'
        })
        .warnPalette('red')
        .backgroundPalette('blue-grey', {
            'default': '800',
            'hue-1': '50',
            'hue-2': '600',
            'hue-3': '800'
        }).dark()

    // Текст представлений
    $translateProvider.translations('en', {app: translateApp['en']});
    $translateProvider.translations('ru', {app: translateApp['ru']});
    $translateProvider.translations('ru', {appMenu: _APP_MENU['ru']});
    $translateProvider.translations('en', {appMenu: _APP_MENU['en']});
    $translateProvider.translations('ru', {userMenu: _USER_MENU['ru']});
    $translateProvider.translations('en', {userMenu: _USER_MENU['en']});
    $translateProvider.translations('ru', {settings: _SETTINGS['ru']});
    $translateProvider.translations('en', {settings: _SETTINGS['en']});
    $translateProvider.translations('ru', {form: _FORM['ru']});
    $translateProvider.translations('en', {form: _FORM['en']});
    $translateProvider.translations('ru', {message: _MESSAGE['ru']});
    $translateProvider.translations('en', {message: _MESSAGE['en']});

    $translateProvider.preferredLanguage('ru');
    $translateProvider.fallbackLanguage('ru');

}
export default AppConfig;
