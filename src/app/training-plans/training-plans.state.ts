import { StateDeclaration } from "angular-ui-router";
import { SessionService } from "../core";

const trainingPlanSearch: any = {
    name: 'training-plans-search',
    url: '/training-plans/search',
    loginRequired: false,
    authRequired: [],
    views: {
        "application": {
            component: 'trainingPlansSearch'
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
    url: '/training-plan-builder/:planId',
    loginRequired: false,
    authRequired: [],
    resolve: {
        planId: ['$stateParams', ($stateParams) => $stateParams.planId]
    },
    views: {
        "application": {
            component: 'stTrainingPlanBuilder'
        }
    }
};

const trainingPlanId: any = {
    name: 'training-plan-id',
    url: '/training-plan/:planId',
    loginRequired: false,
    authRequired: [],
    resolve: {
        user: ['SessionService', (SessionService: SessionService) => SessionService.getUser()],
        planId: ['$stateParams', ($stateParams) => $stateParams.planId]
    },
    views: {
        "application": {
            component: 'stTrainingPlan'
        }
    }
};

export const trainingPlansState: Array<StateDeclaration> =
    [trainingPlanSearch, trainingPlanBuilder, trainingPlanBuilderId, trainingPlanId];