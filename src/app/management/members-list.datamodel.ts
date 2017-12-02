import { IBillingTariff, IBulkGroupMembership, IGroupManagementProfile, IGroupManagementProfileMember, IGroupProfileShort, IUserProfileShort } from "../../../api";
import { ClubRole, ClubTariff } from "./management.constants";
import { Member } from "./member.datamodel";

export class MembersList implements IGroupManagementProfile {

    public groupId: number;
    public availableGroups: IGroupProfileShort[];
    public members: Member[];

    constructor(
        public management: IGroupManagementProfile,
    ) {
        this.groupId = management.groupId;
        this.availableGroups = management.availableGroups;
        this.members = management.members.map((member) => new Member(this, member));
    }

    /**
     * Член клуба по его userId
     * @param userId: number
     * @returns {Member}
    */
    public getMember = (userId: number): Member => {
        return this.members.find((member) => member.getUserId() === userId);
    }

    /**
     * Члены клуба с клубной ролью "Тренер"
     * @returns {Array<Member>}
    */
    public getCoaches = (): Member[] => {
        return this.members.filter((member) => member.hasClubRole("ClubCoaches"));
    }

    /**
     * Члены клуба с клубной ролью "Спортсмен"
     * @returns {Array<Member>}
    */
    public getAthletes = (): Member[] => {
        return this.members.filter((member) => member.hasClubRole("ClubAthletes"));
    }

    /**
     * Спортсмены данного тренера (по userId тренера)
     * @param userId: number
     * @returns {Array<Member>}
    */
    public getAthletesByCoachId = (userId: number): Member[] => {
        return this.members.filter((member) => member.coaches.indexOf(userId) !== -1);
    }

    /**
     * Спортсмены данного тренера (по userId тренера)
     * @param userId: number
     * @returns {Array<Member>}
    */
    public getTariffGroupId = (tariffCode: ClubTariff): number => {
        return this.management.tariffGroups[tariffCode + "ByClub"];
    }

    /**
     * Спортсмены данного тренера (по userId тренера)
     * @param userId: number
     * @returns {Array<Member>}
    */
    public getRoleGroupId = (role: ClubRole): number => {
        return this.availableGroups[role];
    }

    /**
     * Оплачен ли счёт по тарифу текущим клубом
     * @param bill: IBillingTariff
     * @returns {boolean}
    */
    public isClubBill = (bill: IBillingTariff): boolean => {
        return bill && bill.clubProfile && bill.clubProfile.groupId === this.groupId;
    }

    /**
     * Коды тарифов, подключенных члену за счёт клуба
     * @param member: Member
     * @returns {Array<string>}
    */
    public getTariffsByClub = (member: Member): string[] => {
        return member.userProfile.billing
            .filter(this.isClubBill)
            .map((bill) => bill.tariffCode);
    }

    /**
     * Коды тарифов, подключенных у члена не за счёт клуба
     * @param member: Member
     * @returns {Array<string>}
    */
    public getTariffsNotByClub = (member: Member): string[] => {
        return member.userProfile.billing
            .filter((bill) => !this.isClubBill(bill))
            .map((bill) => bill.tariffCode);
    }
}
