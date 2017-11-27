import { IGroupManagementProfileMember, IBulkGroupMembership, IGroupManagementProfile, IGroupProfileShort, IUserProfileShort, IBillingTariff } from "../../../api";
import { Filter, filtersToPredicate } from "../share/utility";
import { orderBy } from '../share/util.js';

export type ClubTariff = 'Coach' | 'Premium';
export type ClubRole = 'ClubCoaches' | 'ClubAthletes' | 'ClubManagement';


export class Member implements IGroupManagementProfileMember {

    public getUserId = () : number => {
        return this.userProfile.userId;
    }

    public hasClubRole = (role: ClubRole) => {
        return this.roleMembership.indexOf(role) !== -1;
    }

    public getAthletes = () : Array<Member> => {
        return this.membersList.getAthletesByCoachId(this.getUserId());
    }

    public getCoaches = () : Array<Member> => {
        return this.coaches.map(this.membersList.getMember);
    }

    public getAthletesGroupId = () : number => {
        return this.member['ClubAthletesGroupId'];
    }

    public userProfile: IUserProfileShort;
    public roleMembership: Array<string>;
    public coaches: Array<number>;

    constructor (
        public membersList: MembersList,
        public member: IGroupManagementProfileMember,
    ) {
        this.userProfile = member.userProfile;
        this.roleMembership = member.roleMembership;
        this.coaches = member.coaches;
    }
}


export class MembersList implements IGroupManagementProfile {
        
    public getMember = (id: number) : Member => {
        return this.members.find((member) => member.getUserId() === id);
    }

    public getCoaches = () => {
        return this.members.filter((member) => member.hasClubRole('ClubCoaches'));
    }

    public getAthletes = () => {
        return this.members.filter((member) => member.hasClubRole('ClubAthletes'));
    }

    public getAthletesByCoachId = (userId: number) : Array<Member> => {
        return this.members.filter((member) => member.coaches.indexOf(userId) !== -1);
    }

    public getTariffGroupId = (tariffCode: ClubTariff) : number => {
        return this.management['tariffGroups'][tariffCode + 'ByClub'];
    }

    public getRoleGroupId = (role: ClubRole) : number => {
        return this.availableGroups[role];
    }

    public isClubBill = (bill: IBillingTariff) : boolean => {
        return bill && bill.clubProfile && bill.clubProfile.groupId === this.groupId;
    }

    public getTariffsByClub = (member: IGroupManagementProfileMember) : Array<string> => {
        return member.userProfile.billing
            .filter(this.isClubBill)
            .map((bill) => bill.tariffCode);
    }

    public getTariffsNotByClub = (member: IGroupManagementProfileMember) : Array<string> => {
        return member.userProfile.billing
            .filter((bill) => !this.isClubBill(bill))
            .map((bill) => bill.tariffCode);
    }

    public groupId: number;
    public availableGroups: Array<IGroupProfileShort>;
    public members: Array<Member>;

    constructor (
        public management: IGroupManagementProfile
    ) {
        this.groupId = management.groupId;
        this.availableGroups = management.availableGroups;
        this.members = management.members.map((member) => new Member(this, member));
    }
}


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

export const getFiltersMessage = ($translate) => (filterParams: MembersFilterParams, membersList: MembersList) : string => {
    return (
        filterParams.noCoach && $translate.instant('users.filters.noCoach')
    ) || (
        filterParams.coachUserId && $translate.instant('users.filters.coach') + ': ' + (({ firstName, lastName }) => firstName + ' ' + lastName) (membersList.getMember(filterParams.coachUserId).userProfile.public)
    ) || (
        filterParams.clubRole && $translate.instant('users.filters.all') + ': ' + $translate.instant('users.clubRoles.' + filterParams.clubRole)
    ) || (
        $translate.instant('users.filters.all')
    );
};

