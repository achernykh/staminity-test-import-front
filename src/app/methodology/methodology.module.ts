import { module } from "angular";
import { StateProvider } from "angular-ui-router";
import MethodologyComponent from "./methodology.component";
import { methodologyState } from "./methodology.states";

export const Methodology = module("staminity.methodology", [])
    .component("stMethodology", MethodologyComponent)
    .config(["$stateProvider", ($stateProvider: StateProvider) => methodologyState.map((k) => $stateProvider.state(k))])
    .name;
