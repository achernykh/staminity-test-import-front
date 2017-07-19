import { module } from 'angular';
import ReferenceComponent from './reference.component.ts';
import CathegoriesComponent from './cathegories/cathegories.component.ts';
import TemplatesComponent from './templates/templates.component.ts';
import TemplateComponent from './template/template.component.ts';
import TemplateIntervalPWComponent from './template-interval-pw/template-interval-pw.component.ts';
import { cathegoryOwner } from './reference.datamodel';
import config from './reference.config';


export default module('staminity.reference', [])
	.component('reference', ReferenceComponent)
	.component('cathegories', CathegoriesComponent)
	.component('templates', TemplatesComponent)
	.component('activityTemplate', TemplateComponent)
	.component('templateIntervalPw', TemplateIntervalPWComponent)
	.filter('cathegoryCode', ['SessionService', '$translate', (SessionService, $translate) => (cathegory) => {
		if (cathegory) {
			let user = SessionService.getUser(); 
			let isSystem = cathegoryOwner(user)(cathegory) === 'system';
			return isSystem? $translate.instant('category.' + cathegory.code) : cathegory.code;
		}
	}])
	.config(config)
	.name;