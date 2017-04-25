import {StateProvider, StateDeclaration} from 'angular-ui-router';
import {_translateSearch} from './search.translate';
import {DefaultTemplate, DisplayView} from "../core/display.constants";
//import {ITranslateProvider} from "angular-translate";

function configure($stateProvider:StateProvider,
                   $translateProvider:any) {

    $stateProvider
        .state('search', <StateDeclaration>{
            url: '/search',
            loginRequired: false,
            authRequired: null,
            resolve: {
                view: () => new DisplayView('search')
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
                        view: 'view.header',
                        athlete: 'athlete'
                    }
                },
                "application": {
                    component: "search",
                    bindings: {
                        view: 'view.application'
                    }
                }
            }
        });

    // Текст представлений
    $translateProvider.translations('en', {landing: _translateSearch['en']});
    $translateProvider.translations('ru', {landing: _translateSearch['ru']});


}

configure.$inject = ['$stateProvider', '$translateProvider'];

export default configure;