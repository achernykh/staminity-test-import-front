import { module } from 'angular';

import ReferenceService from "./reference.service";
import ReferenceComponent from './reference.component.ts';
import CathegoriesComponent from './cathegories/cathegories.component.ts';
import TemplatesComponent from './templates/templates.component.ts';
import TemplateComponent from './template/template.component.ts';
import { cathegoryCodeFilter } from './reference.filters.ts';
import config from './reference.config';


export default module('staminity.reference', [])
	.service('ReferenceService', ReferenceService)
	.component('reference', ReferenceComponent)
	.component('cathegories', CathegoriesComponent)
	.component('templates', TemplatesComponent)
	.component('activityTemplate', TemplateComponent)
	.filter('cathegoryCode', cathegoryCodeFilter)
	.config(config)
	.name;