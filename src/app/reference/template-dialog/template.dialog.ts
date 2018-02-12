import { IComponentController, IPromise, element } from 'angular';

import { Activity } from "../../activity/activity-datamodel/activity.datamodel";
import { IActivityTemplate } from "../../../../api/reference/reference.interface";
import { IUserProfile } from "../../../../api/user/user.interface";
import { getType, activityTypes } from "../../activity/activity.constants";
import { ICalendarItem } from "../../../../api/calendar/calendar.interface";
import { IActivityInterval } from "../../../../api/activity/activity.interface";


export type TemplateDialogMode = 'post' | 'put' | 'view';

class TemplateDialogCtrl implements IComponentController {

	static $inject = ['$scope','$mdDialog'];

	constructor (private $scope, private $mdDialog) {
		$scope.hide = () => $mdDialog.hide();
		$scope.cancel = () => $mdDialog.cancel();
		$scope.answer = (answer) => $mdDialog.hide(answer);
	}

	$onInit(): void {}
}

const defaultParams = {
	controller: TemplateDialogCtrl,
	controllerAs: '$ctrl',
	template: require('./template.dialog.html') as string,
	parent: element(document.body),
	bindToController: true,
	clickOutsideToClose: false,
	escapeToClose: false,
	fullscreen: true
};

export function templateToActivity (template: IActivityTemplate) : ICalendarItem {
	let { id, code, description, favourite, visible, userProfileCreator, groupProfile, activityCategory, content } = template;
	let activityTypeId = activityCategory && activityCategory.activityTypeId;

	content.filter(i => i.type === 'pW')[0]['trainersPrescription'] = description;

	return {
		calendarItemId: null,
		calendarItemType: 'activity',
		dateStart: null,
		dateEnd: null,
		revision: null,
		userProfileCreator: userProfileCreator,
		userProfileOwner: userProfileCreator,
		activityHeader: {
			activityCategory,
			activityType: getType(activityTypeId) || activityTypes[0],
			intervals: content || []
		}
	};
}

export function templateDialog (mode: TemplateDialogMode, template: IActivityTemplate, user: IUserProfile, params?: any) {
	return {
		...defaultParams,
		...params,
		locals: {
			mode, user,
			item: templateToActivity(template),
			date: new Date()
		}
	};
}