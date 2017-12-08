import { module } from "angular";
import { StateProvider } from "angular-ui-router";
import { methodologyState } from "./methodology.states";
import MethodologyComponent from "./methodology.component";
import { supportLng } from "../core/display.constants";
import { translateMethodology } from "./methodology.translate";
import { PeriodizationService } from "./periodization/periodization.service";
import { PeriodizationSchemeFilterComponent } from "./periodization/periodization-scheme-filter.component";
import { PeriodizationSchemeListComponent } from "./periodization/periodization-scheme-list.component";
import { PeriodizationMesocycleDialogComponent } from "./periodization/periodization-mesocycle-dialog.component";
import { PeriodizationSchemeDialogComponent } from "./periodization/periodization-scheme-dialog.component";
import { PeriodizationDialogService } from "./periodization/periodization-dialog.service";

export const Methodology = module('staminity.methodology', [])
    .component('stMethodology', MethodologyComponent)
    .component('stPeriodizationSchemeFilter', PeriodizationSchemeFilterComponent)
    .component('stPeriodizationSchemeList', PeriodizationSchemeListComponent)
    .component('stPeriodizationMesocycleDialog', PeriodizationMesocycleDialogComponent)
    .component('stPeriodizationSchemeDialog', PeriodizationSchemeDialogComponent)
    .service('PeriodizationService', PeriodizationService)
    .service('PeriodizationDialogService', PeriodizationDialogService)
    .config(['$stateProvider', ($stateProvider: StateProvider) => methodologyState.map(k => $stateProvider.state(k))])
    .config(['$translateProvider', ($translate) =>
        supportLng.map(lng => $translate.translations(lng, {methodology: translateMethodology[lng]}))])
    .name;