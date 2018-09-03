import { StateDeclaration } from "@uirouter/angularjs";
import { SessionService } from "../core";
import { TrainingPlansService } from "./training-plans.service";

const trainingPlanStore: any = {
    name: 'training-plans-store',
    title: 'trainingPlans.store.fullTitle',
    url: '/training-plans-store?state',
    params: {
        state: null,
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
    },
    urlLocRu: 'https://staminity.com/training-plans-store?state=store&lang=ru',
    urlLocEn: 'https://staminity.com/training-plans-store?state=store&lang=en',
    urlLoc: 'trainingPlans.store.urlLoc',
    breadcrumb: 'trainingPlans.store.breadcrumb',
    subtitle: 'trainingPlans.store.subtitle',
    imageUrl: 'https://264710.selcdn.ru/assets/images/website/screens/scenario-06.png'
};

const trainingPlanBuilder: any = {
    name: 'training-plan-builder',
    title: 'trainingPlans.builder.fullTitle',
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
    title: 'trainingPlans.builder.fullTitle',
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
    title: 'trainingPlans.preview.title',
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
    url: '/plan/:planId',
    title: 'trainingPlans.builder.fullTitle',
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