import { IGroupManagementProfileMember, IBulkGroupMembership, IGroupManagementProfile } from "../../../api";
import { path, Filter } from "../share/utility";

export type ClubTariff = 'Coach' | 'Premium';
export type ClubRole = 'ClubCoaches' | 'ClubAthletes' | 'ClubManagement';

export const getClubCoaches = (management: IGroupManagementProfile) => management.members.filter(hasClubRole('ClubCoaches'));
export const getClubTariffGroup = (management: IGroupManagementProfile) => (tariffCode: ClubTariff) : number => management['tariffGroups'][tariffCode + 'ByClub'];
export const getClubRoleGroup = (management: IGroupManagementProfile) => (role: ClubRole) : number => management.availableGroups[role];

export const getMemberCoaches = (member: IGroupManagementProfileMember) => member && member.coaches || [];
export const getMemberRoles = (member: IGroupManagementProfileMember) => member && member.roleMembership || [];
export const hasClubRole = (role: ClubRole) => (member: IGroupManagementProfileMember) => getMemberRoles(member).indexOf(role) !== -1;
export const getMemberId = (member: IGroupManagementProfileMember) => member.userProfile.userId;
export const getClubAthletesGroupId = (coach: any) : number => coach['ClubAthletesGroupId'];

export const addToGroup = (groupId: number) : IBulkGroupMembership => ({ groupId, direction: 'I' });
export const removeFromGroup = (groupId: number) : IBulkGroupMembership => ({ groupId, direction: 'O' });

export type MembersFilterParams = {
    clubRole: ClubRole;
    coachUserId: number;
    noCoach: boolean;
    search: string;
};

export const membersFilters: Array<Filter<MembersFilterParams, IGroupManagementProfileMember>> = [
	({ clubRole }) => (member) => !clubRole || getMemberRoles(member).indexOf(clubRole) !== -1,
	({ coachUserId }) => (member) => !coachUserId || getMemberCoaches(member).indexOf(coachUserId) !== -1,
	({ noCoach }) => (member) => !noCoach || !getMemberCoaches(member).length,
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

export const getEditRolesMessage = ($translate) => (addRoles: Array<ClubRole>, removeRoles: Array<ClubRole>) : string => {
    let translateRole = (role) => $translate.instant(`dialogs.${role}`);
    let translateRoles = (roles) => roles.map(translateRole).join(', ');

    if (addRoles.length && removeRoles.length) {
        return $translate.instant('users.editRoles.confirm.text.addAndRemove', { addRoles: translateRoles(addRoles), removeRoles: translateRoles(removeRoles) });
    } else if (addRoles.length === 1 && !removeRoles.length) {
        return $translate.instant(`users.editRoles.confirm.text.addOne.${addRoles[0]}`);
    } else if (addRoles.length > 1 && !removeRoles.length) {
        return $translate.instant(`users.editRoles.confirm.text.addMany`, { roles: translateRoles(addRoles) });
    } else if (!addRoles.length && removeRoles.length === 1) {
        return $translate.instant(`users.editRoles.confirm.text.removeOne.${removeRoles[0]}`);
    } else if (!addRoles.length && removeRoles.length > 1) {
        return $translate.instant(`users.editRoles.confirm.text.removeMany`, { roles: translateRoles(removeRoles) });
    }
};

export const getEditTariffsMessage = ($translate) => (addTariffs: Array<ClubTariff>, removeTariffs: Array<ClubTariff>) : string => {
    let translateTariffCode = (tariffCode) => '«' + this.$translate.instant(`dialogs.${tariffCode}`) + '»';
    let translateTariffCodes = (tariffCodes) => tariffCodes.map(translateTariffCode).join(', ');

    if (addTariffs.length && removeTariffs.length) {
        return $translate.instant('users.editTariffs.confirm.text.addAndRemove', { addTariffCodes: translateTariffCodes(addTariffs), removeTariffCodes: translateTariffCodes(removeTariffs) });
    } else if (addTariffs.length && !removeTariffs.length) {
        return $translate.instant(`users.editTariffs.confirm.text.${addTariffs.length > 1 ? 'addMany' : 'addOne'}`, { tariffCodes: translateTariffCodes(addTariffs) });
    } else if (!addTariffs.length && removeTariffs.length) {
        return $translate.instant(`users.editTariffs.confirm.text.${removeTariffs.length > 1 ? 'removeMany' : 'removeOne'}`, { tariffCodes: translateTariffCodes(addTariffs) });
    }
};
