import {module} from "angular";
import { StateProvider } from "angular-ui-router";
import TrainingPlanBuilderComponent from "./training-plan-builder/training-plan-builder.component";
import { TrainingPlanDialogService } from "./training-plan-dialog.service";
import TrainingPlanFormComponent from "./training-plan-form/training-plan-form.component";
import { trainingPlanConfig } from "./training-plan/training-plan.config";
import TrainingPlansFilterComponent from "./training-plans-filter/training-plans-filter.component";
import TrainingPlansListComponent from "./training-plans-list/training-plans-list.component";
import TrainingPlansSearchComponent from "./training-plans-search/training-plans-search.component";
import configure from "./training-plans.config";
import {TrainingPlansService} from "./training-plans.service";
import { trainingPlansState } from "./training-plans.state";

export const TrainingPlans = module("staminity.training-plans", [])
    .service("TrainingPlansService", TrainingPlansService)
    .service("TrainingPlanDialogService", TrainingPlanDialogService)
    .component("trainingPlansSearch", TrainingPlansSearchComponent)
    .component("trainingPlansFilter", TrainingPlansFilterComponent)
    .component("trainingPlanForm", TrainingPlanFormComponent)
    .component("trainingPlansList", TrainingPlansListComponent)
    .component("stTrainingPlanBuilder", TrainingPlanBuilderComponent)
    .constant("trainingPlanConfig", trainingPlanConfig)
    .config(["$stateProvider", ($stateProvider: StateProvider) => trainingPlansState.map((s) => $stateProvider.state(s))])
    .config(configure)
    .name;