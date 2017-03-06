import {StateProvider, StateDeclaration, StateService} from 'angular-ui-router';
import {_translate} from './calendar.translate';
import { DisplayView } from "../core/display.constants";
import UserService from "../core/user.service";
import MessageService from "../core/message.service";
import SessionService from "../core/session.service";
import {IUserProfile} from "../../../api/user/user.interface";



function configure($stateProvider:StateProvider,
                   $translateProvider:any) {

    $stateProvider
        .state('calendar', <StateDeclaration>{
            url: "/calendar",
            loginRequired: true,
            //authRequired: ['user'],
            resolve: {
                view: () => {return new DisplayView('calendar');},
                user: ['SessionService', (SessionService:SessionService) => SessionService.getUser()]
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
        .state('calendar/uri', <StateDeclaration>{
            url: "/calendar/:uri",
            loginRequired: true,
            //authRequired: ['user'],
            resolve: {
                view: () => {return new DisplayView('calendar');},
                user: ['UserService', 'SystemMessageService', '$stateParams',
                    function (UserService:UserService, message:MessageService, $stateParams) {
                        return UserService.getProfile($stateParams.uri)
                            .catch((info)=> {
                                message.systemWarning(info);
                                // TODO перейти на страницу 404
                                throw info;
                            });
                    }],
                athlete: ['SessionService','user', (SessionService: SessionService, user:IUserProfile) =>
                    SessionService.getUser().userId !== user.userId ? user : null]
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