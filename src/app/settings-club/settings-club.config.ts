import {StateProvider, StateDeclaration, StateService} from 'angular-ui-router';
import {_translate} from './settings-club.translate';
import { DisplayView, DefaultTemplate } from "../core/display.constants";
import GroupService from "../core/group.service";

function configure(
    $stateProvider:StateProvider,
    $translateProvider: any) {
    
        $stateProvider
            .state('settings/club', <StateDeclaration> {
                url: "/settings/club/:uri",
                loginRequired: true,
                authRequired: ['func1'],
                resolve: {
                    view: () => new DisplayView('settings'),
                    club: ['GroupService','$stateParams',(GroupService:GroupService, $stateParams) =>
                        GroupService.getProfile($stateParams.uri, 'club')]
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
                        component: "settingsClub",
                        bindings: {
                            view: 'view.application',
                            club: 'club'
                        }
                    }
                }
            });

    // Текст представлений
    $translateProvider.translations('en', {"user": _translate['en']});
    $translateProvider.translations('ru', {"user": _translate['ru']});

}

configure.$inject = ['$stateProvider','$translateProvider'];

export default configure;