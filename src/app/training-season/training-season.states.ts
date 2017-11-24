import { StateDeclaration } from "angular-ui-router";
import { SessionService } from "../core/session/session.service";

// План на сезон
// Тренер переходит на стейт с ведением перечня сезонов для последнего открытого атлета
// Пользователь переходит на свой последний сезон
const trainingSeason: any = {
    name: 'training-season',
    url: '/training-season',
    loginRequired: false,
    authRequired: [],
    redirectTo: () => {
        return { state: 'training-season-builder', params: { seasonId: 25 } };
    }
};

const trainingSeasonList: any = {
    name: 'training-season-list',
    url: '/training-season-list/:userId',
    loginRequired: false,
    authRequired: [],
    resolve: {},
    views: {
        "application": {
            component: 'stTrainingSeasonList'
        }
    }
};

const trainingSeasonBuilder: any = {
    name: 'training-season-builder',
    url: '/training-season-builder/:seasonId',
    loginRequired: false,
    authRequired: [],
    resolve: {
        currentUser: ['SessionService', (session: SessionService) => session.getUser()],
        owner: ['SessionService', (session: SessionService) => session.getUser()]
    },
    views: {
        "application": {
            component: 'stTrainingSeasonBuilder'
        }
    }
};

export const trainingSeasonState: Array<StateDeclaration> = [trainingSeason, trainingSeasonList, trainingSeasonBuilder];