import { StateDeclaration } from "@uirouter/angularjs";
import { SessionService } from "../core/session/session.service";
import GroupService from "../core/group.service";

const methodologyUser: any = {
    name: 'methodology',
    url: '/methodology?state&scheme',
    title: 'methodology.fullTitle',
    loginRequired: true,
    authRequired: [],
    reloadOnSearch: false,
    resolve: {
        currentUser: ['SessionService', (SessionService: SessionService) => SessionService.getUser()],
    },
    views: {
        "application": {
            component: 'stMethodology'
        }
    },
    urlLocRu: 'https://staminity.com/?lang=ru',
    urlLocEn: 'https://staminity.com/?lang=en',
    urlLoc: 'landing.main.urlLoc',
    breadcrumb: 'landing.main.breadcrumb',
    subtitle: 'landing.main.subtitle',
    imageUrl: 'https://264710.selcdn.ru/assets/images/website/screens/staminity-main.png'
};

const methodologyClub: any = {
    name: 'methodology-club',
    url: '/methodology/club/:uri?state&scheme',
    title: 'methodology.fullTitleClub',
    loginRequired: true,
    authRequired: [],
    reloadOnSearch: false,
    resolve: {
        clubUri: ["$stateParams", ($stateParams) => $stateParams.uri],
        club: ["GroupService", "clubUri", (groupService: GroupService, clubUri: string) => groupService.getProfile(clubUri, "club", true)],
        currentUser: ['SessionService', (sessionService: SessionService) => sessionService.getUser()],
    },
    views: {
        "application": {
            component: 'stMethodology'
        }
    },
    urlLocRu: 'https://staminity.com/?lang=ru',
    urlLocEn: 'https://staminity.com/?lang=en',
    urlLoc: 'landing.main.urlLoc',
    breadcrumb: 'landing.main.breadcrumb',
    subtitle: 'landing.main.subtitle',
    imageUrl: 'https://264710.selcdn.ru/assets/images/website/screens/staminity-main.png'
};

export const methodologyState: Array<StateDeclaration> = [methodologyUser, methodologyClub];