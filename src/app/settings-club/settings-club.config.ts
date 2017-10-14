import {StateDeclaration, StateService} from "@uirouter/angular";
import {_translate} from './settings-club.translate';
import { DisplayView, DefaultTemplate } from "../core/display.constants";
import GroupService from "../core/group.service";
import {IAuthService} from "../auth/auth.service-ajs";
import MessageService from "../core/message.service";

function configure(
    $stateProvider: any,
    $translateProvider: any) {
    
        $stateProvider
            .state('settings/club', <StateDeclaration> {
                url: "/settings/club/:uri",
                loginRequired: true,
                authRequired: ['func1'],
                resolve: {
                    view: () => new DisplayView('settingsClub'),
                    checkPermissions: ['AuthService', '$stateParams', 'message',
                        (AuthService:IAuthService, $stateParams, message:MessageService)=> {
                            return AuthService.isMyClub($stateParams.uri).catch(error => {
                                message.systemWarning(error);
                                throw error;
                            });
                        }],
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
    $translateProvider.translations('en', {"settingsClub": _translate['en']});
    $translateProvider.translations('ru', {"settingsClub": _translate['ru']});

}

configure.$inject = ['$stateProvider','$translateProvider'];

export default configure;