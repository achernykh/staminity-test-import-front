import { module } from "angular";
import { StateProvider } from "angular-ui-router";
import { methodologyState } from "./methodology.states";
import MethodologyComponent from "./methodology.component";
import { supportLng } from "../core/display.constants";
import { translateMethodology } from "./methodology.translate";

export const Methodology = module('staminity.methodology', [])
    .component('stMethodology', MethodologyComponent)
    .config(['$stateProvider', ($stateProvider: StateProvider) => methodologyState.map(k => $stateProvider.state(k))])
    .config(['$translateProvider', ($translate) =>
        supportLng.map(lng => $translate.translations(lng, {methodology: translateMethodology[lng]}))])
    .name;