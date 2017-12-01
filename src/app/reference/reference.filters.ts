import { IActivityCategory, IActivityTemplate } from "../../../api/reference/reference.interface";
import { isSystem } from "./reference.datamodel";


export const categoryCodeFilter = ["$translate", ($translate) => (category: IActivityCategory) => category && (
    isSystem(category)? $translate.instant("category." + category.code) : category.code
)];