import {StateDeclaration, StateProvider, StateService} from "@uirouter/angularjs";
import {IUserProfile} from "../../../api/user/user.interface";
import {SessionService} from "../core";
import {DefaultTemplate, DisplayView} from "../core/display.constants";
import GroupService from "../core/group.service";
import ReferenceService from "../reference/reference.service";
import {translateAnalytics} from "./analytics.translate";

function configure($stateProvider: StateProvider,
                   $translateProvider: any) {

    $stateProvider
        .state("analytics", {
            url: "/analytics",
            loginRequired: true,
            authRequired: ["user"],
            resolve: {
                view: () => {
                    return new DisplayView("analytics");
                },
                user: ["SessionService", (session: SessionService) => session.getUser()],
                categories: ["ReferenceService", (reference: ReferenceService) =>
                    (reference.categories.length > 0 && reference.categories) ||
                    reference.getActivityCategories(undefined, false, true)],
                /**coach: ['SessionService', (session:ISessionService) => session.getUser()],
                groupId: ['coach', (coach:IUserProfile) => coach.connections['allAthletes'].groupId],
                athletes: ['GroupService', 'groupId', (group:GroupService, groupId:number) =>
                    group.getManagementProfile(groupId, 'coach')]**/
            },
            views: DefaultTemplate("analytics"),
            urlLocRu: 'https://staminity.com/?lang=ru',
            urlLocEn: 'https://staminity.com/?lang=en',
            urlLoc: 'landing.main.urlLoc',
            breadcrumb: 'landing.main.breadcrumb',
            subtitle: 'landing.main.subtitle',
            imageUrl: 'https://264710.selcdn.ru/assets/images/website/screens/staminity-main.png'
        } as StateDeclaration);

    $translateProvider.translations("en", {analytics: translateAnalytics.en});
    $translateProvider.translations("ru", {analytics: translateAnalytics.ru});
}

configure.$inject = ["$stateProvider", "$translateProvider"];
export default configure;
