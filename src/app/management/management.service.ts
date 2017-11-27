import { IGroupManagementProfile, IGroupManagementProfileMember, IGroupProfile, IBillingTariff, IBulkGroupMembership } from '../../../api';
import { ClubRole, ClubTariff, clubTariffs, clubRoles } from "./management.constants";
import { Member } from "./member.datamodel";
import { MembersList } from "./members-list.datamodel";
import { getEditRolesMessage, getEditTariffsMessage } from "./management.filters";
import { allEqual } from '../share/util.js';


/**
 * Разница множеств
 * @param xs: Array<any>
 * @param ys: Array<any>
 * @returns {Array<any>}
 */  
const difference = (xs: Array<any>, ys: Array<any>) : Array<any> => xs.filter((x) => ys.indexOf(x) === -1);

/**
 * Объект, представляющий действие подключения к группе
 * @param groupId: number
 * @returns {IBulkGroupMembership}
 */  
const addToGroup = (groupId: number) : IBulkGroupMembership => ({ groupId, direction: 'I' });

/**
 * Объект, представляющий действие отключения от группы
 * @param groupId: number
 * @returns {IBulkGroupMembership}
 */  
const removeFromGroup = (groupId: number) : IBulkGroupMembership => ({ groupId, direction: 'O' });


export class ManagementService {

    static $inject = ['$mdDialog', '$translate', 'GroupService', 'dialogs'];

    constructor (
        private $mdDialog: any, 
        private $translate: any, 
        private GroupService: any, 
        private dialogs: any, 
    ) {
        
    }

    /**
     * Доступна ли настройка тарифов для списка членов клуба
     * @param membersList: MembersList
     * @param members: Array<Member>
     * @returns {boolean}
     */  
    isEditTariffsAvailable (membersList: MembersList, members: Array<Member>) : boolean {
        return allEqual(members.map(membersList.getTariffsByClub), angular.equals) 
            && allEqual(members.map(membersList.getTariffsNotByClub), angular.equals);
    }
    
    /**
     * Доступна ли настройка тренеров для списка членов клуба
     * @param membersList: MembersList
     * @param members: Array<Member>
     * @returns {boolean}
     */  
    isEditCoachesAvailable (membersList: MembersList, members: Array<Member>) : boolean {
        return allEqual(members.map((member) => member.coaches), angular.equals)
            && members.every((member) => member.hasClubRole('ClubAthletes'));
    }
    
    /**
     * Доступна ли настройка спортсменов для списка членов клуба
     * @param membersList: MembersList
     * @param members: Array<Member>
     * @returns {boolean}
     */  
    isEditAthletesAvailable (membersList: MembersList, members: Array<Member>) : boolean {
        return allEqual(members.map((member) => member.getAthletes()), angular.equals)
            && members.every((member) => member.hasClubRole('ClubCoaches'));
    }
    
    /**
     * Доступна ли настройка ролей для списка членов клуба
     * @param membersList: MembersList
     * @param members: Array<Member>
     * @returns {boolean}
     */  
    isEditRolesAvailable (membersList: MembersList, members: Array<Member>) : boolean {
        return allEqual(members.map((member) => member.roleMembership), angular.equals);
    }

    /**
     * Настройка тарифов выбранных членов
     * @param membersList: MembersList
     * @param members: Array<Member>
     * @returns {Promise<any>}
     */  
    editTariffs (membersList: MembersList, members: Array<Member>) : Promise<any> {
        let byClub = membersList.getTariffsByClub(members[0]);
        let bySelf = membersList.getTariffsNotByClub(members[0]);

        return this.dialogs.tariffs(clubTariffs, byClub, bySelf, 'dialogs.byClub')
            .then((selectedTariffs) => {
                let addTariffs = difference(selectedTariffs, byClub);
                let removeTariffs = difference(byClub, selectedTariffs);
                if (addTariffs.length || removeTariffs.length) {
                    return this.dialogs.confirm({
                        title: this.$translate.instant(`users.editTariffs.confirm.title`),
                        text: getEditTariffsMessage(this.$translate) (addTariffs, removeTariffs),
                        confirm: this.$translate.instant(`users.editTariffs.confirm.confirm`),
                        cancel: this.$translate.instant(`users.editTariffs.confirm.cancel`)
                    }, selectedTariffs);
                }
            })
            .then((selectedTariffs) => {
                if (selectedTariffs) {
                    let memberships = [
                        ...difference(selectedTariffs, byClub).map(membersList.getTariffGroupId).map(addToGroup),
                        ...difference(selectedTariffs, byClub).map(membersList.getTariffGroupId).map(removeFromGroup)
                    ];
                    return this.GroupService.putGroupMembershipBulk(membersList.groupId, memberships, members.map((member) => member.getUserId()));
                }
            });
    }

    /**
     * Настройка тренеров выбранных членов
     * @param membersList: MembersList
     * @param members: Array<Member>
     * @returns {Promise<any>}
     */  
    editCoaches (membersList: MembersList, members: Array<Member>) : Promise<any> {
        let checkedCoaches = members[0].getCoaches();

        return this.dialogs.selectUsers(membersList.getCoaches(), checkedCoaches, 'coaches')
            .then((nextCheckedCoaches) => {
                if (checkedCoaches) {
                    let memberships = [
                        ...difference(nextCheckedCoaches, checkedCoaches).map((member) => member.getAthletesGroupId()).map(addToGroup),
                        ...difference(checkedCoaches, nextCheckedCoaches).map((member) => member.getAthletesGroupId()).map(removeFromGroup),
                    ];
                    return this.GroupService.putGroupMembershipBulk(membersList.groupId, memberships, members.map((member) => member.getUserId()));
                }
            });
    }
    
    /**
     * Настройка спортсменов выбранных членов
     * @param membersList: MembersList
     * @param members: Array<Member>
     * @returns {Promise<any>}
     */  
    editAthletes (membersList: MembersList, members: Array<Member>) : Promise<any> {
        let checkedAthletes = members[0].getAthletes();

        return this.dialogs.selectUsers(membersList.getAthletes(), checkedAthletes, 'athletes')
            .then((athletes) => {
                if (athletes) {
                    let groupIds = members.map((member) => member.getAthletesGroupId());
                    // нельзя выполнить все действия одним батч-запросом, но можно двумя
                    return Promise.all([
                        this.GroupService.putGroupMembershipBulk(membersList.groupId, groupIds.map(addToGroup), difference(athletes, checkedAthletes)),
                        this.GroupService.putGroupMembershipBulk(membersList.groupId, groupIds.map(removeFromGroup), difference(checkedAthletes, athletes))
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
    editRoles (membersList: MembersList, members: Array<Member>) : Promise<any> {
        let checkedRoles = members[0].roleMembership.filter((role) => clubRoles.indexOf(role) !== -1);

        return this.dialogs.roles(clubRoles, checkedRoles)
            .then((roles: Array<ClubRole>) => {
                let addRoles = difference(roles, checkedRoles);
                let removeRoles = difference(checkedRoles, roles);
                if (addRoles.length || removeRoles.length) {
                    return this.dialogs.confirm({
                        title: this.$translate.instant(`users.editRoles.confirm.title`),
                        text: getEditRolesMessage(this.$translate) (addRoles, removeRoles),
                        confirm: this.$translate.instant(`users.editRoles.confirm.confirm`),
                        cancel: this.$translate.instant(`users.editRoles.confirm.cancel`)
                    }, roles);
                }
            })
            .then((roles: Array<ClubRole>) => {
                if (roles) {
                    let memberships = [
                        ...difference(roles, checkedRoles).map(membersList.getRoleGroupId).map(addToGroup),
                        ...difference(checkedRoles, roles).map(membersList.getRoleGroupId).map(removeFromGroup)
                    ];
                    return this.GroupService.putGroupMembershipBulk(membersList.groupId, memberships, members.map((member) => member.getUserId()));
                }
            });
    }
    
    /**
     * Удаление выбранных членов
     * @param membersList: MembersList
     * @param members: Array<Member>
     * @returns {Promise<any>}
     */  
    remove (membersList: MembersList, members: Array<Member>) : Promise<any> {
        return this.dialogs.confirm({ text: 'dialogs.excludeClub' })
            .then(() => members.map((member) => this.GroupService.leave(membersList.groupId, member.userProfile.userId)))
            .then((promises) => Promise.all(promises));
    }
    
}