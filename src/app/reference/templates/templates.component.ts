import { IComponentOptions, IComponentController, IPromise, element } from 'angular';
import { IActivityCategory, IActivityTemplate } from "../../../../api/reference/reference.interface";
import { IUserProfile } from "../../../../api/user/user.interface";

import { templateOwner, createTemplate } from "../reference.datamodel";
import { TemplateDialogCtrl } from "../template-dialog/template-dialog.controller";
import { pipe, prop, last, filter, fold, orderBy, groupBy, keys, entries, isUndefined, log } from '../../share/util.js';
import "./templates.component.scss";
import {getType} from "../../activity/activity.constants";


const templatesFilters = {
	activityType: (activityType, template) => template.activityCategory.activityTypeId === activityType.id,
	cathegory: (cathegory, template) => template.activityCategory.id === cathegory.id
};

const filterTemplates = (filters) => (template) => (
	keys(filters).every((key) => !filters[key] || templatesFilters[key] (filters[key], template))
);

type DialogMode = 'post' | 'put' | 'view';

class TemplatesCtrl implements IComponentController {

	static $inject = ['$scope', '$mdDialog', '$mdMedia', 'message', 'ReferenceService'];

	private user : IUserProfile;
	private cathegories : Array<IActivityCategory>;
	private templates : Array<IActivityTemplate>;
	private templatesByOwner : any;
	private filters : any;
	private onTemplatesChange : () => any;
	private onTemplateChange : (id, changes) => any;
	private onTemplateDelete : (id) => any;

	constructor (
		private $scope, 
		private $mdDialog, 
		private $mdMedia, 
		private message,
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
		})
		.then(this.onTemplatesChange);
	}

	createTemplate ($event: MouseEvent) {
		let cathegory = this.filters.cathegory || this.cathegories.find((cathegory) => cathegory.activityTypeId === this.filters.activityType.id);
		let template = createTemplate(cathegory);
		this.templateDialog(template, 'post', $event);
	}

	copyTemplate (template) {
		let { id, activityCategory, code, description, groupProfile, favourite, content } = template;
		let groupId = groupProfile && groupProfile.id;
		let activityCategoryId = activityCategory && activityCategory.id;

		this.ReferenceService.postActivityTemplate(
			null, activityCategoryId, groupId, code, description, favourite, content
		)
		.then(this.onTemplatesChange)
		.catch((info) => { 
			this.message.systemWarning(info);
			throw info;
		});
	}

	viewTemplate (template, $event: MouseEvent) {
		return this.templateDialog(template, 'view');
	}

	editTemplate (template, $event: MouseEvent) {
		return this.templateDialog(template, 'put');
	}

	deleteTemplate (template) {
		let { id } = template;
		return this.ReferenceService.deleteActivityTemplate(id)
		.catch((info) => { 
			this.message.systemWarning(info);
			throw info;
		})
		.then(() => this.onTemplateDelete(id));
	}

	templateDialog (template, mode: DialogMode, event?: MouseEvent) {
		debugger;
		this.$mdDialog.show({
			controller: DialogCtrl,
			controllerAs: '$ctrl',
			template:
				`<md-dialog id="post-activity" aria-label="Activity">
                        <calendar-item-activity
                                layout="row" class="calendar-item-activity"
                                date="$ctrl.date"
                                activity-type="$ctrl.activityType"
                                activity-category="$ctrl.activityCategory"
                                mode="$ctrl.mode"
                                user="$ctrl.user"
                                popup="true"
                                template="true"
                                on-cancel="cancel()" on-answer="answer(response)">
                        </calendar-item-activity>
                   </md-dialog>`,
			parent: element(document.body),
			targetEvent: event,
			locals: {
				mode: mode,
				date: new Date(),//this.date, // дата дня в формате ГГГГ-ММ-ДД
				user: this.user,
				activityType: getType(template.activityCategory.activityTypeId),//null,//activityType,
				activityCategory: template.activityCategory //null,//activityCategory,
			},
			bindToController: true,
			clickOutsideToClose: false,
			escapeToClose: false,
			fullscreen: true
		}).then(()=>{});

		/**
		let locals = {
			mode,
			activityTemplate: { ...template },
			user: this.user,
			cathegories: this.cathegories,
			onTemplatesChange: this.onTemplatesChange,
			onTemplateChange: this.onTemplateChange,
			onTemplateDelete: this.onTemplateDelete
		};

		return this.$mdDialog.show({
			controller: TemplateDialogCtrl,
			controllerAs: '$ctrl',
			template: require('../template-dialog/template-dialog.template.html') as string,
			parent: angular.element(document.body),
			locals: locals,
			clickOutsideToClose: true,
			fullscreen: !this.$mdMedia('gt-sm')
		});**/
	}
}


const TemplatesComponent: IComponentOptions = {
	bindings: {
		user: '<',
		cathegories: '<',
		templates: '<',
		filters: '<',
		onTemplateChange: '<',
		onTemplateDelete: '<',
		onTemplatesChange: '<'
	},
	controller: TemplatesCtrl,
	template: require('./templates.component.html') as string
};


export default TemplatesComponent;

class DialogCtrl implements IComponentController {

	static $inject = ['$scope','$mdDialog'];

	constructor(private $scope, private $mdDialog){
		$scope.hide = () => $mdDialog.hide();
		$scope.cancel = () => $mdDialog.cancel();
		$scope.answer = (answer) => $mdDialog.hide(answer);
	}
}