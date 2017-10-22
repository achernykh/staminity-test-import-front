import { IComponentOptions, IComponentController, IPromise } from 'angular';
import { IActivityCategory } from "../../../../api/reference/reference.interface";

import IMessageService from '../../core/message.service';
import ReferenceService from "../reference.service";
import { path } from '../../../app4/share/utilities';
import { getType, activityTypes } from "../../activity/activity.constants";
import './category.component.scss';


class CategoryCtrl implements IComponentController {

	public category: IActivityCategory;

	static $inject = ['$scope', '$filter', '$mdDialog', '$mdMedia', 'message', 'ReferenceService'];

	constructor (
		private $scope, 
		private $filter, 
		private $mdDialog,
		private $mdMedia,
		private message: IMessageService,
		private ReferenceService: ReferenceService
	) {
		
	}

	get isEnabled () {
		return this.category.visible;
	}
	
	set isEnabled (visible) {
		let { id, code, description, groupProfile, sortOrder } = this.category;
		let groupId = groupProfile && groupProfile.groupId;

		this.ReferenceService.putActivityCategory(id, code, description, groupId, sortOrder, visible)
		.catch((info) => { 
			this.message.systemWarning(info);
			throw info;
		});
	}
	
	get activityTypeCode () {
	    return getType(this.category.activityTypeId).code;
	}
}


const CategoryComponent: IComponentOptions = {
	bindings: {
		category: '<'
	},
	controller: CategoryCtrl,
	template: require('./category.component.html') as string
};


export default CategoryComponent;