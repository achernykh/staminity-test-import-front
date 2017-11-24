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

export class Member {
    constructor (
        public member: IGroupManagementProfileMember,
    ) {

    }
}

export class Management {

    public filterParams: MembersFilterParams = {
        clubRole: null,
        coachUserId: null,
        noCoach: false,
        search: '',
    };

    public orderBy: string = 'username';

    public checked: Array<IGroupManagementProfileMember> = [];

    public isClubBill = (bill: IBillingTariff) : boolean => bill && bill.clubProfile && bill.clubProfile.groupId === this.club.groupId;
    
    public getMember = (id: number) : IGroupManagementProfileMember => this.management.members
        .find((m) => m.userProfile.userId === id);

    public getAthletesByCoachId = (userId: number) => this.management.members
        .filter((member) => includes(getMemberCoaches(member), userId))
        .map(getMemberId);

    public getTariffsByClub = (member: IGroupManagementProfileMember) : Array<string> => member.userProfile.billing
        .filter(this.isClubBill)
        .map((bill) => bill.tariffCode);

    public getTariffsNotByClub = (member: IGroupManagementProfileMember) : Array<string> => member.userProfile.billing
        .filter(not(this.isClubBill))
        .map((bill) => bill.tariffCode);

    public rowsSelector = memorize((management: IGroupManagementProfile, filterParams: MembersFilterParams, order: string) : Array<IGroupManagementProfileMember> => {
        console.log('ManagementCtrl', filterParams);
        let rows = management.members.filter(filtersToPredicate(membersFilters, filterParams));

        if (order.startsWith('-')) {
            return (orderBy(membersOrderings[order.slice(1)]) (rows)).reverse();
        } else {
            return orderBy(membersOrderings[order]) (rows);
        }
    });

    constructor (
        public management: IGroupManagementProfile,
    ) {

    }
}
