import { IGroupManagementProfileMember, IBulkGroupMembership, IGroupManagementProfile } from "../../../api";
import { path, Filter } from "../share/utility";

export type ClubTariff = 'Coach' | 'Premium';
export type ClubRole = 'ClubCoaches' | 'ClubAthletes' | 'ClubManagement';

export const getClubCoaches = (management: IGroupManagementProfile) => member && member.coaches || [];
export const getClubTariffGroup = (management: IGroupManagementProfile) => (tariffCode: ClubTariff) : number => management['tariffGroups'][tariffCode + 'ByClub'];
export const getClubRoleGroup = (management: IGroupManagementProfile) => (role: ClubRole) : number => management.availableGroups[role];

export const getMemberCoaches = (member: IGroupManagementProfileMember) => member && member.coaches || [];
export const getMemberRolesInClub = (member: IGroupManagementProfileMember) => member && member.roleMembership || [];
export const hasClubRole = (role: ClubRole) => (member: IGroupManagementProfileMember) => getClubRoles(member).indexOf(role) !== -1;
export const getMemberId = (member: IGroupManagementProfileMember) => member.userProfile.userId;
export const getClubAthletesGroupId = (coach: any) : number => coach['ClubAthletesGroupId'];

export const addToGroup = (groupId: number) : IBulkGroupMembership => ({ groupId, direction: 'I' });
export const removeFromGroup = (groupId: number) : IBulkGroupMembership => ({ groupId, direction: 'O' });

export type MembersFilterParams = {
    clubRole: ClubRole;
    coachUserId: number;
    noCoach: boolean;
};

export const membersFilters: Array<Filter<MembersFilterParams, IGroupManagementProfileMember>> = [
	({ clubRole }) => (member) => !clubRole || getClubRoles(member).indexOf(clubRole) !== -1,
	({ coachUserId }) => (member) => !coachUserId || getCoaches(member).indexOf(coachUserId) !== -1,
	({ noCoach }) => (member) => !noCoach || !getCoaches(member).length,
];

export const membersOrderings: { 
	[key: string]:  (member: IGroupManagementProfileMember) => string | number;
} = {
    username: (member) => `${member.userProfile.public.firstName} ${member.userProfile.public.lastName}`,
    tariff: (member) => 1,//member.billing && member.billing.map(t => t.tariffCode).join(','),
    city: (member) => 1,//member.userProfile.public.city,
    ageGroup: (member) => 1,//member.userProfile.public.sex,
    roles: (member) => member.roleMembership.join(' '),
    coaches: (member) => member.coaches.join(','),
    athletes: (member) => this.athletes(member).map(a => a.userProfile.userId).join(','),
};

export const getEditRolesMessage = ($translate) => (addRoles: Array<ClubRole>, removeRoles: Array<ClubRole>) : string => {
    let translateRole = (role) => $translate.instant(`dialogs.${role}`);
    let translateRoles = (roles) => roles.map(translateRole).join(', ');

    return (
        addRoles.length && removeRoles.length && $translate.instant('users.editRoles.confirm.text.addAndRemove', { addRoles: translateRoles(addRoles), removeRoles: translateRoles(removeRoles) })
    ) || (
        addRoles.length && !removeRoles.length &&  $translate.instant(`users.editRoles.confirm.text.${addRoles.length > 1 ? 'addMany' : 'addOne'}`, { roles: translateRoles(addRoles) })
    ) || (
        !addRoles.length && removeRoles.length && $translate.instant(`users.editRoles.confirm.text.${removeRoles.length > 1 ? 'removeMany' : 'removeOne'}`, { roles: translateRoles(removeRoles) })
    );
};

export const getEditTariffsMessage = ($translate) => (addTariffs: Array<ClubTariff>, removeTariffs: Array<ClubTariff>) : string {
    let translateTariffCode = (tariffCode) => '«' + this.$translate.instant(`dialogs.${tariffCode}`) + '»';
    let translateTariffCodes = (tariffCodes) => tariffCodes.map(translateTariffCode).join(', ');

    return (
        addTariffs.length && removeTariffs.length && $translate.instant('users.editTariffs.confirm.text.addAndRemove', { addTariffCodes: translateTariffCodes(addTariffs), removeTariffCodes: translateTariffCodes(removeTariffs) })
    ) || (
        addTariffs.length && !removeTariffs.length && $translate.instant(`users.editTariffs.confirm.text.${addTariffs.length > 1 ? 'addMany' : 'addOne'}`, { tariffCodes: translateTariffCodes(addTariffs) })
    ) || (
        !addTariffs.length && removeTariffs.length && $translate.instant(`users.editTariffs.confirm.text.${removeTariffs.length > 1 ? 'removeMany' : 'removeOne'}`, { tariffCodes: translateTariffCodes(addTariffs) })
    );
}