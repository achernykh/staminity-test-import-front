import { Auth } from './auth.component.js';

export let AuthModule = angular.module('staminity.auth',[]);

AuthModule.component('auth', Auth);
//AuthModule.component('signUp', SignUp);
//AuthModule.component('signOut', SignOut);

