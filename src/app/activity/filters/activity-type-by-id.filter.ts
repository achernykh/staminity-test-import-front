import { activityTypes, getType } from "../activity.constants";
export const activityTypeCodeById = () => (id: number):string => `sport.${getType(id).code}`;