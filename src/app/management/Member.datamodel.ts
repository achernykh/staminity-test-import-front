import { IGroupManagementProfileMember, IUserManagementProfile } from "../../../api";
import { ClubRole } from "./management.constants";
import { MembersList } from "./MembersList.datamodel";


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

    public userProfile: IUserManagementProfile;
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
