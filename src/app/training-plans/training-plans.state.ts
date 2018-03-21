import { StateDeclaration } from "angular-ui-router";
import { SessionService } from "../core";
import { TrainingPlansService } from "./training-plans.service";

const trainingPlanStore: any = {
    name: 'training-plans-store',
    url: '/training-plans/store',
    params: {
        ownerId: null,
        tags: null,
        type: null,
        distanceType: null,
        lang: null
    },
    loginRequired: false,
    authRequired: [],
    views: {
        "application": {
            component: 'trainingPlansStore'
        }
    }
};

const trainingPlanBuilder: any = {
    name: 'training-plan-builder',
    url: '/training-plan-builder',
    loginRequired: false,
    authRequired: [],
    views: {
        "application": {
            component: 'stTrainingPlanBuilder'
        }
    }
};

const trainingPlanBuilderId: any = {
    name: 'training-plan-builder-id',
    url: '/training-plan-builder/?planId',
    loginRequired: false,
    authRequired: [],
    reloadOnSearch: false,
    resolve: {
        currentUser: ['SessionService', (session: SessionService) => session.getUser()]
    },
    views: {
        "application": {
            component: 'stTrainingPlanBuilder'
        }
    }
};

const trainingPlanPreview: any = {
    name: 'training-plan-preview',
    url: '/training-plan-preview/?planId',
    loginRequired: false,
    authRequired: [],
    resolve: {
        currentUser: ['SessionService', (SessionService: SessionService) => SessionService.getUser()],
        planId: ['$stateParams', ($stateParams) => JSON.parse($stateParams.planId)],
        store: () => false
    },
    views: {
        "application": {
            component: 'stTrainingPlan'
        }
    }
};

const trainingPlanLanding: any = {
    name: 'plan',
    url: '/plan/?planId',
    loginRequired: false,
    authRequired: [],
    resolve: {
        currentUser: ['SessionService', (SessionService: SessionService) => SessionService.getUser()],
        planId: ['$stateParams', ($stateParams) => JSON.parse($stateParams.planId)],
        store: () => true
    },
    views: {
        "application": {
            component: 'stTrainingPlan'
        }
    }
};

export const trainingPlansState: Array<StateDeclaration> =
    [trainingPlanStore, trainingPlanBuilder, trainingPlanBuilderId, trainingPlanPreview, trainingPlanLanding];