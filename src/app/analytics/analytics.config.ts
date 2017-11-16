import {StateProvider, StateDeclaration, StateService} from 'angular-ui-router';
import {DisplayView, DefaultTemplate} from "../core/display.constants";
import {SessionService} from "../core";
import GroupService from "../core/group.service";
import {IUserProfile} from "../../../api/user/user.interface";
import {translateAnalytics} from "./analytics.translate";
import ReferenceService from "../reference/reference.service";


function configure($stateProvider:StateProvider,
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
                user: ['SessionService', (session: SessionService) => session.getUser()],
                categories: ['ReferenceService', (reference: ReferenceService) =>
                    (reference.categories.length > 0 && reference.categories) ||
                    reference.getActivityCategories(undefined, false, true)]
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