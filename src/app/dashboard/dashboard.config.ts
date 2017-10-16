import {StateDeclaration, StateService} from "@uirouter/angular";
import {translateDashboard, translateDashboardClub} from "./dashboard.translate";
import {DisplayView} from "../core/display.constants";
import SessionService from "../core/session.service";
import {ISessionService} from "../core/session.service";
import GroupService from "../core/group.service";
import {IUserProfile} from "../../../api/user/user.interface";

function configure($stateProvider: any,
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
        })
        .state('dashboard/club', <StateDeclaration>{
            url: "/dashboard/club/:uri",
            loginRequired: true,
            authRequired: ['user'],
            resolve: {
                view: () => {return new DisplayView('dashboardClub');},
                coach: ['SessionService', (session:ISessionService) => session.getUser()],
                groupId: ['coach','$stateParams', (coach:IUserProfile, $stateParams) =>
                    coach.connections['ControlledClubs'].filter(club => club.groupUri === $stateParams.uri)[0].groupId],
                athletes: ['GroupService', 'groupId', (group:GroupService, groupId:number) =>
                    group.getManagementProfile(groupId ,'club').then(profile => {
                        profile.members = profile.members.filter(member =>member.roleMembership.some(role => role === 'ClubAthletes'));
                        return profile;
                    })]
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
    $translateProvider.translations('en', {dashboardClub: translateDashboardClub['en']});
    $translateProvider.translations('ru', {dashboardClub: translateDashboardClub['ru']});
}

configure.$inject = ['$stateProvider', '$translateProvider'];
export default configure;