import {StateProvider, StateDeclaration, StateService} from 'angular-ui-router';
import {translateDashboard} from "./dashboard.translate";
import {DisplayView} from "../core/display.constants";
import SessionService from "../core/session.service";
import {ISessionService} from "../core/session.service";
import GroupService from "../core/group.service";
import {IUserProfile} from "../../../api/user/user.interface";

function configure($stateProvider:StateProvider,
                   $translateProvider:any) {

    $stateProvider
        .state('dashboard', <StateDeclaration>{
            url: "/dashboard",
            loginRequired: true,
            authRequired: ['user'],
            resolve: {
                view: () => {return new DisplayView('dashboard');},
                coach: ['SessionService', (session:ISessionService) => session.getUser()],
                groupId: ['coach', (coach:IUserProfile) => coach.connections['allAthletes'].groupId],
                athletes: ['GroupService', 'groupId', (group:GroupService, groupId:number) =>
                    group.getManagementProfile(groupId ,'coach')]
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
                        view: 'view.application'
                    }
                }
            }
        });


    // Текст представлений
    $translateProvider.translations('en', {dashboard: translateDashboard['en']});
    $translateProvider.translations('ru', {dashboard: translateDashboard['ru']});
}

configure.$inject = ['$stateProvider', '$translateProvider'];
export default configure;