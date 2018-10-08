import {StateDeclaration} from '@uirouter/angularjs';
import ReferenceService from "../reference/reference.service";
import { SessionService } from "../core/session/session.service";

const analyticsPage: any = {
    name: 'analytics',
    url: '/analytics',
    loginRequired: true,
    onEnter: () => window.scrollTo(0,0),
    resolve: {
        //TODO transfer to component?
        owner: ["SessionService", (session: SessionService) => session.getUser()],
        user: ['owner', owner => owner],
        athletes: ["owner", owner => owner.public.isCoach && owner.connections.hasOwnProperty('allAthletes') ?
            owner.connections.allAthletes.groupMembers : null],
        categories: ['ReferenceService', (reference: ReferenceService) =>
            (reference.categories.length > 0 && reference.categories) ||
            reference.getActivityCategories(undefined, false, true)]
    },
    views: {
        application: {component: 'stAnalytics'}
    }
};

export const analyticsPageState: Array<StateDeclaration> = [analyticsPage];