import { equals } from "angular";
import { IGroupManagementProfile, IGroupManagementProfileMember, IUserProfile } from "../../../api";
import { addToGroup, removeFromGroup } from "../core/group.datamodel";
import GroupService from "../core/group.service";
import { arrays } from "../share/utility";
import { getMemberId, getTariffGroupId, isClubAthlete, tariffsByUser, tariffsNotByUser } from "./athletes.functions";

export class AthletesService {

    static $inject = ["$mdDialog", "$translate", "GroupService", "dialogs"];

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
    isRemoveAvailable(user: IUserProfile, members: IGroupManagementProfileMember[]): boolean {
        return members.every((member) => !isClubAthlete(user, member));
    }

    /**
     * Доступна ли настройка тарифов для списка членов клуба
     * @param management: IGroupManagementProfile
     * @param members: Array<Member>
     * @returns {boolean}
     */
    isEditTariffsAvailable(user: IUserProfile, members: IGroupManagementProfileMember[]): boolean {
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
    editTariffs(user: IUserProfile, management: IGroupManagementProfile, members: IGroupManagementProfileMember[], $scope?: any): Promise<any> {
        const byUs = tariffsByUser(user.userId) (members[0]);
        const bySelf = tariffsNotByUser(user.userId) (members[0]);

        console.log('editTariffs', user.connections.Athletes.groupId, management.groupId);

        return this.dialogs.tariffs(["Premium"], byUs, bySelf, "dialogs.byCoach", $scope)
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
                    return this.groupService.putGroupMembershipBulk(management.groupId, memberships, members.map(getMemberId));
                }
            });
    }

    /**
     * Удаление выбранных членов
     * @param management: IGroupManagementProfile
     * @param members: Array<Member>
     * @returns {Promise<any>}
     */
    remove(user: IUserProfile, members: IGroupManagementProfileMember[]): Promise<any> {
        return this.dialogs.confirm({ text: "dialogs.removeAthlete" })
            .then(() => members.map((member) => this.groupService.leave(user.connections.Athletes.groupId, member.userProfile.userId)))
            .then((promises) => Promise.all(promises));
    }

    /**
     * Текст сообщения об изменении тарифов
     * @param addTariffs
     * @param removeTariffs
     * @returns {string}
     */
    editTariffsMessage(addTariffs, removeTariffs) {
        const translateTariffCode = (tariffCode) => "«" + this.$translate.instant(`dialogs.${tariffCode}`) + "»";

        if (addTariffs.length) {
            return this.$translate.instant("athletes.editTariffs.confirm.text.addOne", { tariffCode: translateTariffCode(addTariffs[0]) });
        } else if (removeTariffs.length) {
            return this.$translate.instant("athletes.editTariffs.confirm.text.removeOne", { tariffCode: translateTariffCode(removeTariffs[0]) });
        }
    }

}
