import { IGroupProfile } from "../../../api/group/group.interface";
import { IUserProfile } from "../../../api/user/user.interface";
import { path } from "../share/utility";

export const isMember = (user: IUserProfile, club: IGroupProfile): boolean => path([
    "groupMembers", (members) => members.find((member) => member.userId === user.userId),
]) (club);

export const isManager = (user: IUserProfile, club: IGroupProfile): boolean => path([
    "innerGroups", "ClubManagement", "groupMembers", (managers) => managers.find((manager) => manager.userId === user.userId),
]) (club);
