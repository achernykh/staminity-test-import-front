import { IUserProfile } from "../../../api/user/user.interface";
import { IGroupProfile } from "../../../api/group/group.interface";
import { path } from "../../app4/share/utilities";


export const isMember = (user: IUserProfile, club: IGroupProfile) : boolean => path([
	'groupMembers', (members) => members.find((member) => member.userId === user.userId)
]) (club);

export const isManager = (user: IUserProfile, club: IGroupProfile) : boolean => path([
	'innerGroups', 'ClubManagement', 'groupMembers', (managers) => managers.find((manager) => manager.userId === user.userId)
]) (club);