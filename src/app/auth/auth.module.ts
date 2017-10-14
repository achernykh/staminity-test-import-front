import { module } from 'angular';
import AuthComponent from './auth.component';
import AuthService from './auth.service-ajs';
import configure from './auth.config';

const Auth = module('staminity.auth', [])
	.service('AuthService',AuthService)
	.component('auth', AuthComponent)
	.config(configure)
	.name;

export default Auth;