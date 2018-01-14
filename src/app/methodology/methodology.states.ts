import { StateDeclaration } from "angular-ui-router";
import { SessionService } from "../core/session/session.service";
import GroupService from "../core/group.service";

const methodologyUser: any = {
    name: 'methodology',
    url: '/methodology?state&scheme',
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
    }
};

const methodologyClub: any = {
    name: 'methodology-club',
    url: '/methodology/club/:uri?state&scheme',
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
    }
};

export const methodologyState: Array<StateDeclaration> = [methodologyUser, methodologyClub];