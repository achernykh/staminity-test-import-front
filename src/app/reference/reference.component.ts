import { IComponentOptions, IComponentController, IPromise } from 'angular';
import { IActivityCategory, IActivityTemplate } from "../../../api/reference/reference.interface";
import { IActivityType } from "../../../api/activity/activity.interface";
import { IUserProfile } from "../../../api/user/user.interface";
import { IGroupProfile } from "../../../api/group/group.interface";

import { getType, activityTypes } from "../activity/activity.constants";
import { ReferenceFilterParams, constrainFilterParams } from "./reference.datamodel";
import './reference.component.scss';


class ReferenceCtrl implements IComponentController {

	public user: IUserProfile;
	public categories: Array<IActivityCategory>;
	public templates: Array<IActivityTemplate>;
	public clubUri: string;
	public club: IGroupProfile;
	
	private filterParams: ReferenceFilterParams = { 
		club: null,
		activityType: activityTypes[0],
		category: null
	};
	
	private tab: number = 0;
	private activityTypes: Array<IActivityType> = activityTypes;

	private onTemplatesMessage = {
		"I": this.handleTemplateCreate.bind(this),
		"U": this.handleTemplateUpdate.bind(this),
		"D": this.handleTemplateDelete.bind(this)
	};

	private onCategoriesMessage = {
		"I": this.handleCategoryCreate.bind(this),
		"U": this.handleCategoryUpdate.bind(this),
		"D": this.handleCategoryDelete.bind(this)
	};

	static $inject = ['$scope', '$mdDialog', 'message', 'ReferenceService'];

	constructor (
		private $scope, 
		private $mdDialog, 
		private message,
		private ReferenceService
	) {
		this.tab = 0;
	}

	$onInit () {
		this.filterParams.club = this.club;
		
		this.ReferenceService.activityCategoriesMessages
		.subscribe((message) => {
			let action = this.onCategoriesMessage[message.action];
			if (action) {
				action(message.value);
			}
		});
		
		this.ReferenceService.activityTemplatesMessages
		.subscribe((message) => {
			let action = this.onTemplatesMessage[message.action];
			if (action) {
				action(message.value);
			}
		});
	}

	get templatesFilterCategories () : Array<IActivityCategory> {
		let activityTypeId = this.filterParams.activityType.id;
		return this.categories.filter((category) => category.activityTypeId === activityTypeId);
	}

	updateFilters (filterParams: ReferenceFilterParams, changes: any = {}) : ReferenceFilterParams {
		return constrainFilterParams({ ...filterParams, ...changes });
	}

	handleTemplateCreate (template: IActivityTemplate) {
		this.templates = [...this.templates, template];
		this.$scope.$apply();
	}

	handleTemplateUpdate (template: IActivityTemplate) {
		this.templates = this.templates.map((t) => t.id === template.id? template : t);
		this.$scope.$apply();
	}

	handleTemplateDelete (template: IActivityTemplate) {
		this.templates = this.templates.filter((t) => t.id !== template.id);
		this.$scope.$apply();
	}

	handleCategoryCreate (category: IActivityCategory) {
		this.categories = [...this.categories, category];
		this.$scope.$apply();
	}

	handleCategoryUpdate (category: IActivityCategory) {
		this.categories = this.categories.map((c) => c.id === category.id? category : c);
		this.$scope.$apply();
	}

	handleCategoryDelete (category: IActivityCategory) {
		this.categories = this.categories.filter((c) => c.id !== category.id);
		this.$scope.$apply();
	}
}

const ReferenceComponent: IComponentOptions = {
	bindings: {
		user: '<',
		categories: '<',
		templates: '<',
		clubUri: '<',
		club: '<'
	},
	controller: ReferenceCtrl,
	template: require('./reference.component.html') as string
};


export default ReferenceComponent;