import { module } from 'angular';
import AthletesComponent from './athletes.component.js';
import configure from './athletes.config';

const Athletes = module('staminity.athletes', ['ngMaterial', 'staminity.share'])
    .component('athletes', AthletesComponent)
    .config(configure)
    .name;

export default Athletes;
