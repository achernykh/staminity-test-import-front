import { StateDeclaration } from "angular-ui-router";
import { SessionService } from "../core";
import { TrainingPlansService } from "./training-plans.service";

const trainingPlanStore: any = {
    name: 'training-plans-store',
    url: '/training-plans/store',
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

const trainingPlanId: any = {
    name: 'training-plan-id',
    url: '/training-plan/?planId',
    loginRequired: false,
    authRequired: [],
    resolve: {
        currentUser: ['SessionService', (SessionService: SessionService) => SessionService.getUser()],
        planId: ['$stateParams', ($stateParams) => $stateParams.planId]
    },
    views: {
        "application": {
            component: 'stTrainingPlan'
        }
    }
};

export const trainingPlansState: Array<StateDeclaration> =
    [trainingPlanStore, trainingPlanBuilder, trainingPlanBuilderId, trainingPlanId];