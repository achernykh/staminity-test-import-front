import {StateProvider, StateDeclaration, StateService} from 'angular-ui-router';
import {_translate} from './calendar.translate';
import { DisplayView } from "../core/display.constants";


function configure($stateProvider:StateProvider,
                   $translateProvider:any) {

    $stateProvider
        .state('calendar', <StateDeclaration>{
            url: "/calendar",
            loginRequired: true,
            authRequired: ['user'],
            resolve: {
                view: () => {return new DisplayView('calendar');},
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
        });

    // Текст представлений
    $translateProvider.translations('en', {calendar: _translate['en']});
    $translateProvider.translations('ru', {calendar: _translate['ru']});

}

configure.$inject = ['$stateProvider', '$translateProvider'];

export default configure;