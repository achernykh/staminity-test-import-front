import { module } from 'angular';
import ReferenceComponent from './reference.component.ts';
import config from './reference.config';


export default module('staminity.reference', [])
	.component('reference', ReferenceComponent)
	.config(config)
	.name;