import { StateDeclaration, Transition } from "angular-ui-router";
import { SessionService } from "../core/session/session.service";
import { TrainingSeasonService } from "./training-season.service";
import { IUserProfile } from "../../../api/user/user.interface";
import AuthService from "../auth/auth.service";

// План на сезон
// Тренер переходит на стейт с ведением перечня сезонов для последнего открытого атлета
// Пользователь переходит на свой последний сезон
const trainingSeason: any = {
    name: 'training-season',
    url: '/training-season',
    loginRequired: false,
    authRequired: [],
    params: {
        athlete: null,
        season: null
    },
    resolve: {
        currentUser: ['SessionService', (session: SessionService) => session.getUser()],
        plans: ['TrainingSeasonService', (trainingSeasonService: TrainingSeasonService, currentUser: IUserProfile) =>
            trainingSeasonService.get({ userId: currentUser.userId })]
    },
    redirectTo: (trans: Transition) => {
        let currentUser: IUserProfile = trans.injector().get('SessionService').getUser();
        let authService: AuthService = trans.injector().get('AuthService');
        let trainingSeasonService: TrainingSeasonService = trans.injector().get('TrainingSeasonService');

        if (!authService.isCoach()) {

        } else {
            return trainingSeasonService.get({userId: currentUser.userId})
                .then(response => response && ({
                        state: 'training-season-builder',
                        params: {
                            athlete: currentUser,
                            season: response.arrayResult[0]
                        }
                    }));
        }
        //return { state: 'training-season-builder', params: { seasonId: 25 } };
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
    url: '/training-season-builder/',
    loginRequired: false,
    authRequired: [],
    params: {
        athlete: null,
        season: null
    },
    resolve: {
        currentUser: ['SessionService', (session: SessionService) => session.getUser()],
        owner: ['SessionService', (session: SessionService) => session.getUser()],
        seasons: ['TrainingSeasonService', 'currentUser',
            (trainingSeasonService: TrainingSeasonService, currentUser: IUserProfile) =>
                trainingSeasonService.get({ userId: currentUser.userId })
                    .then(result => result && result.arrayResult)]
    },
    views: {
        "application": {
            component: 'stTrainingSeasonBuilder'
        }
    }
};

export const trainingSeasonState: Array<StateDeclaration> = [trainingSeason, trainingSeasonList, trainingSeasonBuilder];