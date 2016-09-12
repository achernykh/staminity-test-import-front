import { SignIn, SignUp, SignOut } from './auth.component.js';

export let AuthModule = angular.module('staminity.auth',[]);

AuthModule.component('signIn', SignIn);
AuthModule.component('signUp', SignUp);
AuthModule.component('signOut', SignOut);

