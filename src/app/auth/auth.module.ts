import { module } from "angular";
import AuthComponent from "./auth.component";
import configure from "./auth.config";
import AuthService from "./auth.service";

const Auth = module("staminity.auth", [])
    .service("AuthService", AuthService)
    .component("auth", AuthComponent)
    .config(configure)
    .name;

export default Auth;
