import { IActivityCategory, IActivityTemplate } from "../../../api/reference/reference.interface";
import { IActivityIntervalPW } from "../../../api/activity/activity.interface";
import { IUserProfile } from "../../../api/user/user.interface";
import { Activity } from "../activity/activity.datamodel";
import { getType } from "../activity/activity.constants";
import { measureValue, measureUnit } from "../share/measure/measure.constants";


export type Owner = 'user' | 'system' | 'club' | 'coach';

const systemUserId = 1;

export const cathegoryOwner = (user: IUserProfile) => (cathegory: IActivityCategory) : Owner => {
	let userId = cathegory.userProfileCreator && cathegory.userProfileCreator.userId;
	return (userId === user.userId && 'user')
		|| (userId === systemUserId && 'system')
		|| (cathegory.groupProfile && 'club')
		|| 'coach';
};

export const templateOwner = (user: IUserProfile) => (template: IActivityTemplate) : Owner => {
	let userId = template.userProfileCreator && template.userProfileCreator.userId;
	return (userId === user.userId && 'user')
		|| (userId === systemUserId && 'system')
		|| (template.groupProfile && 'club')
		|| 'coach';
};

export const nameFromInterval = (interval: IActivityIntervalPW, sport = 'default') : string => {
	let { distance, movingDuration } = <any>(interval || {});
	return distance.durationValue && `${measureValue(distance.durationValue, sport, 'distance')} ${measureUnit('distance', sport)}`
		|| movingDuration.durationValue && measureValue(movingDuration.durationValue, sport, 'movingDuration');
};

export const templateToActivity = (template: IActivityTemplate) : Activity => new Activity(<any>{ 
	isTemplate: true,
	templateId: template.id,
	code: template.code,
	description: template.description,
	favourite: template.favourite,
	visible: template.visible,
	userProfileOwner: template.userProfileCreator,
	userProfileCreator: template.userProfileCreator,
	activityHeader: {
		id: template.id,
		activityCategory: template.activityCategory,
		activityType: getType(template.activityCategory.activityTypeId),
		intervals: template.content || []
	}
});