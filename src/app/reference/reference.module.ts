import { module } from 'angular';
import ReferenceComponent from './reference.component.ts';
import CathegoriesComponent from './cathegories/cathegories.component.ts';
import TemplatesComponent from './templates/templates.component.ts';
import TemplateComponent from './template/template.component.ts';
import TemplateIntervalPWComponent from './template-interval-pw/template-interval-pw.component.ts';
import config from './reference.config';


export default module('staminity.reference', [])
	.component('reference', ReferenceComponent)
	.component('cathegories', CathegoriesComponent)
	.component('templates', TemplatesComponent)
	.component('activityTemplate', TemplateComponent)
	.component('templateIntervalPw', TemplateIntervalPWComponent)
	.filter('cathegoryCode', ['ReferenceService', '$translate', (ReferenceService, $translate) => (cathegory) => cathegory && (ReferenceService.cathegoryOwner(cathegory) === 'system'? $translate.instant('category.' + cathegory.code) : cathegory.code)])
	.config(config)
	.name;