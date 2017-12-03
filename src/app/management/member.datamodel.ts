import { IGroupManagementProfileMember, IUserManagementProfile } from "../../../api";
import { ClubRole } from "./management.constants";
import { MembersList } from "./members-list.datamodel";

export class Member implements IGroupManagementProfileMember {

    userProfile: IUserManagementProfile;
    roleMembership: string[];
    coaches: number[];

    constructor(
        public membersList: MembersList,
        public member: IGroupManagementProfileMember,
    ) {
        this.userProfile = member.userProfile;
        this.roleMembership = member.roleMembership;
        this.coaches = member.coaches;
    }

    /**
     * UserId члена клуба
     * @returns {number}
    */
    getUserId = (): number => {
        return this.userProfile.userId;
    }

    /**
     * Назначена ли члену клуба данная роль
     * @param role: ClubRole
     * @returns {boolean}
    */
    hasClubRole = (role: ClubRole): boolean => {
        return this.roleMembership.indexOf(role) !== -1;
    }

    /**
     * Список спортсменов, тренируемых членом клуба
     * @returns {Array<Member>}
    */
    getAthletes = (): Member[] => {
        return this.membersList.getAthletesByCoachId(this.getUserId());
    }

    /**
     * Список тренеров члена клуба
     * @param bill: IBillingTariff
     * @returns {boolean}
    */
    getCoaches = (): Member[] => {
        return this.coaches.map(this.membersList.getMember);
    }

    /**
     * GroupId группы спортсменов, тренируемых членом клуба
     * @param bill: IBillingTariff
     * @returns {boolean}
    */
    getAthletesGroupId = (): number => {
        return this.member["ClubAthletesGroupId"];
    }
}
