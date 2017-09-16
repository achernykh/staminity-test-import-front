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
	public categories: Array<IActivityCategory> = [];
	public categoriesByOwner: { [owner in Owner]: Array<IActivityCategory> };
	public templates: Array<IActivityTemplate> = [];
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

		this.categories = this.ReferenceService.categories;
		this.ReferenceService.categoriesChanges
		.takeUntil(this.destroy)
		.subscribe((categories) => {
			this.categories = categories;
			this.updateFilterParams();
			this.$scope.$apply();
		});

		this.templates = this.ReferenceService.templates;
		this.ReferenceService.templatesChanges
		.takeUntil(this.destroy)
		.subscribe((templates) => {
			this.templates = templates;
			this.updateFilterParams();
			this.$scope.$apply();
		});

		this.updateFilterParams();
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
		clubUri: '<',
		club: '<'
	},
	controller: ReferenceCtrl,
	template: require('./reference.component.html') as string
};


export default ReferenceComponent;