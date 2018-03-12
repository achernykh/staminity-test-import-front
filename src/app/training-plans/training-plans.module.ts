import {module} from 'angular';
import configure from './training-plans.config';
import {TrainingPlansService} from "./training-plans.service";
import { TrainingPlansStoreComponent } from "./training-plans-store/training-plans-store.component";
import TrainingPlansFilterComponent from "./training-plans-filter/training-plans-filter.component";
import TrainingPlanFormComponent from "./training-plan-form/training-plan-form.component";
import TrainingPlansListComponent from "./training-plans-list/training-plans-list.component";
import TrainingPlanBuilderComponent from "./training-plan-builder/training-plan-builder.component";
import { StateProvider } from "angular-ui-router";
import { trainingPlansState } from "./training-plans.state";
import { TrainingPlanDialogService } from "./training-plan-dialog.service";
import { trainingPlanConfig } from "./training-plan/training-plan.config";
import TrainingPlanComponent from "./training-plan/training-plan.component";
import { supportLng } from "../core/display.constants";
import { _translateTrainingPlans } from "./training-plans.translate";
import { TrainingPlanAssignmentComponent } from "./training-plan-assignment/training-plan-assignment.component";
import { TrainingPlanAssignmentFormComponent } from "./training-plan-assignment/form/training-plan-assignment-form.component";
import { TrainingPlanAssignmentListComponent } from "./training-plan-assignment/list/training-plan-assignment-list.component";
import { TrainingPlansStoreItemsComponent } from "./training-plans-store-items/training-plans-store-items.component";
import { TrainingPlanStoreItemComponent } from "./training-plan-store-item/training-plan-store-item.component";
import { TrainingPlanOrderComponent } from "./training-plan-order-form/training-plan-order.component";
import { TrainingPlanPublishComponent } from "./training-plan-publish/training-plan-publish.component";

export const TrainingPlans = module('staminity.training-plans', [])
    .service('TrainingPlansService', TrainingPlansService)
    .service('TrainingPlanDialogService', TrainingPlanDialogService)
    .component('trainingPlansStore', TrainingPlansStoreComponent)
    .component('trainingPlansFilter', TrainingPlansFilterComponent)
    .component('trainingPlanForm', TrainingPlanFormComponent)
    .component('trainingPlansList', TrainingPlansListComponent)
    .component('stTrainingPlanBuilder', TrainingPlanBuilderComponent)
    .component('stTrainingPlan', TrainingPlanComponent)
    .component('stTrainingPlanAssignment', TrainingPlanAssignmentComponent)
    .component('stTrainingPlanAssignmentForm', TrainingPlanAssignmentFormComponent)
    .component('stTrainingPlanAssignmentList', TrainingPlanAssignmentListComponent)
    .component('stTrainingPlansStoreItems', TrainingPlansStoreItemsComponent)
    .component('stTrainingPlanStoreItem', TrainingPlanStoreItemComponent)
    .component('stTrainingPlanOrder', TrainingPlanOrderComponent)
    .component('stTrainingPlanPublish', TrainingPlanPublishComponent)
    .constant('trainingPlanConfig', trainingPlanConfig)
    .config(['$stateProvider', ($stateProvider: StateProvider) => trainingPlansState.map(s => $stateProvider.state(s))])
    .config(['$translateProvider', ($translate) =>
        supportLng.map(lng => $translate.translations(lng, {trainingSeason: _translateTrainingPlans[lng]}))])
    .config(configure)
    .name;