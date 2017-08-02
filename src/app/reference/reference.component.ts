import { IComponentOptions, IComponentController, IPromise } from 'angular';
import { Subject } from "rxjs/Rx";

import { IActivityCategory, IActivityTemplate } from "../../../api/reference/reference.interface";
import { IActivityType } from "../../../api/activity/activity.interface";
import { IUserProfile } from "../../../api/user/user.interface";
import { IGroupProfile } from "../../../api/group/group.interface";

import IMessageService from "../core/message.service";
import ReferenceService from "./reference.service";
import { pipe, prop, pick, orderBy, groupBy } from '../share/util';
import { filtersToPredicate } from "../share/utility";
import { getType, activityTypes } from "../activity/activity.constants";
import { Owner, getOwner, ReferenceFilterParams, categoriesFilters } from "./reference.datamodel";
import './reference.component.scss';


export class ReferenceCtrl implements IComponentController {

	public user: IUserProfile;
	public categories: Array<IActivityCategory>;
	public categoriesByOwner: { [owner in Owner]: Array<IActivityCategory> };
	public templates: Array<IActivityTemplate>;
	public clubUri: string;
	public club: IGroupProfile;
	
	private filterParams: ReferenceFilterParams = { 
		club: null,
		activityType: activityTypes[0],
		category: null
	};
	
	private tab: 'templates' | 'categories' = 'templates';
	private activityTypes: Array<IActivityType> = activityTypes;
    private destroy: Subject<void> = new Subject<void>();

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

	static $inject = ['$scope', '$mdDialog', '$mdMedia', 'message', 'ReferenceService'];

	constructor (
		private $scope, 
		private $mdDialog, 
		private $mdMedia,
		private message: IMessageService,
		private ReferenceService: ReferenceService
	) {
		
	}

	$onInit () {
		this.filterParams.club = this.club;
		this.updateFilterParams();
		
		this.ReferenceService.activityCategoriesMessages
		.takeUntil(this.destroy)
		.subscribe((message) => {
			let action = this.onCategoriesMessage[message.action];
			if (action) {
				action(message.value);
			}
		});
		
		this.ReferenceService.activityTemplatesMessages
		.takeUntil(this.destroy)
		.subscribe((message) => {
			let action = this.onTemplatesMessage[message.action];
			if (action) {
				action(message.value);
			}
		});
	}
	
	$onChanges () {
		this.updateFilterParams();
	}
	
	$onDestroy () {
		this.destroy.next(); 
		this.destroy.complete();
	}

	updateFilterParams () {
		let filters = pick(['club', 'activityType', 'isActive']) (categoriesFilters);
		let categories = this.categories.filter(filtersToPredicate(filters, this.filterParams));
		let category = this.filterParams.category;
			
		this.filterParams = { 
			...this.filterParams, 
			category: category && categories.find(({ id }) => category.id === id)? category : categories[0]
		};
		
		this.categoriesByOwner = pipe(
			orderBy(prop('sortOrder')),
			groupBy(getOwner(this.user))
		) (categories);
	}

	handleTemplateCreate (template: IActivityTemplate) {
		this.templates = [...this.templates, template];
		this.updateFilterParams();
		this.$scope.$apply();
	}

	handleTemplateUpdate (template: IActivityTemplate) {
		this.templates = this.templates.map((t) => t.id === template.id? template : t);
		this.updateFilterParams();
		this.$scope.$apply();
	}

	handleTemplateDelete (template: IActivityTemplate) {
		this.templates = this.templates.filter((t) => t.id !== template.id);
		this.updateFilterParams();
		this.$scope.$apply();
	}

	handleCategoryCreate (category: IActivityCategory) {
		this.categories = [...this.categories, category];
		this.updateFilterParams();
		this.$scope.$apply();
	}

	handleCategoryUpdate (category: IActivityCategory) {
		this.categories = this.categories.map((c) => c.id === category.id? category : c);
		this.updateFilterParams();
		this.$scope.$apply();
	}

	handleCategoryDelete (category: IActivityCategory) {
		this.categories = this.categories.filter((c) => c.id !== category.id);
		this.updateFilterParams();
		this.$scope.$apply();
	}
	
	get isMobileLayout () : boolean {
		let maxWidth = {
			templates: '1200px',
			categories: '960px'
		} [this.tab];
		
		return this.$mdMedia(`(max-width: ${maxWidth})`);
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