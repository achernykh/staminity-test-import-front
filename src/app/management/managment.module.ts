import { module } from 'angular';
import ManagementComponent from './management.component.js';
import configure from './management.config';

const Management = module('staminity.management', ['ngMaterial', 'staminity.share'])
    .component('users', ManagementComponent)
    .config(configure)
    .name;

export default Management;