import { IGroupManagementProfileMember, IUserManagementProfile } from "../../../api";
import { ClubRole } from "./management.constants";
import { MembersList } from "./members-list.datamodel";
import { User } from "../user/user.datamodel";

export class Member implements IGroupManagementProfileMember {

    userProfile: IUserManagementProfile;
    roleMembership: string[];
    coaches: number[];
    profile: User;

    constructor(
        public membersList: MembersList,
        public member: IGroupManagementProfileMember,
    ) {
        this.userProfile = member.userProfile;
        this.profile = new User(member.userProfile);
        this.roleMembership = member.roleMembership;
        this.coaches = member.coaches;
    }

    get isManagement (): boolean {
        return this.roleMembership && this.roleMembership.indexOf('ClubManagement') !== -1;
    }

    get isAthlete (): boolean {
        return this.roleMembership && this.roleMembership.indexOf('ClubAthletes') !== -1;
    }

    get isCoach (): boolean {
        return this.roleMembership && this.roleMembership.indexOf('ClubCoaches') !== -1;
    }

    get isMember (): boolean {
        return this.roleMembership && !this.isManagement && !this.isCoach && !this.isAthlete;
    }

    /**
     * UserId члена клуба
     * @returns {number}
    */
    getUserId = (): number => {
        return this.profile.userId;
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
