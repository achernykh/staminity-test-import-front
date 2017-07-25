import { IComponentOptions, IComponentController, IPromise } from 'angular';
import { IActivityType } from "../../../../api/activity/activity.interface";
import { IActivityCategory, IActivityTemplate } from "../../../../api/reference/reference.interface";
import { IUserProfile } from "../../../../api/user/user.interface";
import { IGroupProfile } from "../../../../api/group/group.interface";

import IMessageService from '../../core/message.service';
import ReferenceService from "../reference.service";
import { filtersToPredicate } from "../../share/utility";
import { ReferenceFilterParams, categoriesFilters, Owner, getOwner, isOwner } from "../reference.datamodel";
import { CategoryDialogCtrl } from '../category-dialog/category-dialog.controller';
import { getType, activityTypes } from "../../activity/activity.constants";
import { isManager } from "../../club/club.datamodel";
import { pipe, prop, last, filter, fold, orderBy, groupBy, keys, entries, isUndefined } from '../../share/util';

import './categories.component.scss';


class CategoriesCtrl implements IComponentController {

	public user: IUserProfile;
	public categories: Array<IActivityCategory>;
	public templates: Array<IActivityTemplate>;
	public club: IGroupProfile;
	public filterParams: ReferenceFilterParams;
	
	private categoriesByOwner: { [owner in Owner]: Array<IActivityCategory> };
	private activityTypes: Array<IActivityType> = activityTypes;
	private getType: (id: number) => IActivityType = getType;

	static $inject = ['$scope', '$mdDialog', 'message', 'ReferenceService'];

	constructor (
		private $scope, 
		private $mdDialog, 
		private message: IMessageService,
		private ReferenceService: ReferenceService
	) {
		
	}

	$onChanges (changes) {
		this.handleChanges();
	}

	handleChanges () {
		this.categoriesByOwner = pipe(
			filter(filtersToPredicate(categoriesFilters, this.filterParams)),
			orderBy(prop('sortOrder')),
			groupBy(getOwner(this.user))
		) (this.categories);
	}

	categoryReorder (index: number, category: IActivityCategory) {
		let { id, code, description, groupProfile, visible } = category;
		let owner = getOwner(this.user)(category);
		let groupId = groupProfile && groupProfile.groupId;
		let targetCategory = this.categoriesByOwner[owner][index];
		let sortOrder = targetCategory? targetCategory.sortOrder : 999999;

		this.ReferenceService.putActivityCategory(id, code, description, groupId, sortOrder, visible)
		.catch((info) => { 
			this.message.systemWarning(info);
			throw info;
		});
	}

	createCategory () {
		let data = { 
			activityTypeId: this.filterParams.activityType.id,
			groupProfile: this.club
		};
		
		this.categoryDialog(data, 'create');
	}

	selectCategory (category: IActivityCategory) {
		let mode: CategoryDialogCtrl.Mode  = isOwner(this.user, category) || isManager(this.user, this.club)? 'edit' : 'view';
		this.categoryDialog(category, mode);
	}

	categoryDialog (category: any, mode: CategoryDialogCtrl.Mode) {
		let locals = {
			mode,
			category: { ...category },
			user: this.user
		};
		
		return this.$mdDialog.show({
			template: require('../category-dialog/category-dialog.template.html') as string,
			controller: CategoryDialogCtrl,
			locals: locals,
			controllerAs: '$ctrl',
			clickOutsideToClose: true
		});
	}
}

const CategoriesComponent: IComponentOptions = {
	bindings: {
		user: '<',
		categories: '<',
		filterParams: '<',
		club: '<'
	},
	controller: CategoriesCtrl,
	template: require('./categories.component.html') as string
};


export default CategoriesComponent;