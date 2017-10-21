import { module } from 'angular';
import AuthComponent from './auth.component';
import { AuthService } from '../../app4/auth/auth.service';
import configure from './auth.config';
import { downgradeInjectable } from "@angular/upgrade/static";

const Auth = module('staminity.auth', [])
	//.service('AuthService',AuthService)
	.service('AuthService', downgradeInjectable(AuthService))
	.component('auth', AuthComponent)
	.config(configure)
	.name;

export default Auth;