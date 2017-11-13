import { StateDeclaration } from "angular-ui-router";

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
    url: '/training-plan/builder',
    loginRequired: false,
    authRequired: [],
    views: {
        "application": {
            component: 'stTrainingPlanBuilder'
        }
    }
};

export const trainingPlansState: Array<StateDeclaration> = [trainingPlanSearch, trainingPlanBuilder];