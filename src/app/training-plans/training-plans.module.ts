import {module} from 'angular';
import configure from './training-plans.config';
import {TrainingPlansService} from "./training-plans.service";
import TrainingPlansSearchComponent from "./training-plans-search/training-plans-search.component";
import TrainingPlansFilterComponent from "./training-plans-filter/training-plans-filter.component";
import TrainingPlanFormComponent from "./training-plan-form/training-plan-form.component";
import TrainingPlansListComponent from "./training-plans-list/training-plans-list.component";
import TrainingPlanBuilderComponent from "./training-plan-builder/training-plan-builder.component";
import { StateProvider } from "angular-ui-router";
import { trainingPlansState } from "./training-plans.state";

const TrainingPlans = module('staminity.training-plans', [])
    .service('TrainingPlansService', TrainingPlansService)
    .component('trainingPlansSearch', TrainingPlansSearchComponent)
    .component('trainingPlansFilter', TrainingPlansFilterComponent)
    .component('trainingPlanForm', TrainingPlanFormComponent)
    .component('trainingPlansList', TrainingPlansListComponent)
    .component('stTrainingPlanBuilder', TrainingPlanBuilderComponent)
    .config(['$stateProvider', ($stateProvider: StateProvider) => trainingPlansState.map(k => $stateProvider.state(k))])
    .config(configure)
    .name;

export default TrainingPlans;