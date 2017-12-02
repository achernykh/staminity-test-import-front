import { equals } from "angular";
import { IGroupManagementProfile, IGroupManagementProfileMember, IUserProfile } from "../../../api";
import { addToGroup, removeFromGroup } from "../core/group.datamodel";
import GroupService from "../core/group.service";
import { arrays } from "../share/utility";
import { getMemberId, getTariffGroupId, isClubAthlete, tariffsByUser, tariffsNotByUser } from "./athletes.functions";

export class AthletesService {

    public static $inject = ["$mdDialog", "$translate", "GroupService", "dialogs"];

    constructor(
        private $mdDialog: any,
        private $translate: any,
        private groupService: GroupService,
        private dialogs: any,
    ) {

    }

    /**
     * Доступно ли удаление выбранных спортсменов
     * @returns {boolean}
     */
    public isRemoveAvailable(user: IUserProfile, members: IGroupManagementProfileMember[]): boolean {
        return members.every((member) => !isClubAthlete(user, member));
    }

    /**
     * Доступна ли настройка тарифов для списка членов клуба
     * @param management: IGroupManagementProfile
     * @param members: Array<Member>
     * @returns {boolean}
     */
    public isEditTariffsAvailable(user: IUserProfile, members: IGroupManagementProfileMember[]): boolean {
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
    public editTariffs(user: IUserProfile, management: IGroupManagementProfile, members: IGroupManagementProfileMember[]): Promise<any> {
        const byUs = tariffsByUser(user.userId) (members[0]);
        const bySelf = tariffsNotByUser(user.userId) (members[0]);

        return this.dialogs.tariffs(["Premium"], byUs, bySelf, "dialogs.byCoach")
            .then((selectedTariffs) => {
                const addTariffs = arrays.difference(selectedTariffs, byUs);
                const removeTariffs = arrays.difference(byUs, selectedTariffs);
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
                    const memberships = [
                        ...arrays.difference(selectedTariffs, byUs).map(getTariffGroupId(management)).map(addToGroup),
                        ...arrays.difference(byUs, selectedTariffs).map(getTariffGroupId(management)).map(removeFromGroup),
                    ];
                    return this.groupService.putGroupMembershipBulk(user.connections.Athletes.groupId, memberships, members.map(getMemberId));
                }
            });
    }

    /**
     * Удаление выбранных членов
     * @param management: IGroupManagementProfile
     * @param members: Array<Member>
     * @returns {Promise<any>}
     */
    public remove(management: IGroupManagementProfile, members: IGroupManagementProfileMember[]): Promise<any> {
        return this.dialogs.confirm({ text: "dialogs.excludeClub" })
            .then(() => members.map((member) => this.groupService.leave(management.groupId, member.userProfile.userId)))
            .then((promises) => Promise.all(promises));
    }

    public editTariffsMessage(addTariffs, removeTariffs) {
        const translateTariffCode = (tariffCode) => "«" + this.$translate.instant(`dialogs.${tariffCode}`) + "»";

        if (addTariffs.length) {
            return this.$translate.instant("athletes.editTariffs.confirm.text.addOne", { tariffCode: translateTariffCode(addTariffs[0]) });
        } else if (removeTariffs.length) {
            return this.$translate.instant("athletes.editTariffs.confirm.text.removeOne", { tariffCode: translateTariffCode(removeTariffs[0]) });
        }
    }

}
