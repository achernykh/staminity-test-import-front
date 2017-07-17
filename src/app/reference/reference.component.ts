import { IComponentOptions, IComponentController, IPromise } from 'angular';
import { IActivityCategory, IActivityTemplate } from "../../../api/reference/reference.interface";

import { activityTypes } from './reference.constants';
import './reference.component.scss';


class ReferenceCtrl implements IComponentController {

	static $inject = ['$scope', '$mdDialog', 'message', 'ReferenceService'];

	private user : any;
	private cathegories : any;
	private templates : Array<IActivityTemplate>;
	private activityTypes : Array<any> = activityTypes;
	private templatesFilters : any = { 
		activityType: activityTypes[0],
		cathegory: null
	};
	private cathegoriesFilters : any = { activityType: activityTypes[0] };
	private tab : number = 0;

	private onTemplatesChange = this.handleTemplatesChange.bind(this);
	private onTemplateChange = this.handleTemplateChange.bind(this);
	private onTemplateDelete = this.handleTemplateDelete.bind(this);
	private onCathegoriesChange = this.handleCathegoriesChange.bind(this);
	private onCathegoryChange = this.handleCathegoryChange.bind(this);
	private onCathegoryDelete = this.handleCathegoryDelete.bind(this);

	constructor (
		private $scope, 
		private $mdDialog, 
		private message,
		private ReferenceService
	) {
		this.tab = 0;
	}

	get templatesFilterCathegories () {
		let activityTypeId = this.templatesFilters.activityType.id;
		let cathegoryId = this.templatesFilters.cathegory && this.templatesFilters.cathegory.id;
		let cathegories = this.cathegories.filter((cathegory) => cathegory.activityTypeId === activityTypeId);
		if (!cathegories.find((cathegory) => cathegory.id === cathegoryId)) {
			this.templatesFilters = this.updateFilters(this.templatesFilters, { cathegory: cathegories[0] });
		}
		return cathegories;
	}

	updateFilters (filters, changes = {}) {
		return { ...filters, ...changes };
	}

	handleTemplatesChange () {
		this.ReferenceService.getActivityTemplates(undefined, undefined, false, false)
		.then((templates) => {
			this.templates = templates;
			this.$scope.$apply();
		})
		.catch((info) => { 
			this.message.systemWarning(info);
			throw info;
		});
	}

	handleTemplateChange (id, changes) {
		this.templates = this.templates.map((template) => template.id === id? { ...template, ...changes } : template);
		this.$scope.$apply();
	}

	handleTemplateDelete (id) {
		this.templates = this.templates.filter((template) => template.id !== id);
		this.$scope.$apply();
	}

	handleCathegoriesChange () {
		this.ReferenceService.getActivityCategories(undefined, false, true)
		.then((cathegories) => {
			this.cathegories = cathegories;
			this.$scope.$apply();
		})
		.catch((info) => { 
			this.message.systemWarning(info);
			throw info;
		});
	}

	handleCathegoryChange (id, changes) {
		this.cathegories = this.cathegories.map((cathegory) => cathegory.id === id? { ...cathegory, ...changes } : cathegory);
		this.$scope.$apply();
	}

	handleCathegoryDelete (id) {
		this.cathegories = this.cathegories.filter((cathegory) => cathegory.id !== id);
		this.$scope.$apply();
	}
}

const ReferenceComponent: IComponentOptions = {
	bindings: {
		user: '<',
		auth: '<',
		cathegories: '<',
		templates: '<'
	},
	controller: ReferenceCtrl,
	template: require('./reference.component.html') as string
};


export default ReferenceComponent;