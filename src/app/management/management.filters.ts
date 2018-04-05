import { ClubRole, clubRoles, ClubTariff, clubTariffs } from "./management.constants";
import { Member } from "./member.datamodel";
import { getRows, MembersFilterParams, membersFilters, membersOrderings } from "./members-filter.datamodel";
import { MembersList } from "./members-list.datamodel";

/**
 * Сообщение об изменении набора клубных ролей выбранных членов
 * @param $translate
 * @param addRoles: Array<ClubRole>
 * @param removeRoles: Array<ClubRole>
 * @returns {string}
*/
export const getEditRolesMessage = ($translate) => (addRoles: ClubRole[], removeRoles: ClubRole[]): string => {
    const translateRole = (role) => $translate.instant(`dialogs.${role}`);
    const translateRoles = (roles) => roles.map(translateRole).join(", ");

    if (addRoles.length && removeRoles.length) {
        return $translate.instant("users.editRoles.confirm.text.addAndRemove", { addRoles: translateRoles(addRoles), removeRoles: translateRoles(removeRoles) });
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

getEditRolesMessage.$inject = ["$translate"];

/**
 * Сообщение об изменении набора тарифов, подключенных выбранным членам за счёт клуба
 * @param $translate
 * @param addTariffs: Array<ClubTariff>
 * @param removeTariffs: Array<ClubTariff>
 * @returns {string}
*/
export const getEditTariffsMessage = ($translate) => (addTariffs: ClubTariff[], removeTariffs: ClubTariff[]): string => {
    debugger;
    const translateTariffCode = (tariffCode) => "«" + $translate.instant(`dialogs.${tariffCode}`) + "»";
    const translateTariffCodes = (tariffCodes) => tariffCodes.map(translateTariffCode).join(", ");

    if (addTariffs.length && removeTariffs.length) {
        return $translate.instant("users.editTariffs.confirm.text.addAndRemove", { addTariffCodes: translateTariffCodes(addTariffs), removeTariffCodes: translateTariffCodes(removeTariffs) });
    } else if (addTariffs.length && !removeTariffs.length) {
        return $translate.instant(`users.editTariffs.confirm.text.${addTariffs.length > 1 ? "addMany" : "addOne"}`, { tariffCodes: translateTariffCodes(addTariffs) });
    } else if (!addTariffs.length && removeTariffs.length) {
        return $translate.instant(`users.editTariffs.confirm.text.${removeTariffs.length > 1 ? "removeMany" : "removeOne"}`, { tariffCodes: translateTariffCodes(addTariffs) });
    }
};

getEditTariffsMessage.$inject = ["$translate"];

/**
 * Текстовое представление выбранных фильтров списка членов клуба
 * @param $translate
 * @param filterParams: MembersFilterParams
 * @param membersList: MembersList
 * @returns {string}
*/
export const membersFiltersFilter = ($translate) => (filterParams: MembersFilterParams, membersList: MembersList): string => {
    return (
        filterParams.noCoach && $translate.instant("users.filters.noCoach")
    ) || (
        filterParams.coachUserId && $translate.instant("users.filters.coach") + ": " + (({ firstName, lastName }) => lastName + (firstName as string).substr(0,1) + '.') (membersList.getMember(filterParams.coachUserId).userProfile.public)
    ) || (
        filterParams.clubRole && $translate.instant("users.filters.all") + ": " + $translate.instant("users.clubRoles." + filterParams.clubRole)
    ) || (
        $translate.instant("users.filters.all")
    );
};

membersFiltersFilter.$inject = ["$translate"];

/**
 * Текстовое представление списка ролей члена клуба
 * @param $translate
 * @param filterParams: MembersFilterParams
 * @param membersList: MembersList
 * @returns {string}
*/
export const roleMembershipFilter = ($translate) => (roleMemberships) => {
    roleMemberships = ["ClubManagement", "ClubCoaches", "ClubAthletes"].filter((m) => roleMemberships.indexOf(m) !== -1);

    if (!roleMemberships || !roleMemberships.length) {
        return;
    } else if (roleMemberships.length === 1) {
        return $translate.instant("users.clubRoles." + roleMemberships[0]);
    } else if (roleMemberships.length > 1) {
        return `${$translate.instant("users.clubRoles." + roleMemberships[0])}, +${roleMemberships.length - 1}`;
    }
};

roleMembershipFilter.$inject = ["$translate"];
