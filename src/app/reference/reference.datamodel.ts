import { IActivityCategory, IActivityTemplate } from "../../../api/reference/reference.interface";
import { IActivityType, IActivityIntervalPW } from "../../../api/activity/activity.interface";
import { IUserProfile } from "../../../api/user/user.interface";
import { IGroupProfile } from "../../../api/group/group.interface";
import { activityTypes, getType } from "../activity/activity.constants";
import { measureValue, measureUnit } from "../share/measure/measure.constants";
import { path, Filter } from "../share/utility";


type ActivityReference = IActivityCategory | IActivityTemplate;

export const getUserId = path(['userProfileCreator', 'userId']);
export const getGroupId = path(['groupProfile', 'groupId']);
export const getCategoryActivityTypeId = path(['activityTypeId']);
export const getTemplateActivityTypeId = path(['activityCategory', 'activityTypeId']);
export const getTemplateActivityCategoryId = path(['activityCategory', 'id']);


export type Owner = 'user' | 'system' | 'club' | 'coach';

export const isOwner = (user: IUserProfile, item: ActivityReference) : boolean => getUserId(item) === user.userId;

const systemUserId = 1;

export const isSystem = (item: ActivityReference) : boolean => getUserId(item) === systemUserId;

export const getOwner = (user: IUserProfile) => (item: ActivityReference) : Owner => {
	let userId = getUserId(item);
	return (item.groupProfile && 'club')
		|| (userId === systemUserId && 'system')
		|| (userId === user.userId && 'user')
		|| 'coach';
};


export type ReferenceFilterParams = {
	club?: IGroupProfile;
	activityType: IActivityType;
	category?: IActivityCategory;
};

export const categoriesFilters = {
	club: ({ club }: ReferenceFilterParams) => (category: IActivityCategory) => !club || getGroupId(category) === club.groupId || isSystem(category),
	activityType: ({ activityType }: ReferenceFilterParams) => (category: IActivityCategory) => !activityType || getCategoryActivityTypeId(category) === activityType.id,
	isActive: ({ }: ReferenceFilterParams) =>  (category: IActivityCategory) => category.visible
};

export const templatesFilters = {
	club: ({ club }: ReferenceFilterParams) => (template: IActivityTemplate) => !club || getGroupId(template) === club.groupId || isSystem(template),
	activityType: ({ activityType }: ReferenceFilterParams) => (template: IActivityTemplate) => !activityType || getTemplateActivityTypeId(template) === activityType.id,
	category: ({ category }: ReferenceFilterParams) => (template: IActivityTemplate) => !category || getTemplateActivityCategoryId(template) === category.id,
	isActive: ({ }: ReferenceFilterParams) =>  (template: IActivityTemplate) => template.visible
};


export const nameFromInterval = ($translate) => (interval: IActivityIntervalPW, sport: string) : string => {
	//let distance = path(['distance', 'durationValue']) (interval);
	//let movingDuration = path(['movingDuration', 'durationValue']) (interval);

	return (interval.durationValue &&
		`${measureValue(interval.durationValue, sport, interval.durationMeasure)} ${$translate.instant(measureUnit(interval.durationMeasure, sport))}`) || '';
};