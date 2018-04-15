import { IBillingTariff, IBulkGroupMembership, IGroupManagementProfile, IGroupManagementProfileMember, IUserProfile } from "../../../api";
import { arrays } from "../share/utility";

/**
 * UserId члена группы
 * @param member: IGroupManagementProfileMember
 * @returns {number}
 */
export const getMemberId = (member: IGroupManagementProfileMember): number => {
    return member.userProfile.userId;
};

/**
 * Отображаемое имя члена группы
 * @param member: IGroupManagementProfileMember
 * @returns {string}
 */
export const getMemberUsername = (member: IGroupManagementProfileMember): string => {
    return `${member.userProfile.public.lastName} ${member.userProfile.public.firstName}`;
};

/**
 * Оплачен ли счёт по тарифу данным пользователем
 * @param userId: number
 * @param bill: IBillingTariff
 * @returns {boolean}
*/
export const isBillByUser = (userId: number, bill: IBillingTariff): boolean => {
    return bill.userProfilePayer && bill.userProfilePayer.userId === userId;
};

/**
 * Список тарифов, подключенных за счёт пользователя (как тренера)
 * @param userId: number
 * @param member: IGroupManagementProfileMember
 * @returns {Array<string>}
 */
export const tariffsByUser = (userId: number) => (member: IGroupManagementProfileMember) => {
    return member.userProfile.billing
        .filter((bill) => isBillByUser(userId, bill))
        .map((bill) => bill.tariffCode);
};

/**
 * Список тарифов, подключенных не за счёт пользователя (как тренера)
 * @param userId: number
 * @param member: IGroupManagementProfileMember
 * @returns {Array<string>}
 */
export const tariffsNotByUser = (userId: number) => (member: IGroupManagementProfileMember) => {
    return member.userProfile.billing
        .filter((bill) => !isBillByUser(userId, bill))
        .map((bill) => bill.tariffCode);
};

/**
 * Назначен ли спортсмен тренеру клубом
 * @param user: IUserProfile
 * @param member: IGroupManagementProfileMember
 * @returns {boolean}
 */  
export const isClubAthlete = (coach: IUserProfile, athlete: IGroupManagementProfileMember) : boolean => {
    return -1 === coach.connections.Athletes.groupMembers
        .map((user) => user.userId)
        .indexOf(getMemberId(athlete));
};

/**
 * GroupId группы спортсменов, которым за счёт тренера подключён данный тариф
 * @param userId: number
 * @param member: IGroupManagementProfileMember
 * @returns {number}
 */
export const getTariffGroupId = (management: IGroupManagementProfile) => (tariffCode: string) => {
    return management["tariffGroups"][tariffCode + "ByCoach"];
};

/**
 * Сортировки списка спортсменов
 */
export const athletesOrderings: {
    [key: string]: (IGroupManagementProfileMember) => number | string;
} = {
    username: getMemberUsername,
    club: (member) => "-",
    tariff: (member) => member.billing && member.billing.map((t) => t.tariffCode).join(", "),
    city: (member) => member.userProfile.public.city,
    ageGroup: (member) => member.userProfile.public.sex,
};
