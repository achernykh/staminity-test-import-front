import { module } from "angular";
import { StateProvider } from "@uirouter/angularjs";
import { TrainingSeasonFormComponent } from "./training-season-form/training-season-form.component";
import { TrainingSeasonListComponent } from "./training-season-list/training-season-list.component";
import { TrainingSeasonService } from "./training-season.service";
import { trainingSeasonState } from "./training-season.states";
import TrainingSeasonBuilderComponent from "./training-season-builder/training-season-builder.component";
import { TrainingSeasonDataComponent } from "./training-season-data/training-season-data.component";
import { TrainingSeasonChartComponent } from "./training-season-chart/training-season-chart.component";
import { supportLng } from "../core/display.constants";
import { translateTrainingSeason } from "./training-season.translate";
import { TrainingSeasonDialogSerivce } from './training-season-dialog.service';
import { trainingSeasonSettings } from './training-season.settings';

export const TrainingSeason = module('staminity.training-season', [])
    .constant('TrainingSeasonSettings', trainingSeasonSettings)
    .service('TrainingSeasonService', TrainingSeasonService)
    .service('TrainingSeasonDialogService', TrainingSeasonDialogSerivce)
    .component('stTrainingSeasonBuilder', TrainingSeasonBuilderComponent)
    .component('stTrainingSeasonForm', TrainingSeasonFormComponent)
    .component('stTrainingSeasonList', TrainingSeasonListComponent)
    .component('stTrainingSeasonData', TrainingSeasonDataComponent)
    .component('stTrainingSeasonChart', TrainingSeasonChartComponent)
    .config(['$stateProvider', ($stateProvider: StateProvider) => trainingSeasonState.map(s => $stateProvider.state(s))])
    .config(['$translateProvider', ($translate) =>
        supportLng.map(lng => $translate.translations(lng, {trainingSeason: translateTrainingSeason[lng]}))])
    .name;