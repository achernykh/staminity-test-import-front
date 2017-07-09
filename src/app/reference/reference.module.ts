import { module } from 'angular';
import ReferenceComponent from './reference.component.ts';
import CathegoriesComponent from './cathegories/cathegories.component.ts';
import TemplatesComponent from './templates/templates.component.ts';
import config from './reference.config';


export default module('staminity.reference', [])
	.component('reference', ReferenceComponent)
	.component('cathegories', CathegoriesComponent)
	.component('templates', TemplatesComponent)
	.config(config)
	.name;