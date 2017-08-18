import { module } from 'angular';

import ReferenceService from "./reference.service";
import ReferenceComponent from './reference.component';
import CategoriesComponent from './categories/categories.component';
import CategoryComponent from './category/category.component';
import TemplatesComponent from './templates/templates.component';
import TemplateComponent from './template/template.component';
import { categoryCodeFilter } from './reference.filters';
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