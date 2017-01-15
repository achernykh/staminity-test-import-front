import { module } from 'angular';
import AuthComponent from './auth.component';
import configure from './auth.config';

const Auth = module('staminity.auth', [])
	.component('auth', AuthComponent)
	.config(configure)
	.name;

export default Auth;