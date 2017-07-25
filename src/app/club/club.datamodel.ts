import { IUserProfile } from "../../../api/user/user.interface";
import { IGroupProfile } from "../../../api/group/group.interface";
import { path } from "../share/utility";


export const isManager = (user: IUserProfile, club: IGroupProfile) : boolean => path([
	'innerGroups', 'ClubManagement', 'groupMembers', (managers) => managers.find((manager) => manager.userId === user.userId)
]) (club);