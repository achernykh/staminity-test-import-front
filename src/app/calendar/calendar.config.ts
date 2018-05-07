import {StateProvider, StateDeclaration, StateService} from '@uirouter/angularjs';
import {_translate} from './calendar.translate';
import { DisplayView, DefaultTemplate } from "../core/display.constants";
import UserService from "../core/user.service";
import MessageService from "../core/message.service";
import {IUserProfile} from "../../../api/user/user.interface";
import {IAuthService} from "../auth/auth.service";
import { SessionService, SocketService } from "../core";

function configure($stateProvider:StateProvider,
                   $translateProvider:any) {

    $stateProvider
        /*.state('calendar-my', <StateDeclaration>{
            url: "/calendar",
            loginRequired: true,
            authRequired: ['user'],
            resolve: {
                view: () => {return new DisplayView('calendar');},
                currentUser: ['SessionService', (session: SessionService) => session.getUser()],
                owner: ['SessionService', (session: SessionService) => session.getUser()],
            },
            views: {
                "application": {
                    component: "stCalendar"
                }
            }
        })*/
        .state('calendar', <StateDeclaration>{
            //parent: 'socket',
            url: "/calendar?userId",
            loginRequired: true,
            authRequired: ['user'],
            reloadOnSearch: false,
            resolve: {
                init: ['SocketService', (socket: SocketService) => socket.init()],
                view: () => {return new DisplayView('calendar');},
                currentUser: ['SessionService', (session: SessionService) => session.getUser()],
                owner: ['SessionService', (session: SessionService) => session.getUser()],
                /**user: ['UserService', 'message', '$stateParams',
                    function (UserService:UserService, message:MessageService, $stateParams) {
                        return UserService.getProfile($stateParams.uri)
                            .catch((info)=> {
                                message.systemWarning(info);
                                // TODO перейти на страницу 404
                                throw info;
                            });
                    }],**/
                athlete: ['SessionService', '$stateParams', (SessionService: SessionService, $stateParams) =>
                    SessionService.getUser().userId !== $stateParams.userId ? $stateParams.userId : null],
                /**checkPermissions: ['AuthService', 'SessionService', 'message','athlete',
                    (AuthService:IAuthService, SessionService: SessionService, message:MessageService, athlete:IUserProfile) => {
                        if(athlete) {
                            if (AuthService.isCoach()) {
                                return AuthService.isMyAthlete(<IUserProfile>{userId: Number(athlete)})
                                    .catch((error)=>{
                                        athlete = null;
                                        message.systemWarning(error);
                                        throw error;
                                    });
                            } else {
                                athlete = null;
                                message.systemWarning('forbidden_InsufficientRights');
                                throw 'need permissions';
                            }
                        }
                }]**/
            },
            views: {
                "application": {
                    component: "stCalendar"
                }
            }
        });

    // Текст представлений
    $translateProvider.translations('en', {calendar: _translate['en']});
    $translateProvider.translations('ru', {calendar: _translate['ru']});

}

configure.$inject = ['$stateProvider', '$translateProvider'];

export default configure;