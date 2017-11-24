import { IGroupManagementProfile, IGroupManagementProfileMember, IGroupProfile, IBillingTariff, IBulkGroupMembership } from '../../../api';
import { IComponentOptions, IComponentController, IPromise } from 'angular';
import { filtersToPredicate, not, memorize } from "../share/utility";
import { 
    ClubTariff, ClubRole, 
    getClubCoaches, getClubTariffGroup, getClubRoleGroup, 
    getMemberCoaches, getMemberRoles, hasClubRole, getMemberId, getClubAthletesGroupId,
    MembersFilterParams, membersFilters, membersOrderings,
    getEditRolesMessage, getEditTariffsMessage,
    addToGroup, removeFromGroup, 
    Management, Member,
} from "./management.datamodel";
import { id, flatMap, unique, keys, entries, pipe, object, allEqual, capitalize, orderBy } from '../share/util.js';
import { inviteDialogConf } from './invite/invite.dialog';
import './management.component.scss';


const includes = (xs: Array<any>, x: any) : boolean => xs.indexOf(x) !== -1;

const difference = (xs: Array<any>, ys: Array<any>) : Array<any> => xs.filter((x) => ys.indexOf(x) === -1);

class ManagementCtrl {

    static $inject = ['$scope','$mdDialog','$translate','GroupService','dialogs','$mdMedia','$mdBottomSheet','SystemMessageService'];

    public management: Management;
    public checked: Array<IGroupManagementProfileMember> = [];    
    public isScreenSmall: boolean;
    public coachesSelector = memorize(getClubCoaches);

    constructor (
        private $scope: any, 
        private $mdDialog: any, 
        private $translate: any, 
        private GroupService: any, 
        private dialogs: any, 
        private $mdMedia: any, 
        private $mdBottomSheet: any, 
        private SystemMessageService: any
    ) {
        this.isScreenSmall = $mdMedia('max-width: 959px');
    }

    set management (management: IGroupManagementProfile) {
        this.management = new Management(management);
    }
    
    update () {
        this.GroupService.getManagementProfile(this.club.groupId, 'club')
        .then((management) => { 
            this.management = management;
            this.checked = [];
            this.$scope.$apply();
        }, (error) => { 
            this.SystemMessageService.show(error);
        });
    }

    getRows () : Array<Member> {
        return this.rowsSelector(this.management, this.filterParams, this.orderBy);
    }

    getCheckedRows () : Array<IGroupManagementProfileMember> {
        return this.getRows().filter((member) => includes(this.checked, member));
    }

    getCoaches () : Array<IGroupManagementProfileMember> {
        return this.coachesSelector(this.management);
    }
    
    isEditTariffsAvailable () : boolean {
        let checkedRows = this.getCheckedRows();
        return allEqual(checkedRows.map(this.getTariffsByClub), angular.equals) 
            && allEqual(checkedRows.map(this.getTariffsNotByClub), angular.equals);
    }
    
    isEditCoachesAvailable () : boolean {
        let checkedRows = this.getCheckedRows();
        return allEqual(checkedRows.map(getMemberCoaches), angular.equals)
            && checkedRows.every(hasClubRole('ClubAthletes'));
    }
    
    isEditAthletesAvailable () : boolean {
        let checkedRows = this.getCheckedRows();
        return allEqual(checkedRows.map(getMemberId).map(this.getAthletesByCoachId), angular.equals)
            && checkedRows.every(hasClubRole('ClubCoaches'));
    }
    
    isEditRolesAvailable () : boolean {
        return allEqual(this.getCheckedRows().map(getMemberRoles), angular.equals);
    }
    
    editTariffs () {
        let tariffs = ['Coach', 'Premium'];
        let checked = this.getCheckedRows();
        let byClub = this.getTariffsByClub(checked[0]);
        let bySelf = this.getTariffsNotByClub(checked[0]);

        this.dialogs.tariffs(tariffs, byClub, bySelf, 'dialogs.byClub')
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
                let members = checked.map(getMemberId);
                let memberships = [
                    ...difference(selectedTariffs, byClub).map(getClubTariffGroup(this.management)).map(addToGroup),
                    ...difference(selectedTariffs, byClub).map(getClubTariffGroup(this.management)).map(removeFromGroup)
                ];
                return this.GroupService.putGroupMembershipBulk(this.club.groupId, memberships, members);
            }
        })
        .then((result) => { 
            if (result) {
                this.update();
            }
        }, (error) => { 
            if (error) {
                this.SystemMessageService.show(error); 
                this.update(); 
            }
        });
    }
    
    editCoaches () {
        let checked = this.getCheckedRows();
        let checkedCoaches = getMemberCoaches(checked[0]);
        this.dialogs.selectUsers(this.getCoaches(), checkedCoaches, 'coaches')
        .then((nextCheckedCoaches) => {
            if (checkedCoaches) {
                let members = this.checked.map(getMemberId);
                let memberships = [
                    ...difference(nextCheckedCoaches, checkedCoaches).map(getClubAthletesGroupId).map(addToGroup),
                    ...difference(checkedCoaches, nextCheckedCoaches).map(getClubAthletesGroupId).map(removeFromGroup),
                ];
                return this.GroupService.putGroupMembershipBulk(this.club.groupId, memberships, members);
            }
        })
        .then((result) => { 
            if (result) {
                this.update();
            }
        }, (error) => { 
            if (error) {
                this.SystemMessageService.show(error); 
                this.update(); 
            }
        });
    }
    
    editAthletes () {
        let checked = this.getCheckedRows();
        let checkedAthletes = this.getAthletesByCoachId(getMemberId(checked[0]));
        let athletes = this.management.members.filter(hasClubRole('ClubAthletes'));

        this.dialogs.selectUsers(athletes, checkedAthletes, 'athletes')
        .then((athletes) => {
            if (athletes) {
                let groupIds = checked.map(getClubAthletesGroupId);
                // нельзя выполнить все действия одним батч-запросом, но можно двумя
                return Promise.all([
                    this.GroupService.putGroupMembershipBulk(this.club.groupId, groupIds.map(addToGroup), difference(athletes, checkedAthletes)),
                    this.GroupService.putGroupMembershipBulk(this.club.groupId, groupIds.map(removeFromGroup), difference(checkedAthletes, athletes))
                ]);
            }
        })
        .then((result) => { 
            if (result) {
                this.update();
            }
        }, (error) => { 
            if (error) {
                this.SystemMessageService.show(error); 
                this.update(); 
            }
        });
    }
    
    editRoles () {
        let roles = ['ClubAthletes', 'ClubCoaches', 'ClubManagement'];
        let checked = this.getCheckedRows();
        let checkedRoles = getMemberRoles(checked[0]).filter((role) => roles.indexOf(role) !== -1);

        this.dialogs.roles(roles, checkedRoles)
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
                let members = checked.map(getMemberId);
                let memberships = [
                    ...difference(roles, checkedRoles).map(getClubRoleGroup(this.management)).map(addToGroup),
                    ...difference(checkedRoles, roles).map(getClubRoleGroup(this.management)).map(removeFromGroup)
                ];
                return this.GroupService.putGroupMembershipBulk(this.club.groupId, memberships, members);
            }
        })
        .then((result) => { 
            if (result) {
                this.update();
            }
        }, (error) => {
            if (error) {
                this.SystemMessageService.show(error); 
                this.update(); 
            }
        });
    }
    
    remove () {
        this.dialogs.confirm({ text: 'dialogs.excludeClub' })
        .then(() => this.checked.map((m) => this.GroupService.leave(this.club.groupId, m.userProfile.userId)))
        .then((promises) => Promise.all(promises))
        .then((result) => { 
            if (result) {
                this.update();
            }
        }, (error) => { 
            if (error) {
                this.SystemMessageService.show(error); 
            }
        });
    }
    
    showActions (member: IGroupManagementProfileMember) {
        this.checked = [member];

        this.$mdBottomSheet.show({
            template: require('./member-actions.html'),
            scope: this.$scope
        });
    }

    invite ($event) {
        this.$mdDialog.show(inviteDialogConf(this.club.groupId, $event));
    }
    
    clearFilter () {
        this.filterParams = {
            ...this.filterParams,
            clubRole: null,
            coachUserId: null,
            noCoach: false
        };
    }
    
    filterNoCoach () {
        this.filterParams = {
            ...this.filterParams,
            clubRole: null,
            coachUserId: null,
            noCoach: true
        };
    }
    
    filterCoach (coachUserId: number) {
        this.filterParams = {
            ...this.filterParams,
            clubRole: null,
            noCoach: false,
            coachUserId,
        };
    }
    
    filterRole (clubRole: ClubRole) {
        this.filterParams = {
            ...this.filterParams,
            coachUserId: null,
            noCoach: false,
            clubRole,
        };
    }

    get search () : string {
        return this.filterParams.search;
    }
    
    set search (search: string) {
        this.filterParams = {
            ...this.filterParams,
            search,
        };
    }

    isFilterEmpty () : boolean {
        let { clubRole, coachUserId, noCoach } = this.filterParams;
        return !clubRole && !coachUserId && !noCoach;
    }
};


let ManagementComponent: IComponentOptions = <any> {
    bindings: {
        view: '<',
        club: '<',
        management: '<'
    },
    require: {
        app: '^staminityApplication'
    },
    controller: ManagementCtrl,
    template: require('./management.component.html'),

};

export default ManagementComponent;
