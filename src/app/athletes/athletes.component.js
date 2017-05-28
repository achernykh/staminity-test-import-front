import { flatMap, unique, keys, entries, pipe, object, allEqual } from '../share/util.js';
import './athletes.component.scss';


class AthletesCtrl {

    constructor ($scope, $mdDialog, GroupService, dialogs, $mdMedia, $mdBottomSheet, SystemMessageService) {
        'ngInject';
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.$mdBottomSheet = $mdBottomSheet;
        this.GroupService = GroupService;
        this.dialogs = dialogs;
        this.SystemMessageService = SystemMessageService;
        this.isScreenSmall = $mdMedia('max-width: 959px');
        
        this.orderings = {
            username: (member) => `${member.userProfile.public.firstName} ${member.userProfile.public.lastName}`,
            club: (member) => '-',
            tariff: (member) => member.billing && member.billing.map(t => t.tariffCode).join(', '),
            city: (member) => member.userProfile.public.city,
            ageGroup: (member) => member.userProfile.public.sex
        };
        this.orderBy = 'username';
        this.checked = [];
    }

    $onInit() {
        this.sortingHotfix();
    }

    sortingHotfix () {
        this.management.members = this.management.members || [];

        this.management.members.forEach((member) => {
            member.sort = keys(this.orderings).reduce((r, key) => (r[key] = this.orderings[key] (member), r), {})
        });
    }
    
    update () {
        return this.GroupService.getManagementProfile(this.user.connections.Athletes.groupId, 'coach')
            .then((management) => { 
                this.management = management;
                this.checked = [];
                this.sortingHotfix(); 
                this.$scope.$apply();
            }, (error) => { this.SystemMessageService.show(error) })
    }

    // tariffs & billing 
    
    isOurBill (bill) {
        return bill.userProfilePayer && bill.userProfilePayer.userId == this.user.userId;
    }
    
    tariffsByUs (member) {
        return member.userProfile.billing
            .filter(bill => this.isOurBill(bill))
            .map(bill => bill.tariffCode);
    }
    
    tariffsBySelf (member) {
        return member.userProfile.billing
            .filter(bill => !this.isOurBill(bill))
            .map(bill => bill.tariffCode);
    }
    
    get tariffsAvailable () {
        return allEqual(this.checked.map(m => this.tariffsByUs(m)), angular.equals)
            && allEqual(this.checked.map(m => this.tariffsBySelf(m)), angular.equals);
    }
    
    editTariffs () {
        let tariffs = ['Premium'];
        let checked = this.checked;
        let byUs = this.tariffsByUs(checked[0]);
        let bySelf = this.tariffsBySelf(checked[0]);

        this.dialogs.tariffs(tariffs, byUs, bySelf, 'byCoach')
        .then(selectedTariffs => {
            if (!selectedTariffs) return;
            
            let members = checked.map(member => member.userProfile.userId);
            
            let memberships = tariffs
                .filter(tariffCode => selectedTariffs.includes(tariffCode) != byUs.includes(tariffCode))
                .map(tariffCode => ({
                    groupId: this.management.tariffGroups[tariffCode + 'ByCoach'],
                    direction: selectedTariffs.includes(tariffCode)? 'I' : 'O'
                }));
                
            return this.GroupService.putGroupMembershipBulk(this.user.connections.Athletes.groupId, memberships, members);
        }, () => {})
        .then((result) => { result && this.update() }, (error) => { this.SystemMessageService.show(error); this.update(); })
    }

    // removing & other actions
    
    remove () {
        this.dialogs.confirm('turnOffAthletes')
        .then((confirmed) => confirmed && Promise.all(this.checked.map((m) => this.GroupService.leave(this.user.connections.Athletes.groupId, m.userProfile.userId))), () => {})
        .then((result) => { result && this.update() }, (error) => { this.SystemMessageService.show(error) })
    }
    
    showActions (member) {
        this.management.members.forEach((m) => { m.checked = m === member })
        
        this.$mdBottomSheet.show({
            template: require('./member-actions.html'),
            scope: this.$scope
        })
    }

    // helpers

    isPremium (member) {
        return member.userProfile.billing.find(tariff => tariff.tariffCode == 'Premium');
    }
};
AthletesCtrl.$inject = ['$scope','$mdDialog','GroupService','dialogs','$mdMedia','$mdBottomSheet','SystemMessageService']

const AthletesComponent = {

    bindings: {
        view: '<',
        user: '<',
        management: '<'
    },

    require: {
        app: '^staminityApplication'
    },

    controller: AthletesCtrl,

    template: require('./athletes.component.html'),

};

export default AthletesComponent;

