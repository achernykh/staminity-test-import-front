import { addToGroup, removeFromGroup } from "../core/group.datamodel";
import GroupService from "../core/group.service";
import { arrays } from "../share/utility";
import { ClubRole, clubRoles, ClubTariff, clubTariffs } from "./management.constants";
import { getEditRolesMessage, getEditTariffsMessage } from "./management.filters";
import { Member } from "./member.datamodel";
import { MembersList } from "./members-list.datamodel";

export class ManagementService {

    static $inject = ["$mdDialog", "$translate", "GroupService", "dialogs"];

    constructor(
        private $mdDialog: any,
        private $translate: any,
        private groupService: GroupService,
        private dialogs: any,
    ) {

    }

    /**
     * Доступна ли настройка тарифов для списка членов клуба
     * @param membersList: MembersList
     * @param members: Array<Member>
     * @returns {boolean}
     */
    isEditTariffsAvailable(membersList: MembersList, members: Member[]): boolean {
        return arrays.allEqual(members.map(membersList.getTariffsByClub), angular.equals)
            && arrays.allEqual(members.map(membersList.getTariffsNotByClub), angular.equals);
    }

    /**
     * Доступна ли настройка тренеров для списка членов клуба
     * @param membersList: MembersList
     * @param members: Array<Member>
     * @returns {boolean}
     */
    isEditCoachesAvailable(membersList: MembersList, members: Member[]): boolean {
        return arrays.allEqual(members.map((member) => member.coaches), angular.equals)
            && members.every((member) => member.hasClubRole("ClubAthletes"));
    }

    /**
     * Доступна ли настройка спортсменов для списка членов клуба
     * @param membersList: MembersList
     * @param members: Array<Member>
     * @returns {boolean}
     */
    isEditAthletesAvailable(membersList: MembersList, members: Member[]): boolean {
        return arrays.allEqual(members.map((member) => member.getAthletes()), angular.equals)
            && members.every((member) => member.hasClubRole("ClubCoaches"));
    }

    /**
     * Доступна ли настройка ролей для списка членов клуба
     * @param membersList: MembersList
     * @param members: Array<Member>
     * @returns {boolean}
     */
    isEditRolesAvailable(membersList: MembersList, members: Member[]): boolean {
        return arrays.allEqual(members.map((member) => member.roleMembership), angular.equals);
    }

    /**
     * Настройка тарифов выбранных членов
     * @param membersList: MembersList
     * @param members: Array<Member>
     * @returns {Promise<any>}
     */
    editTariffs(membersList: MembersList, members: Member[], $scope?: any): Promise<any> {
        const byClub = membersList.getTariffsByClub(members[0]);
        const bySelf = membersList.getTariffsNotByClub(members[0]);

        return this.dialogs.tariffs(clubTariffs, byClub, bySelf, "dialogs.byClub", $scope)
            .then((selectedTariffs) => {
                const addTariffs = arrays.difference(selectedTariffs, byClub);
                const removeTariffs = arrays.difference(byClub, selectedTariffs);
                if (addTariffs.length || removeTariffs.length) {
                    return this.dialogs.confirm({
                        title: this.$translate.instant(`users.editTariffs.confirm.title`),
                        text: getEditTariffsMessage(this.$translate) (addTariffs, removeTariffs),
                        confirm: this.$translate.instant(`users.editTariffs.confirm.confirm`),
                        cancel: this.$translate.instant(`users.editTariffs.confirm.cancel`),
                    }, selectedTariffs);
                }
            })
            .then((selectedTariffs) => {
                if (selectedTariffs) {
                    const memberships = [
                        ...arrays.difference(selectedTariffs, byClub).map(membersList.getTariffGroupId).map(addToGroup),
                        ...arrays.difference(byClub, selectedTariffs).map(membersList.getTariffGroupId).map(removeFromGroup),
                    ];
                    return this.groupService.putGroupMembershipBulk(membersList.groupId, memberships, members.map((member) => member.getUserId()));
                }
            });
    }

    /**
     * Настройка тренеров выбранных членов
     * @param membersList: MembersList
     * @param members: Array<Member>
     * @returns {Promise<any>}
     */
    editCoaches(membersList: MembersList, members: Member[], $scope?: any): Promise<any> {
        const checkedCoaches = members[0].getCoaches();
        debugger;
        return this.dialogs.selectUsers(membersList.getCoaches(), checkedCoaches, "coaches", $scope)
            .then((nextCheckedCoaches) => {
                if (checkedCoaches) {
                    const memberships = [
                        ...arrays.difference(nextCheckedCoaches, checkedCoaches).map((member) => member.getAthletesGroupId()).map(addToGroup),
                        ...arrays.difference(checkedCoaches, nextCheckedCoaches).map((member) => member.getAthletesGroupId()).map(removeFromGroup),
                    ];
                    return this.groupService.putGroupMembershipBulk(membersList.groupId, memberships, members.map((member) => member.getUserId()));
                }
            });
    }

    /**
     * Настройка спортсменов выбранных членов
     * @param membersList: MembersList
     * @param members: Array<Member>
     * @returns {Promise<any>}
     */
    editAthletes(membersList: MembersList, members: Member[], $scope?: any): Promise<any> {
        const checkedAthletes = members[0].getAthletes();

        return this.dialogs.selectUsers(membersList.getAthletes(), checkedAthletes, "athletes", $scope)
            .then((athletes) => {
                if (athletes) {
                    let groupIds = members.map((member) => member.getAthletesGroupId());
                    let athletesToAdd = arrays.difference(athletes, checkedAthletes).map((member) => member.getUserId());
                    let athletesToRemove = arrays.difference(checkedAthletes, athletes).map((member) => member.getUserId());
                    // нельзя выполнить все действия одним батч-запросом, но можно двумя
                    return Promise.all([
                        this.groupService.putGroupMembershipBulk(membersList.groupId, groupIds.map(addToGroup), athletesToAdd),
                        this.groupService.putGroupMembershipBulk(membersList.groupId, groupIds.map(removeFromGroup), athletesToRemove),
                    ]);
                }
            });
    }

    /**
     * Настройка ролей выбранных членов
     * @param membersList: MembersList
     * @param members: Array<Member>
     * @returns {Promise<any>}
     */
    editRoles(membersList: MembersList, members: Member[], $scope?: any): Promise<any> {
        const checkedRoles = members[0].roleMembership.filter((role) => clubRoles.indexOf(role) !== -1);

        return this.dialogs.roles(clubRoles, checkedRoles, $scope)
            .then((roles: ClubRole[]) => {
                const addRoles = arrays.difference(roles, checkedRoles);
                const removeRoles = arrays.difference(checkedRoles, roles);
                if (addRoles.length || removeRoles.length) {
                    return this.dialogs.confirmAdvance({
                        title: this.$translate.instant(`users.editRoles.confirm.title`),
                        text: getEditRolesMessage(this.$translate) (addRoles, removeRoles),
                        confirm: this.$translate.instant(`users.editRoles.confirm.confirm`),
                        cancel: this.$translate.instant(`users.editRoles.confirm.cancel`),
                        info: this.$translate.instant(`users.editRoles.confirm.info`),
                    }, roles);
                }
            })
            .then((roles: ClubRole[]) => {
                if (roles) {
                    const memberships = [
                        ...arrays.difference(roles, checkedRoles).map(membersList.getRoleGroupId).map(addToGroup),
                        ...arrays.difference(checkedRoles, roles).map(membersList.getRoleGroupId).map(removeFromGroup),
                    ];
                    return this.groupService.putGroupMembershipBulk(membersList.groupId, memberships, members.map((member) => member.getUserId()));
                }
            });
    }

    /**
     * Удаление выбранных членов
     * @param membersList: MembersList
     * @param members: Array<Member>
     * @returns {Promise<any>}
     */
    remove(membersList: MembersList, members: Member[]): Promise<any> {
        return this.dialogs.confirm({ text: "dialogs.excludeClub" })
            .then(() => members.map((member) => this.groupService.leave(membersList.groupId, member.userProfile.userId)))
            .then((promises) => Promise.all(promises));
    }

}
