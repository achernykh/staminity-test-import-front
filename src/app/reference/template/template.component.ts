import { IComponentOptions, IComponentController, IPromise } from 'angular';
import { IActivityCategory, IActivityTemplate } from "../../../../api/reference/reference.interface";

import { ReferenceCtrl } from '../reference.component';
import { path } from '../../share/utility/path';
import { getType, activityTypes } from "../../activity/activity.constants";
import './template.component.scss';
import { getIntervalsChartData } from "../../activity/activity.function";
import { IActivityIntervalP } from "@api/activity";
import { CalendarItemDialogService } from "../../calendar-item/calendar-item-dialog.service";
import { FormMode } from "../../application.interface";
import { ICalendarItemDialogOptions } from "../../calendar-item/calendar-item-dialog.interface";
import { templateToActivity } from "../template-dialog/template.dialog";
import { IUserProfile } from "../../../../api/user/user.interface";
import { profileShort } from "../../core/user.function";
import ReferenceService from "../reference.service";
import MessageService from "../../core/message.service";


class TemplateCtrl implements IComponentController {

	private template: IActivityTemplate;
	currentUser: IUserProfile;
	private onDelete: () => any;
	private onSelect: () => any;
	private onCopy: () => any;
	private reference: ReferenceCtrl;
	private segmentChart: any;
	private dialogOptions: ICalendarItemDialogOptions;

	static $inject = ['$scope', '$filter', '$mdDialog', 'CalendarItemDialogService',
        'ReferenceService', 'message', 'dialogs'];

	constructor (
		private $scope, 
		private $filter, 
		private $mdDialog,
        private calendarItemDialog: CalendarItemDialogService,
        private referenceService: ReferenceService,
        private messageService: MessageService,
        private dialogs: any) {

	}

	$onInit (): void {
        this.prepareChart();

		this.dialogOptions = {
			currentUser: this.currentUser,
			owner: this.currentUser,
			popupMode: true,
			formMode: FormMode.Put,
			trainingPlanMode: false,
			templateMode: true,
			templateOptions: {
				templateId: this.template.id,
				code: this.template.code,
				visible: this.template.visible,
				favourite: this.template.favourite,
				groupProfile: this.template.groupProfile
			}
		};
    }

    private prepareChart (): void {
        this.segmentChart = this.isStructured ?
            getIntervalsChartData(<Array<IActivityIntervalP>>this.template.content.filter(i => i.type === 'P')) :
            null;
    }

    $onChanges (changes): void {
	    if (changes.hasOwnProperty('revision') && !changes.revision.isFirstChange && this.template) {
	        debugger;
            this.prepareChart();
        }
    }

    open (e: Event): void {
    	this.calendarItemDialog.activity(e, this.dialogOptions, templateToActivity(this.template))
			.then(response => {debugger;});
	}

    copy (template: IActivityTemplate) {
        let { id, activityCategory, code, description, groupProfile, favourite, content } = template;
        let groupId = groupProfile && groupProfile.groupId;
        let activityCategoryId = activityCategory && activityCategory.id;

        this.referenceService.postActivityTemplate(
            null, activityCategoryId, groupId, code, description, favourite, content
        )
            .catch((info) => {
                this.messageService.systemWarning(info);
                throw info;
            });
    }

    delete (template: IActivityTemplate) {
        let { id } = template;
        return this.dialogs.confirm({ text: 'reference.templates.confirmDelete' })
            .then(() => this.referenceService.deleteActivityTemplate(id))
            .catch((error) => {
                if (error) {
                    this.messageService.systemWarning(error);
                }
            });
    }

	get isStructured (): boolean {
	    return this.template.content.some(i => i.type === 'P');
    }

	get activityType () {
		let { activityTypeId } = this.template.activityCategory;
		return getType(activityTypeId);
	}

	get description () {
		return path(['content', 0, 'trainerPrescription'])(this.template) || this.template.description;
	}

	get name () {
		return this.template.code;
	}
}


const TemplateComponent: IComponentOptions = {
	bindings: {
		template: '<',
        revision: '<',
        view: '<',
		currentUser: '<',
        isMobileLayout: '<',
		onDelete: '&',
		onSelect: '&',
		onCopy: '&'
	},
	controller: TemplateCtrl,
	template: require('./template.component.html') as string
};


export default TemplateComponent;