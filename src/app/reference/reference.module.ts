import { module } from 'angular';

import ReferenceService from "./reference.service";
import ReferenceComponent from './reference.component.ts';
import CategoriesComponent from './categories/categories.component.ts';
import CategoryComponent from './category/category.component.ts';
import TemplatesComponent from './templates/templates.component.ts';
import TemplateComponent from './template/template.component.ts';
import { categoryCodeFilter } from './reference.filters.ts';
import config from './reference.config';


export default module('staminity.reference', [])
	.service('ReferenceService', ReferenceService)
	.component('reference', ReferenceComponent)
	.component('categories', CategoriesComponent)
	.component('category', CategoryComponent)
	.component('templates', TemplatesComponent)
	.component('activityTemplate', TemplateComponent)
	.filter('categoryCode', categoryCodeFilter)
	.config(config)
	.name;