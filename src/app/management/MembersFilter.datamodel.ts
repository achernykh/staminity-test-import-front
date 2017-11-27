import { IGroupManagementProfileMember, IBulkGroupMembership, IGroupManagementProfile, IGroupProfileShort, IUserProfileShort, IBillingTariff } from "../../../api";
import { Filter, filtersToPredicate } from "../share/utility";
import { orderBy } from '../share/util.js';
import { ClubRole, ClubTariff, clubTariffs, clubRoles } from "./management.constants";
import { Member } from "./Member.datamodel";
import { MembersList } from "./MembersList.datamodel";

export type MembersFilterParams = {
    clubRole: ClubRole;
    coachUserId: number;
    noCoach: boolean;
    search: string;
};

export const membersFilters: Array<Filter<MembersFilterParams, IGroupManagementProfileMember>> = [
	({ clubRole }) => (member) => !clubRole || member.roleMembership.indexOf(clubRole) !== -1,
	({ coachUserId }) => (member) => !coachUserId || member.coaches.indexOf(coachUserId) !== -1,
	({ noCoach }) => (member) => !noCoach || !member.coaches.length,
    ({ search }) => ({ userProfile }) => !search || `${userProfile.public.firstName} ${userProfile.public.lastName}`.includes(search),
];

export const membersOrderings: { 
	[key: string]:  (member: IGroupManagementProfileMember) => string | number;
} = {
    username: (member) => `${member.userProfile.public.firstName} ${member.userProfile.public.lastName}`,
    tariff: (member) => member['billing'] && member['billing'].map(t => t.tariffCode).join(','),
    city: (member) => member.userProfile.public['city'],
    ageGroup: (member) => member.userProfile.public['sex'],
    roles: (member) => member.roleMembership.join(' '),
    coaches: (member) => member.coaches.join(','),
    athletes: (member) => this.athletes(member).map(a => a.userProfile.userId).join(','),
};


export const getRows = (management: MembersList, filterParams: MembersFilterParams, order: string) : Array<IGroupManagementProfileMember> => {
    let rows = management.members.filter(filtersToPredicate(membersFilters, filterParams));

    if (order.startsWith('-')) {
        return (orderBy(membersOrderings[order.slice(1)]) (rows)).reverse();
    } else {
        return orderBy(membersOrderings[order]) (rows);
    }
};