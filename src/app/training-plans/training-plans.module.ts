import {module} from 'angular';
import configure from './training-plans.config';
import {TrainingPlansService} from "./training-plans.service";
import TrainingPlansSearchComponent from "./training-plans-search/training-plans-search.component";

const TrainingPlans = module('staminity.training-plans', [])
    .service('TrainingPlansService', TrainingPlansService)
    .component('TrainingPlansSearch', TrainingPlansSearchComponent)
    .config(configure)
    .name;

export default TrainingPlans;