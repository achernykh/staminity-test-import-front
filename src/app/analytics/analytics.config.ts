import {StateDeclaration, StateService} from "@uirouter/angular";
import {DisplayView, DefaultTemplate} from "../core/display.constants";
import SessionService from "../core/session.service";
import {ISessionService} from "../core/session.service";
import GroupService from "../core/group.service";
import {IUserProfile} from "../../../api/user/user.interface";
import {translateAnalytics} from "./analytics.translate";
import ReferenceService from "../reference/reference.service";


function configure($stateProvider: any,
                   $translateProvider:any) {

    $stateProvider
        .state('analytics', <StateDeclaration>{
            url: "/analytics",
            loginRequired: true,
            authRequired: ['user'],
            resolve: {
                view: () => {
                    return new DisplayView('analytics');
                },
                user: ['SessionService', (session:ISessionService) => session.getUser()],
                categories: ['ReferenceService', (reference: ReferenceService) => reference.categories]
                /**coach: ['SessionService', (session:ISessionService) => session.getUser()],
                groupId: ['coach', (coach:IUserProfile) => coach.connections['allAthletes'].groupId],
                athletes: ['GroupService', 'groupId', (group:GroupService, groupId:number) =>
                    group.getManagementProfile(groupId, 'coach')]**/
            },
            views: DefaultTemplate('analytics')
        });

    $translateProvider.translations('en', {analytics: translateAnalytics['en']});
    $translateProvider.translations('ru', {analytics: translateAnalytics['ru']});
}

configure.$inject = ['$stateProvider', '$translateProvider'];
export default configure;