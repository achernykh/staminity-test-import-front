import { module } from 'angular';
import { SeasonPlanService } from "./season-plan.service";

export const SeasonPlan = module('staminity.season-plan', [])
    .service('SeasonPlanService', SeasonPlanService)
    .name;
