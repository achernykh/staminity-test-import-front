import { IGroupManagementProfile, IGroupManagementProfileMember, IGroupProfile, IBillingTariff, IBulkGroupMembership } from '../../../api';
import { IComponentOptions, IComponentController, IPromise } from 'angular';
import { filtersToPredicate, not } from "../share/utility";
import { 
    ClubTariff, ClubRole, 
    getCoaches, getClubRoles, hasClubRole, addToGroup, removeFromGroup, getClubTariffGroup, getClubRoleGroup, getMemberId, getClubAthletesGroupId,
    MembersFilterParams, membersFilters, membersOrderings,
    getEditRolesMessage, getEditTariffsMessage
} from "./management.datamodel";
import { id, flatMap, unique, keys, entries, pipe, object, allEqual, capitalize, orderBy } from '../share/util.js';
import { inviteDialogConf } from './invite/invite.dialog';
import './management.component.scss';


const includes = (xs: Array<any>, x: any) : boolean => xs.indexOf(x) !== -1;

const difference = (xs: Array<any>, ys: Array<any>) : Array<any> => xs.filter((x) => ys.indexOf(x) === -1);

class ManagementCtrl {

    static $inject = ['$scope','$mdDialog','$translate','GroupService','dialogs','$mdMedia','$mdBottomSheet','SystemMessageService'];

    public club: IGroupProfile;
    public management: IGroupManagementProfile;
    public checked: Array<IGroupManagementProfileMember> = [];    
    public filterParams: MembersFilterParams = {
        clubRole: null,
        coachUserId: null,
        noCoach: false
    };
    public orderBy: string = 'username';
    public isScreenSmall: boolean;

    public isClubBill = (bill: IBillingTariff) : boolean => bill && bill.clubProfile && bill.clubProfile.groupId === this.club.groupId;
    
    public getMember = (id: number) : IGroupManagementProfileMember => this.management.members
        .find((m) => m.userProfile.userId === id);

    public getAthletesByCoachId = (userId: number) => this.management.members
        .filter((member) => includes(getCoaches(member), userId));

    public getTariffsByClub = (member: IGroupManagementProfileMember) : Array<string> => member.userProfile.billing
        .filter(this.isClubBill)
        .map((bill) => bill.tariffCode);

    public getTariffsNotByClub = (member: IGroupManagementProfileMember) : Array<string> => member.userProfile.billing
        .filter(not(this.isClubBill))
        .map((bill) => bill.tariffCode);

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

    getRows () : Array<IGroupManagementProfileMember> {
        let all = this.management.members;
        let filtered = all.filter(filtersToPredicate(membersFilters, this.filterParams));
        let sorted = orderBy(membersOrderings[this.orderBy]) (filtered);
        return sorted;
    }
    
    getCoaches () : Array<IGroupManagementProfileMember> {
        return this.management.members.filter(hasClubRole('ClubCoaches'));
    }

    getCheckedCoaches () {
        return getCoaches(this.checked[0]).map(this.getMember);
    }
    
    isEditTariffsAvailable () {
        return allEqual(this.checked.map(this.getTariffsByClub), angular.equals)
            && allEqual(this.checked.map(this.getTariffsNotByClub), angular.equals);
    }
    
    isEditCoachesAvailable () {
        return allEqual(this.checked.map(getCoaches), angular.equals)
            && this.checked.every(hasClubRole('ClubAthletes'));
    }
    
    isEditAthletesAvailable () {
        return allEqual(this.getRows().map(getMemberId).map(this.getAthletesByCoachId), angular.equals)
            && this.checked.every(hasClubRole('ClubCoaches'));
    }
    
    isEditRolesAvailable() {
        return allEqual(this.checked.map(getClubRoles), angular.equals);
    }
    
    editTariffs () {
        let tariffs = ['Coach', 'Premium'];
        let checked = this.checked;
        let byClub = this.getTariffsByClub(checked[0]);
        let bySelf = this.getTariffsNotByClub(checked[0]);

        this.dialogs.tariffs(tariffs, byClub, bySelf, 'dialogs.byClub')
        .then((selectedTariffs) => {
            let addTariffs = difference(selectedTariffs, byClub);
            let removeTariffs = difference(selectedTariffs, byClub);
            return this.dialogs.confirm({
                title: this.$translate.instant(`users.editTariffs.confirm.title`),
                text: getEditTariffsMessage(this.$translate) (addTariffs, removeTariffs),
                confirm: this.$translate.instant(`users.editTariffs.confirm.confirm`),
                cancel: this.$translate.instant(`users.editTariffs.confirm.cancel`)
            }, [addTariffs, removeTariffs]);
        })
        .then(([addTariffs, removeTariffs]) => {
            let members = checked.map(getMemberId);
            let memberships = [
                ...addTariffs.map(getClubTariffGroup(this.management)).map(addToGroup),
                ...removeTariffs.map(getClubTariffGroup(this.management)).map(removeFromGroup)
            ];
            return this.GroupService.putGroupMembershipBulk(this.club.groupId, memberships, members);
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
        let checkedCoaches = this.getCheckedCoaches();
        this.dialogs.selectUsers(this.getCoaches(), checkedCoaches, 'coaches')
        .then((checkedCoaches) => {
            if (checkedCoaches) {
                let members = this.checked.map(getMemberId);
                let memberships = [
                    ...difference(checkedCoaches, checkedCoaches).map(getClubAthletesGroupId).map(addToGroup),
                    ...difference(checkedCoaches, checkedCoaches).map(getClubAthletesGroupId).map(removeFromGroup),
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
        let checked = this.checked;
        let checkedAthletes = this.getAthletesByCoachId(checked[0]);
        let athletes = this.management.members.filter(hasClubRole('ClubAthletes'));

        this.dialogs.selectUsers(athletes, checkedAthletes, 'athletes')
        .then((athletes) => {
            if (athletes) {
                let athletesToAdd = difference(athletes, checkedAthletes);
                let athletesToRemove = difference(checkedAthletes, athletes);
                let groupIds = checked.map(getClubAthletesGroupId);
                // нельзя выполнить все действия одним батч-запросом, но можно двумя
                return Promise.all([
                    this.GroupService.putGroupMembershipBulk(this.club.groupId, groupIds.map(addToGroup), athletesToAdd),
                    this.GroupService.putGroupMembershipBulk(this.club.groupId, groupIds.map(removeFromGroup), athletesToRemove)
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
        let checked = this.checked;
        let checkedRoles = getClubRoles(checked[0]);
        let roles = ['ClubAthletes', 'ClubCoaches', 'ClubManagement'];

        this.dialogs.roles(roles)
        .then((roles) => {
            let addRoles = difference(roles, checkedRoles);
            let removeRoles = difference(checkedRoles, roles);
            return this.dialogs.confirm({
                title: this.$translate.instant(`users.editRoles.confirm.title`),
                text: getEditRolesMessage(this.$translate) (addRoles, removeRoles),
                confirm: this.$translate.instant(`users.editRoles.confirm.confirm`),
                cancel: this.$translate.instant(`users.editRoles.confirm.cancel`)
            }, [addRoles, removeRoles]);
        })
        .then(([addRoles, removeRoles]: Array<Array<ClubRole>>) => {
            let members = checked.map(getMemberId);
            let memberships = [
                ...addRoles.map(getClubRoleGroup(this.management)).map(addToGroup),
                ...removeRoles.map(getClubRoleGroup(this.management)).map(removeFromGroup)
            ];
            return this.GroupService.putGroupMembershipBulk(this.club.groupId, memberships, members);
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
            clubRole: null,
            coachUserId: null,
            noCoach: false
        };
    }
    
    filterNoCoach () {
        this.filterParams = {
            clubRole: null,
            coachUserId: null,
            noCoach: true
        };
    }
    
    filterCoach (coachUserId: number) {
        this.filterParams = {
            clubRole: null,
            coachUserId: coachUserId,
            noCoach: false
        };
    }
    
    filterRole (role: ClubRole) {
        this.filterParams = {
            clubRole: role,
            coachUserId: null,
            noCoach: false
        };
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
