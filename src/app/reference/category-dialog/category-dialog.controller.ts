import { IComponentController } from 'angular';
import { IUserProfile } from "../../../../api/user/user.interface";
import { IActivityType } from "../../../../api/activity/activity.interface";
import { IActivityCategory, IActivityTemplate } from "../../../../api/reference/reference.interface";

import IMessageService from '../../core/message.service';
import ReferenceService from '../reference.service';
import { isSystem } from '../reference.datamodel';
import { getType, activityTypes } from "../../activity/activity.constants";
import './category-dialog.scss';


export namespace CategoryDialogCtrl {
	export type Mode = 'create' | 'view' | 'edit';
}


export class CategoryDialogCtrl implements IComponentController {

	private activityTypes: Array<IActivityType> = activityTypes;
	private activityTypeSelection: Array<IActivityType>;
	
	private submit = { 
		create: this.create.bind(this),
		edit: this.update.bind(this),
		view: this.close.bind(this)
	};
	
	static $inject = ['$scope', '$mdDialog', '$translate', 'message', 'ReferenceService', 'mode', 'category', 'user'];

	constructor (
		private $scope, 
		private $mdDialog, 
		private $translate,
		private message: IMessageService,
		private ReferenceService: ReferenceService,
		private mode: CategoryDialogCtrl.Mode,
		private category: IActivityCategory,
		private user: IUserProfile
	) {
		let activityType = getType(category.activityTypeId);
		this.activityTypeSelection = [activityType];
	}
	
	get categoryCode () {
		let { $translate, category } = this;
		return isSystem(category)? $translate.instant('category.' + category.code) : category.code;
	}
	
	set categoryCode (value) {
		this.category.code = value;
	}

	close () {
		this.$mdDialog.cancel();
	}

	delete () {
		this.ReferenceService.deleteActivityCategory(this.category.id)
		.then(() => this.$mdDialog.hide())
		.catch((info) => { 
			this.message.systemWarning(info);
			throw info;
		});
	}

	create () {
		let { id, code, description, groupProfile, sortOrder, visible } = this.category;
		let groupId = groupProfile && groupProfile.groupId;
		
		let requests = this.activityTypeSelection.map((activityType) => this.ReferenceService.postActivityCategory(
			activityType.id, code, description, groupId
		));

		Promise.all(requests)
		.then((info) => this.$mdDialog.hide())
		.catch((info) => { 
			this.message.systemWarning(info);
			throw info;
		});
	}

	update () {
		let { id, code, description, groupProfile, sortOrder, visible } = this.category;
		let groupId = groupProfile && groupProfile.groupId;

		this.ReferenceService.putActivityCategory(
			id, code, description, groupId, sortOrder, visible
		)
		.then((info) => this.$mdDialog.hide())
		.catch((info) => { 
			this.message.systemWarning(info);
			throw info;
		});
	}

}