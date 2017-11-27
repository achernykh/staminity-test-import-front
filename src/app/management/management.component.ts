import { IGroupManagementProfile, IGroupManagementProfileMember, IGroupProfile, IBillingTariff, IBulkGroupMembership } from '../../../api';
import { IComponentOptions, IComponentController, IPromise } from 'angular';
import { filtersToPredicate, createSelector } from "../share/utility";
import { ClubRole, ClubTariff, clubTariffs, clubRoles } from "./management.constants";
import { Member } from "./Member.datamodel";
import { MembersList } from "./MembersList.datamodel";
import { MembersFilterParams, membersFilters, membersOrderings, getRows } from "./MembersFilter.datamodel";
import { getEditRolesMessage, getEditTariffsMessage, getFiltersMessage } from "./management.functions";
import { allEqual, orderBy } from '../share/util.js';
import { inviteDialogConf } from './invite/invite.dialog';
import './management.component.scss';

const difference = (xs: Array<any>, ys: Array<any>) : Array<any> => xs.filter((x) => ys.indexOf(x) === -1);

const addToGroup = (groupId: number) : IBulkGroupMembership => ({ groupId, direction: 'I' });

const removeFromGroup = (groupId: number) : IBulkGroupMembership => ({ groupId, direction: 'O' });

class ManagementCtrl {

    static $inject = ['$scope','$mdDialog','$translate','GroupService','dialogs','$mdMedia','$mdBottomSheet','SystemMessageService'];

    public clubRoles = clubRoles;

    public clubTariffs = clubTariffs;

    public membersList: MembersList;

    public filterParams: MembersFilterParams = {
        clubRole: null,
        coachUserId: null,
        noCoach: false,
        search: '',
    };

    public orderBy: string = 'username';

    public checked: Array<Member> = [];

    public getRows: () => Array<Member> = createSelector([
        () => this.membersList,
        () => this.filterParams,
        () => this.orderBy,
    ], getRows);

    constructor (
        private $scope: any, 
        private $mdDialog: any, 
        private $translate: any, 
        private GroupService: any, 
        private dialogs: any, 
        private $mdMedia: any, 
        private $mdBottomSheet: any, 
        private SystemMessageService: any,
    ) {

    }

    set management (management: IGroupManagementProfile) {
        this.membersList = new MembersList(management);
        console.log('management', management);
    }
    
    update () {
        this.GroupService.getManagementProfile(this.membersList.groupId, 'club')
        .then((management) => { 
            this.management = management;
            this.checked = [];
            this.$scope.$apply();
        }, (error) => { 
            this.SystemMessageService.show(error);
        });
    }

    getChecked () : Array<Member> {
        return this.getRows().filter((member) => this.checked.indexOf(member) !== -1);
    }

    getCoaches () : Array<Member> {
        return this.membersList.getCoaches();
    }

    isBillByClub (bill: IBillingTariff) : boolean {
        return this.membersList.isClubBill(bill);
    }
    
    isEditTariffsAvailable () : boolean {
        let checkedRows = this.getChecked();
        return allEqual(checkedRows.map(this.membersList.getTariffsByClub), angular.equals) 
            && allEqual(checkedRows.map(this.membersList.getTariffsNotByClub), angular.equals);
    }
    
    isEditCoachesAvailable () : boolean {
        return allEqual(this.getChecked().map((member) => member.coaches), angular.equals)
            && this.getChecked().every((member) => member.hasClubRole('ClubAthletes'));
    }
    
    isEditAthletesAvailable () : boolean {
        return allEqual(this.getChecked().map((member) => member.getAthletes()), angular.equals)
            && this.getChecked().every((member) => member.hasClubRole('ClubCoaches'));
    }
    
    isEditRolesAvailable () : boolean {
        return allEqual(this.getChecked().map((member) => member.roleMembership), angular.equals);
    }
    
    editTariffs () {
        let checked = this.getChecked();
        let byClub = this.membersList.getTariffsByClub(checked[0]);
        let bySelf = this.membersList.getTariffsNotByClub(checked[0]);

        this.dialogs.tariffs(this.clubTariffs, byClub, bySelf, 'dialogs.byClub')
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
                let members = checked.map((member) => member.getUserId());
                let memberships = [
                    ...difference(selectedTariffs, byClub).map(this.membersList.getTariffGroupId).map(addToGroup),
                    ...difference(selectedTariffs, byClub).map(this.membersList.getTariffGroupId).map(removeFromGroup)
                ];
                return this.GroupService.putGroupMembershipBulk(this.membersList.groupId, memberships, members);
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
        let checked = this.getChecked();
        let checkedCoaches = checked[0].getCoaches();

        console.log('checkedCoaches', checkedCoaches);

        this.dialogs.selectUsers(this.membersList.getCoaches(), checkedCoaches, 'coaches')
        .then((nextCheckedCoaches) => {
            if (checkedCoaches) {
                let members = this.checked.map((member) => member.getUserId());
                let memberships = [
                    ...difference(nextCheckedCoaches, checkedCoaches).map((member) => member.getAthletesGroupId()).map(addToGroup),
                    ...difference(checkedCoaches, nextCheckedCoaches).map((member) => member.getAthletesGroupId()).map(removeFromGroup),
                ];
                return this.GroupService.putGroupMembershipBulk(this.membersList.groupId, memberships, members);
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
        let checked = this.getChecked();
        let checkedAthletes = checked[0].getAthletes();

        this.dialogs.selectUsers(this.membersList.getAthletes(), checkedAthletes, 'athletes')
        .then((athletes) => {
            if (athletes) {
                let groupIds = checked.map((member) => member.getAthletesGroupId());
                // нельзя выполнить все действия одним батч-запросом, но можно двумя
                return Promise.all([
                    this.GroupService.putGroupMembershipBulk(this.membersList.groupId, groupIds.map(addToGroup), difference(athletes, checkedAthletes)),
                    this.GroupService.putGroupMembershipBulk(this.membersList.groupId, groupIds.map(removeFromGroup), difference(checkedAthletes, athletes))
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
        let checked = this.getChecked();
        let checkedRoles = checked[0].roleMembership.filter((role) => this.clubRoles.indexOf(role) !== -1);

        this.dialogs.roles(this.clubRoles, checkedRoles)
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
                let members = checked.map((member) => member.getUserId());
                let memberships = [
                    ...difference(roles, checkedRoles).map(this.membersList.getRoleGroupId).map(addToGroup),
                    ...difference(checkedRoles, roles).map(this.membersList.getRoleGroupId).map(removeFromGroup)
                ];
                return this.GroupService.putGroupMembershipBulk(this.membersList.groupId, memberships, members);
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
        .then(() => this.checked.map((member) => this.GroupService.leave(this.membersList.groupId, member.userProfile.userId)))
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
    
    showActions (member: Member) {
        this.checked = [member];

        this.$mdBottomSheet.show({
            template: require('./member-actions.html'),
            scope: this.$scope,
            preserveScope: true
        });
    }

    invite ($event) {
        this.$mdDialog.show(inviteDialogConf(this.membersList.groupId, $event));
    }
    
    clearFilter () {
        this.filterParams = {
            ...this.filterParams,
            clubRole: null,
            coachUserId: null,
            noCoach: false
        };
    }

    isFilterEmpty () : boolean {
        let { clubRole, coachUserId, noCoach } = this.filterParams;
        return !clubRole && !coachUserId && !noCoach;
    }
    
    setFilterNoCoach () {
        this.filterParams = {
            ...this.filterParams,
            clubRole: null,
            coachUserId: null,
            noCoach: true
        };
    }
    
    isFilterNoCoach () {
        return this.filterParams.noCoach;
    }

    setFilterCoach (coach: IGroupManagementProfileMember) {
        this.filterParams = {
            ...this.filterParams,
            clubRole: null,
            noCoach: false,
            coachUserId: coach.userProfile.userId,
        };
    }

    isFilterCoach (coach: IGroupManagementProfileMember) {
        return this.filterParams.coachUserId === coach.userProfile.userId;
    }
    
    setFilterRole (clubRole: ClubRole) {
        this.filterParams = {
            ...this.filterParams,
            coachUserId: null,
            noCoach: false,
            clubRole,
        };
    }

    isFilterRole (role: string)  : boolean {
        return this.filterParams.clubRole === role;
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

    isFilterSearch () : boolean {
        return !!this.filterParams.search;
    }

    getFiltersMessage () {
        return getFiltersMessage(this.$translate) (this.filterParams, this.membersList);
    }

    isMobileLayout () : boolean {
        return this.$mdMedia('max-width: 959px');
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
