import { IActivityCategory, IActivityTemplate } from "../../../api/reference/reference.interface";
import { cathegoryOwner } from './reference.datamodel';


export const cathegoryCodeFilter = ['SessionService', '$translate', (SessionService, $translate) => (cathegory: IActivityCategory) => {
	if (cathegory) {
		let user = SessionService.getUser(); 
		let isSystem = cathegoryOwner(user)(cathegory) === 'system';
		return isSystem? $translate.instant('category.' + cathegory.code) : cathegory.code;
	}
}];