import { IComponentOptions, IComponentController, IPromise } from 'angular';
import { IActivityCategory, IActivityTemplate } from "../../../api/reference/reference.interface";
import { IUserProfile } from "../../../api/user/user.interface";

import { getType, activityTypes } from "../activity/activity.constants";
import './reference.component.scss';


class ReferenceCtrl implements IComponentController {

	static $inject = ['$scope', '$mdDialog', 'message', 'ReferenceService'];

	private user : IUserProfile;
	private cathegories : Array<IActivityCategory>;
	private templates : Array<IActivityTemplate>;
	private activityTypes : Array<any> = activityTypes;
	private templatesFilters : any = { 
		activityType: activityTypes[0],
		cathegory: null
	};
	private cathegoriesFilters : any = { activityType: activityTypes[0] };
	private tab : number = 0;

	private onTemplatesChange = this.handleTemplatesChange.bind(this);
	private onTemplatesMessage = {
		"I": this.handleTemplateCreate.bind(this),
		"U": this.handleTemplateUpdate.bind(this),
		"D": this.handleTemplateDelete.bind(this)
	};
	
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

	$onInit () {
		this.ReferenceService.messages
		.subscribe((message) => {
			let action = this.onTemplatesMessage[message.action];
			if (action) {
				action(message.value);
			}
		});
	}

	get templatesFilterCathegories () : Array<IActivityCategory> {
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

	handleTemplateCreate (template) {
		this.templates = [...this.templates, template];
		this.$scope.$apply();
	}

	handleTemplateUpdate (template) {
		this.templates = this.templates.map((t) => t.id === template.id? template : t);
		this.$scope.$apply();
	}

	handleTemplateDelete (template) {
		this.templates = this.templates.filter((t) => t.id !== template.id);
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