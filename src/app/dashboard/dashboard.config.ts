import {StateProvider, StateDeclaration, StateService} from 'angular-ui-router';
import {_translate} from './dashboard.translate';
import { DisplayView } from "../core/display.constants";
import UserService from "../core/user.service";

function configure(
    $stateProvider:StateProvider,
    $translateProvider: any) {



    $stateProvider
        .state('dashboard', <StateDeclaration>{
            url: "/dashboard",
            //loginRequired: true,
            //authRequired: ['func1'],
            //view: _display_view['settings'],
            resolve: {
                /*view: function (ViewService) {
                 return ViewService.getParams('settings')
                 },*/
                view: () => {return new DisplayView('dashboard');},
                user: ['UserService', 'SystemMessageService', '$stateParams',
                    function (UserService:UserService, SystemServiceMessage, $stateParams) {
                        return UserService.getProfile($stateParams.uri)
                            .catch((error)=> {
                                SystemServiceMessage.show(error,'warning');
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
                    component: "dashboard",
                    bindings: {
                        view: 'view.application',
                        user: 'user',
                        idGroup: 'idGroup'
                    }
                }
            }
        });

    // Текст представлений
    $translateProvider.translations('en', {"dashboard": _translate['en']});
    $translateProvider.translations('ru', {"dashboard": _translate['ru']});

}

configure.$inject = ['$stateProvider','$translateProvider'];

export default configure;