import { Api } from './api.component.js';

export let ApiModule = angular.module('staminity.api',['ng.jsoneditor']);

ApiModule.component('api', Api);