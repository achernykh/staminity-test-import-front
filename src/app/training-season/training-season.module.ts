import { module } from "angular";
import { StateProvider } from "angular-ui-router";
import { TrainingSeasonFormComponent } from "./training-season-form/training-season-form.component";
import { TrainingSeasonListComponent } from "./training-season-list/training-season-list.component";
import { TrainingSeasonService } from "./training-season.service";
import { trainingSeasonState } from "./training-season.states";
import TrainingSeasonBuilderComponent from "./training-season-builder/training-season-builder.component";

export const TrainingSeason = module('staminity.training-season', [])
    .service('TrainingSeasonService', TrainingSeasonService)
    .component('stTrainingSeasonBuilder', TrainingSeasonBuilderComponent)
    .component('stTrainingSeasonForm', TrainingSeasonFormComponent)
    .component('stTrainingSeasonList', TrainingSeasonListComponent)
    .config(['$stateProvider', ($stateProvider: StateProvider) => trainingSeasonState.map(s => $stateProvider.state(s))])
    .name;