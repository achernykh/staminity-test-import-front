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
} from "./management.datamodel";
import { id, flatMap, unique, keys, entries, pipe, object, allEqual, capitalize, orderBy } from '../share/util.js';
import { inviteDialogConf } from './invite/invite.dialog';
import './management.component.scss';


const includes = (xs: Array<any>, x: any) : boolean => xs.indexOf(x) !== -1;

const difference = (xs: Array<any>, ys: Array<any>) : Array<any> => xs.filter((x) => ys.indexOf(x) === -1);

const isClubBill = (clubId: number) => (bill: IBillingTariff) : boolean => bill && bill.clubProfile && bill.clubProfile.groupId === clubId;
    
const getClubId = (management: IGroupManagementProfile) : number => management.groupId;
    
const getMember = (management: IGroupManagementProfile, id: number) : IGroupManagementProfileMember => management.members
    .find((m) => m.userProfile.userId === id);

const getAthletesByCoachId = (management: IGroupManagementProfile) => (userId: number) => management.members
    .filter((member) => includes(getMemberCoaches(member), userId))
    .map(getMemberId);

const getTariffsByClub = (clubId: number) => (member: IGroupManagementProfileMember) : Array<string> => member.userProfile.billing
    .filter(isClubBill(clubId))
    .map((bill) => bill.tariffCode);

const getTariffsNotByClub = (clubId: number) => (member: IGroupManagementProfileMember) : Array<string> => member.userProfile.billing
    .filter(not(isClubBill(clubId)))
    .map((bill) => bill.tariffCode);

const getRows = (management: IGroupManagementProfile, filterParams: MembersFilterParams, order: string) : Array<IGroupManagementProfileMember> => {
    let rows = management.members.filter(filtersToPredicate(membersFilters, filterParams));

    if (order.startsWith('-')) {
        return (orderBy(membersOrderings[order.slice(1)]) (rows)).reverse();
    } else {
        return orderBy(membersOrderings[order]) (rows);
    }
};

class ManagementCtrl {

    static $inject = ['$scope','$mdDialog','$translate','GroupService','dialogs','$mdMedia','$mdBottomSheet','SystemMessageService'];

    public clubRoles = ['ClubCoaches', 'ClubAthletes', 'ClubManagement'];

    public management: IGroupManagementProfile;

    public filterParams: MembersFilterParams = {
        clubRole: null,
        coachUserId: null,
        noCoach: false,
        search: '',
    };

    public orderBy: string = 'username';

    public checked: Array<IGroupManagementProfileMember> = [];

    public rowsSelector = memorize(getRows);

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

    }

    isMobileLayout () : boolean {
        return this.$mdMedia('max-width: 959px');
    }
    
    update () {
        this.GroupService.getManagementProfile(getClubId(this.management), 'club')
        .then((management) => { 
            this.management = management;
            this.checked = [];
            this.$scope.$apply();
        }, (error) => { 
            this.SystemMessageService.show(error);
        });
    }

    getMember (id: number) : IGroupManagementProfileMember {
        return getMember(this.management, id);
    }

    getRows () : Array<IGroupManagementProfileMember> {
        return this.rowsSelector(this.management, this.filterParams, this.orderBy);
    }

    getChecked () : Array<IGroupManagementProfileMember> {
        return this.getRows().filter((member) => includes(this.checked, member));
    }

    getCoaches () : Array<IGroupManagementProfileMember> {
        return getClubCoaches(this.management);
    }
    
    isEditTariffsAvailable () : boolean {
        let checkedRows = this.getChecked();
        return allEqual(checkedRows.map(getTariffsByClub(getClubId(this.management))), angular.equals) 
            && allEqual(checkedRows.map(getTariffsNotByClub(getClubId(this.management))), angular.equals);
    }
    
    isEditCoachesAvailable () : boolean {
        let checkedRows = this.getChecked();
        return allEqual(checkedRows.map(getMemberCoaches), angular.equals)
            && checkedRows.every(hasClubRole('ClubAthletes'));
    }
    
    isEditAthletesAvailable () : boolean {
        let checkedRows = this.getChecked();
        return allEqual(checkedRows.map(getMemberId).map(getAthletesByCoachId(this.management)), angular.equals)
            && checkedRows.every(hasClubRole('ClubCoaches'));
    }
    
    isEditRolesAvailable () : boolean {
        return allEqual(this.getChecked().map(getMemberRoles), angular.equals);
    }
    
    editTariffs () {
        let tariffs = ['Coach', 'Premium'];
        let checked = this.getChecked();
        let byClub = getTariffsByClub(getClubId(this.management)) (checked[0]);
        let bySelf = getTariffsNotByClub(getClubId(this.management)) (checked[0]);

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
                return this.GroupService.putGroupMembershipBulk(getClubId(this.management), memberships, members);
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
        let checkedCoaches = getMemberCoaches(checked[0]);
        this.dialogs.selectUsers(this.getCoaches(), checkedCoaches, 'coaches')
        .then((nextCheckedCoaches) => {
            if (checkedCoaches) {
                let members = this.checked.map(getMemberId);
                let memberships = [
                    ...difference(nextCheckedCoaches, checkedCoaches).map(getClubAthletesGroupId).map(addToGroup),
                    ...difference(checkedCoaches, nextCheckedCoaches).map(getClubAthletesGroupId).map(removeFromGroup),
                ];
                return this.GroupService.putGroupMembershipBulk(getClubId(this.management), memberships, members);
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
        let checkedAthletes = getAthletesByCoachId(this.management) (getMemberId(checked[0]));
        let athletes = this.management.members.filter(hasClubRole('ClubAthletes'));

        this.dialogs.selectUsers(athletes, checkedAthletes, 'athletes')
        .then((athletes) => {
            if (athletes) {
                let groupIds = checked.map(getClubAthletesGroupId);
                // нельзя выполнить все действия одним батч-запросом, но можно двумя
                return Promise.all([
                    this.GroupService.putGroupMembershipBulk(getClubId(this.management), groupIds.map(addToGroup), difference(athletes, checkedAthletes)),
                    this.GroupService.putGroupMembershipBulk(getClubId(this.management), groupIds.map(removeFromGroup), difference(checkedAthletes, athletes))
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
        let checked = this.getChecked();
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
                return this.GroupService.putGroupMembershipBulk(getClubId(this.management), memberships, members);
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
        .then(() => this.checked.map((m) => this.GroupService.leave(getClubId(this.management), getMemberId(m))))
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
            scope: this.$scope,
            preserveScope: true
        });
    }

    invite ($event) {
        this.$mdDialog.show(inviteDialogConf(getClubId(this.management), $event));
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
            coachUserId: getMemberId(coach),
        };
    }

    isFilterCoach (coachUserId: number) {
        return this.filterParams.coachUserId === coachUserId;
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
        return 'Все';
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
