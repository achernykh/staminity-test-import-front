import { IComponentOptions, IComponentController, IPromise, element } from 'angular';
import { IActivityCategory, IActivityTemplate } from "../../../../api/reference/reference.interface";
import { IUserProfile } from "../../../../api/user/user.interface";

import { getType } from "../../activity/activity.constants";
import { Activity } from "../../activity/activity.datamodel";
import { templateOwner, templateToActivity } from "../reference.datamodel";
import { pipe, prop, last, filter, fold, orderBy, groupBy, keys, entries, isUndefined, log } from '../../share/util.js';
import "./templates.component.scss";


const templatesFilters = {
	activityType: (activityType, template) => template.activityCategory.activityTypeId === activityType.id,
	cathegory: (cathegory, template) => template.activityCategory.id === cathegory.id
};

const filterTemplates = (filters) => (template) => (
	keys(filters).every((key) => !filters[key] || templatesFilters[key] (filters[key], template))
);


type DialogMode = 'post' | 'put' | 'view';

class DialogCtrl implements IComponentController {

	static $inject = ['$scope','$mdDialog'];

	constructor (private $scope, private $mdDialog) {
		$scope.hide = () => $mdDialog.hide();
		$scope.cancel = () => $mdDialog.cancel();
		$scope.answer = (answer) => $mdDialog.hide(answer);
	}
}

const dialogParams = {
	controller: DialogCtrl,
	controllerAs: '$ctrl',
	template:
		`<md-dialog id="post-activity" aria-label="Activity">
			<calendar-item-activity
				layout="row" class="calendar-item-activity"
				date="$ctrl.date"
				activity-type="$ctrl.activityType"
				activity-category="$ctrl.activityCategory"
				data="$ctrl.item"
				mode="$ctrl.mode"
				user="$ctrl.user"
				popup="true"
				template="true"
				on-cancel="cancel()" on-answer="answer(response)"
			>
			</calendar-item-activity>
		</md-dialog>`,
	parent: element(document.body),
	bindToController: true,
	clickOutsideToClose: false,
	escapeToClose: false,
	fullscreen: true
};


class TemplatesCtrl implements IComponentController {

	static $inject = ['$scope', '$mdDialog', '$mdMedia', 'message', 'dialogs', 'ReferenceService'];

	private user : IUserProfile;
	private cathegories : Array<IActivityCategory>;
	private templates : Array<IActivityTemplate>;
	private templatesByOwner : any;
	private filters : any;

	constructor (
		private $scope, 
		private $mdDialog, 
		private $mdMedia, 
		private message,
		private dialogs,
		private ReferenceService
	) {

	}

	$onChanges (changes) {
		this.handleChanges();
	}

	handleChanges () {
		this.templatesByOwner = pipe(
			filter(filterTemplates(this.filters)),
			orderBy(prop('sortOrder')),
			groupBy(templateOwner(this.user)),
		) (this.templates);
	}

	templateReorder (index, template) {
		let { id, activityCategory, code, description, groupProfile, favourite, visible } = template;
		let owner = templateOwner(this.user) (template);
		let groupId = groupProfile && groupProfile.groupId;
		let activityCategoryId = activityCategory && activityCategory.id;
		let targetTemplate = this.templatesByOwner[owner][index];
		let sortOrder = targetTemplate? targetTemplate.sortOrder : 999999;

		this.ReferenceService.putActivityTemplate(id, activityCategoryId, groupId, sortOrder, code, description, favourite, visible)
		.catch((info) => { 
			this.message.systemWarning(info);
			throw info;
		});
	}

	createTemplate ($event: MouseEvent) {
		let activityTypeId = this.filters.activityType.id;
		let cathegory = this.filters.cathegory || this.cathegories.find((cathegory) => cathegory.activityTypeId === activityTypeId);

		return this.$mdDialog.show({
			...dialogParams,
			locals: {
				mode: 'post',
				date: new Date(),
				user: this.user,
				activityType: getType(activityTypeId),
				activityCategory: cathegory
			}, 
			targetEvent: $event
		});
	}

	copyTemplate (template) {
		let { id, activityCategory, code, description, groupProfile, favourite, content } = template;
		let groupId = groupProfile && groupProfile.id;
		let activityCategoryId = activityCategory && activityCategory.id;

		this.ReferenceService.postActivityTemplate(
			null, activityCategoryId, groupId, code, description, favourite, content
		)
		.catch((info) => { 
			this.message.systemWarning(info);
			throw info;
		});
	}

	viewTemplate (template, $event: MouseEvent) {
		let activityTypeId = this.filters.activityType.id;
		let cathegory = this.filters.cathegory || this.cathegories.find((cathegory) => cathegory.activityTypeId === activityTypeId);

		return this.$mdDialog.show({
			...dialogParams,
			locals: {
				mode: 'view',
				item: templateToActivity(template),
				date: new Date(),
				user: this.user,
				activityType: getType(activityTypeId),
				activityCategory: cathegory
			}, 
			targetEvent: $event
		});
	}

	editTemplate (template, $event: MouseEvent) {
		let activityTypeId = this.filters.activityType.id;
		let cathegory = this.filters.cathegory || this.cathegories.find((cathegory) => cathegory.activityTypeId === activityTypeId);

		return this.$mdDialog.show({
			...dialogParams,
			locals: {
				mode: 'put',
				item: templateToActivity(template),
				date: new Date(),
				user: this.user,
				activityType: getType(activityTypeId),
				activityCategory: cathegory
			}, 
			targetEvent: $event
		});
	}

	deleteTemplate (template) {
		let { id } = template;
		return this.dialogs.confirm('reference.templates.confirmDelete')
		.then((result) => result && this.ReferenceService.deleteActivityTemplate(id), () => {})
		.catch((info) => { 
			this.message.systemWarning(info);
			throw info;
		});
	}
}


const TemplatesComponent: IComponentOptions = {
	bindings: {
		user: '<',
		cathegories: '<',
		templates: '<',
		filters: '<'
	},
	controller: TemplatesCtrl,
	template: require('./templates.component.html') as string
};


export default TemplatesComponent;