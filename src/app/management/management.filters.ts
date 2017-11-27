import { ClubRole, ClubTariff, clubTariffs, clubRoles } from "./management.constants";
import { Member } from "./Member.datamodel";
import { MembersList } from "./MembersList.datamodel";
import { MembersFilterParams, membersFilters, membersOrderings, getRows } from "./MembersFilter.datamodel";

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

getEditRolesMessage.$inject = ['$translate'];

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

getEditTariffsMessage.$inject = ['$translate'];

export const membersFiltersFilter = ($translate) => (filterParams: MembersFilterParams, membersList: MembersList) : string => {
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

membersFiltersFilter.$inject = ['$translate'];

export const roleMembershipFilter = ($translate) => (roleMemberships) => {
    roleMemberships = ['ClubManagement', 'ClubCoaches', 'ClubAthletes'].filter((m) => roleMemberships.indexOf(m) !== -1);

    if (!roleMemberships || !roleMemberships.length) {
        return;
    } else if (roleMemberships.length === 1) {
        return $translate.instant('users.clubRoles.' + roleMemberships[0]);
    } else if (roleMemberships.length > 1) {
        return `${$translate.instant('users.clubRoles.' + roleMemberships[0])}, +${roleMemberships.length - 1}`;
    } 
};

roleMembershipFilter.$inject = ['$translate'];