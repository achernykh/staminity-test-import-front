import { IActivityCategory } from "../../../../api/reference/reference.interface";
export const activityTypeExistInBasicType = () => (category: Array<IActivityCategory>, basicCode) => {
    return category.filter(c => c.visible && c.activityType.typeBasic === basicCode);
};