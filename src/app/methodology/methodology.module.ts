import { module } from "angular";
import { StateProvider } from "angular-ui-router";
import { methodologyState } from "./methodology.states";
import MethodologyComponent from "./methodology.component";

export const Methodology = module('staminity.methodology', [])
    .component('stMethodology', MethodologyComponent)
    .config(['$stateProvider', ($stateProvider: StateProvider) => methodologyState.map(k => $stateProvider.state(k))])
    .name;