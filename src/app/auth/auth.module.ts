import { module } from "angular";
import AuthComponent from "./auth.component";
import configure from "./auth.config";
import AuthService from "./auth.service";
import {StateProvider} from "@uirouter/angularjs";
import {authState} from "./auth.state";

const Auth = module("staminity.auth", [])
    .service("AuthService", AuthService)
    .component("auth", AuthComponent)
    .config(['$stateProvider', ($stateProvider: StateProvider) => authState.map(s => $stateProvider.state(s))])
    .config(configure)
    .name;

export default Auth;
