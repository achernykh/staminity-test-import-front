import { equals } from "angular";
import { IGroupManagementProfile, IGroupManagementProfileMember, IGroupProfile, IUserProfile } from "../../../api";
import { addToGroup, removeFromGroup } from "../core/group.datamodel";
import { arrays } from "../share/utility";
import { getMemberId, getTariffGroupId, isClubAthlete, tariffsByUser, tariffsNotByUser } from "./athletes.functions";


export class AthletesService {

    static $inject = ["$mdDialog", "$translate", "GroupService", "dialogs"];

    constructor (
        private $mdDialog: any, 
        private $translate: any, 
        private GroupService: any, 
        private dialogs: any, 
    ) {
        
    }

    /**
     * Доступно ли удаление выбранных спортсменов
     * @returns {boolean}
     */  
    isRemoveAvailable (user: IUserProfile, members: IGroupManagementProfileMember[]) : boolean {
        return members.every((member) => !isClubAthlete(user, member));
    }

    /**
     * Доступна ли настройка тарифов для списка членов клуба
     * @param management: IGroupManagementProfile
     * @param members: Array<Member>
     * @returns {boolean}
     */  
    isEditTariffsAvailable (user: IUserProfile, members: IGroupManagementProfileMember[]) : boolean {
        return members.every((member) => !isClubAthlete(user, member))
            && arrays.allEqual(members.map(tariffsByUser(user.userId)), equals)
            && arrays.allEqual(members.map(tariffsNotByUser(user.userId)), equals);
    }

    /**
     * Настройка тарифов выбранных членов
     * @param management: IGroupManagementProfile
     * @param members: Array<Member>
     * @returns {Promise<any>}
     */  
    editTariffs (user: IUserProfile, management: IGroupManagementProfile, members: IGroupManagementProfileMember[]) : Promise<any> {
        let byUs = tariffsByUser(user.userId) (members[0]);
        let bySelf = tariffsNotByUser(user.userId) (members[0]);

        return this.dialogs.tariffs(["Premium"], byUs, bySelf, "dialogs.byCoach")
            .then((selectedTariffs) => {
                let addTariffs = arrays.difference(selectedTariffs, byUs);
                let removeTariffs = arrays.difference(byUs, selectedTariffs);
                if (addTariffs.length || removeTariffs.length) {
                    return this.dialogs.confirm({
                        title: this.$translate.instant(`athletes.editTariffs.confirm.title`),
                        text: this.editTariffsMessage(addTariffs, removeTariffs),
                        confirm: this.$translate.instant(`athletes.editTariffs.confirm.confirm`),
                        cancel: this.$translate.instant(`athletes.editTariffs.confirm.cancel`),
                    }, selectedTariffs);
                }
            })
            .then((selectedTariffs) => {
                if (selectedTariffs) {
                    let memberships = [
                        ...arrays.difference(selectedTariffs, byUs).map(getTariffGroupId(management)).map(addToGroup),
                        ...arrays.difference(byUs, selectedTariffs).map(getTariffGroupId(management)).map(removeFromGroup),
                    ];
                    return this.GroupService.putGroupMembershipBulk(user.connections.Athletes.groupId, memberships, members.map(getMemberId));
                }
            });
    }
    
    /**
     * Удаление выбранных членов
     * @param management: IGroupManagementProfile
     * @param members: Array<Member>
     * @returns {Promise<any>}
     */  
    remove (management: IGroupManagementProfile, members: IGroupManagementProfileMember[]) : Promise<any> {
        return this.dialogs.confirm({ text: "dialogs.excludeClub" })
            .then(() => members.map((member) => this.GroupService.leave(management.groupId, member.userProfile.userId)))
            .then((promises) => Promise.all(promises));
    }

    editTariffsMessage (addTariffs, removeTariffs) {
        let translateTariffCode = (tariffCode) => "«" + this.$translate.instant(`dialogs.${tariffCode}`) + "»";

        if (addTariffs.length) {
            return this.$translate.instant("athletes.editTariffs.confirm.text.addOne", { tariffCode: translateTariffCode(addTariffs[0]) });
        } else if (removeTariffs.length) {
            return this.$translate.instant("athletes.editTariffs.confirm.text.removeOne", { tariffCode: translateTariffCode(removeTariffs[0]) });
        }
    }
    
}