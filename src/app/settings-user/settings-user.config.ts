import {StateProvider, StateDeclaration, StateService} from 'angular-ui-router';
import {_translate} from './settings-user.translate';
import { DisplayView } from "../core/display.constants";

function configure(
    $stateProvider:StateProvider,
    $translateProvider: any) {

    $stateProvider
        .state('settings/user', <StateDeclaration>{
            url: "/settings/user/:uri",
            loginRequired: true,
            authRequired: ['func1'],
            //view: _display_view['settings'],
            resolve: {
                /*view: function (ViewService) {
                    return ViewService.getParams('settings')
                },*/
                view: () => {return new DisplayView('settings');},
                user: ['UserService', 'SystemMessageService', '$stateParams',
                    function (UserService, SystemMessageService, $stateParams) {
                        return UserService.getProfile($stateParams.uri)
                            .catch((error)=> {
                                SystemMessageService.show(error,'warning');
                                // TODO перейти на страницу 404
                                throw error;
                            });
                }]
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
                    component: "settingsUser",
                    bindings: {
                        view: 'view.application',
                        user: 'user'
                    }
                }
            }
        });

    // Текст представлений
    $translateProvider.translations('en', {"settings": _translate['en']});
    $translateProvider.translations('ru', {"settings": _translate['ru']});

}

configure.$inject = ['$stateProvider','$translateProvider'];

export default configure;