import { IBillingTariff, IBulkGroupMembership, IGroupManagementProfile, IGroupManagementProfileMember, IGroupProfileShort, IUserProfileShort } from "../../../api";
import { Filter, filtersToPredicate } from "../share/utility";
import { arrays } from "../share/utility";
import { ClubRole, clubRoles, ClubTariff, clubTariffs } from "./management.constants";
import { Member } from "./member.datamodel";
import { MembersList } from "./members-list.datamodel";

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
    tariff: (member) => member["billing"] && member["billing"].map((t) => t.tariffCode).join(","),
    city: (member) => member.userProfile.public["city"],
    ageGroup: (member) => member.userProfile.public["sex"],
    roles: (member) => member.roleMembership.join(" "),
    coaches: (member) => member.coaches.join(","),
    athletes: (member) => this.athletes(member).map((a) => a.userProfile.userId).join(","),
};

/**
 * Отфильтрованный и отсортированный список членов клуба
 * @param management: MembersList
 * @param filterParams: MembersFilterParams
 * @param order: string
 * @returns {Array<Member>}
*/  
export const getRows = (management: MembersList, filterParams: MembersFilterParams, order: string) : Member[] => {
    let rows = management.members.filter(filtersToPredicate(membersFilters, filterParams));

    if (order.startsWith("-")) {
        return (arrays.orderBy(membersOrderings[order.slice(1)]) (rows)).reverse();
    } else {
        return arrays.orderBy(membersOrderings[order]) (rows);
    }
};