import { IActivityIntervalPW, IActivityType } from "../../../api/activity/activity.interface";
import { IGroupProfile } from "../../../api/group/group.interface";
import { IActivityCategory, IActivityTemplate } from "../../../api/reference/reference.interface";
import { IUserProfile } from "../../../api/user/user.interface";
import { activityTypes, getType } from "../activity/activity.constants";
import { measureUnit, measureValue } from "../share/measure/measure.constants";
import { path } from "../share/utility/path";

type ActivityReference = IActivityCategory | IActivityTemplate;

export const getUserId = path(["userProfileCreator", "userId"]);
export const getGroupId = path(["groupProfile", "groupId"]);
export const getCategoryActivityTypeId = path(["activityTypeId"]);
export const getTemplateActivityTypeId = path(["activityCategory", "activityTypeId"]);
export const getTemplateActivityCategoryId = path(["activityCategory", "id"]);

export type Owner = "user" | "system" | "club" | "coach";

export const isOwner = (user: IUserProfile, item: ActivityReference): boolean => getUserId(item) === user.userId;

const systemUserId = 1;

export const isSystem = (item: ActivityReference): boolean => getUserId(item) === systemUserId;

export const getOwner = (user: IUserProfile) => (item: ActivityReference): Owner => {
    const userId = getUserId(item);
    return (item.groupProfile && "club")
        || (userId === systemUserId && "system")
        || (userId === user.userId && "user")
        || "coach";
};

export interface ReferenceFilterParams {
    club?: IGroupProfile;
    activityType: IActivityType;
    category?: IActivityCategory;
}

export const categoriesFilters = {
    club: ({ club }: ReferenceFilterParams) => (category: IActivityCategory) => !club || getGroupId(category) === club.groupId || isSystem(category),
    activityType: ({ activityType }: ReferenceFilterParams) => (category: IActivityCategory) => !activityType || getCategoryActivityTypeId(category) === activityType.id,
    isActive: ({ }: ReferenceFilterParams) =>  (category: IActivityCategory) => category.visible,
};

export const templatesFilters = {
    club: ({ club }: ReferenceFilterParams) => (template: IActivityTemplate) => !club || getGroupId(template) === club.groupId || isSystem(template),
    activityType: ({ activityType }: ReferenceFilterParams) => (template: IActivityTemplate) => !activityType || getTemplateActivityTypeId(template) === activityType.id,
    category: ({ category }: ReferenceFilterParams) => (template: IActivityTemplate) => !category || getTemplateActivityCategoryId(template) === category.id,
    isActive: ({ }: ReferenceFilterParams) =>  (template: IActivityTemplate) => template.visible,
};

export const categoriesReorder = (categories: IActivityCategory[], order: number[]): IActivityCategory[] => {
    return categories.map((category) => ({
        ...category,
        sortOrder: order.indexOf(category.id)
    }));
};

export const templatesReorder = (templates: IActivityTemplate[], order: number[]): IActivityTemplate[] => {
    return templates.map((template) => ({
        ...template,
        sortOrder: order.indexOf(template.id)
    }));
};

export const nameFromInterval = ($translate) => (interval: IActivityIntervalPW, sport: string): string => {
    const durationMeasure: string = interval.hasOwnProperty("distanceLength") ? `${interval.durationMeasure}Length` : interval.durationMeasure;
    return (interval[durationMeasure] &&
        `${measureValue(interval[durationMeasure], sport, interval.durationMeasure)} ${$translate.instant(measureUnit(interval.durationMeasure, sport))}`) || "";
};
