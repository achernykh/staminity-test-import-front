import { IGroupManagementProfileMember, IBulkGroupMembership, IGroupManagementProfile, IGroupProfileShort, IUserProfileShort, IBillingTariff } from "../../../api";
import { ClubRole, ClubTariff } from "./management.constants";
import { Member } from "./Member.datamodel";


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
        return this.management['tariffGroups'][tariffCode];
    }

    public getRoleGroupId = (role: ClubRole) : number => {
        return this.availableGroups[role];
    }

    public isClubBill = (bill: IBillingTariff) : boolean => {
        return bill && bill.clubProfile && bill.clubProfile.groupId === this.groupId;
    }

    public getTariffsByClub = (member: Member) : Array<string> => {
        return member.userProfile.billing
            .filter(this.isClubBill)
            .map((bill) => bill.tariffCode);
    }

    public getTariffsNotByClub = (member: Member) : Array<string> => {
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

