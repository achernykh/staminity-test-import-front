import { flatMap, unique, keys } from '../share/util.js';
import './athletes.component.scss';

function equals (x0, x1) {
    return x0 === x1;
}

function allEqual (xs, p = equals) {
    return !xs.length || xs.every((x) => p(x, xs[0]));
}


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
        this.sortingHotfix();

        this.checked = [];
    }

    sortingHotfix () {
        this.management.members = this.management.members || [];

        this.management.members.forEach((member) => {
            member.sort = keys(this.orderings).reduce((r, key) => (r[key] = this.orderings[key] (member), r), {})
        });
    }
    
    update () {
        return this.GroupService.getManagementProfile(this.user.connections.Athletes.groupId, 'coach')
            .then((management) => { this.management = management }, (error) => { this.SystemMessageService.show(error) })
            .then(() => { this.checked = [] })
            .then(() => { this.sortingHotfix() })
            .then(() => { this.$scope.$apply() })
    }

    // tariffs & billing 
    
    isOurBill (bill) {
        return bill.userProfilePayer && bill.userProfilePayer.userId == this.user.userId;
    }
    
    isBilledByUs (member, tariffCode) {
        return !!member.userProfile.billing.find(b => b.tariffCode == tariffCode && this.isOurBill(b));
    }
    
    isBilledBySelf (member, tariffCode) {
        return !!member.userProfile.billing.find(b => b.tariffCode == tariffCode && !this.isOurBill(b));
    }

    tariffs (member) {
        return ['Premium'].map(tariffCode => ({
            tariffCode,
            byUs: this.isBilledByUs(member, tariffCode),
            bySelf: this.isBilledBySelf(member, tariffCode)
        }));
    }
    
    get tariffsAvailable () {
        return allEqual(this.checked.map(m => this.tariffs(m)), angular.equals)
    }
    
    editTariffs () {
        let checked = this.checked
        let tariffs = this.tariffs(checked[0])

        this.dialogs.tariffs(tariffs, 'byCoach')
        .then(tariffs => {
            if (tariffs) {
                let members = checked.map(member => member.userProfile.userId);
                let memberships = tariffs
                    .filter(t => t.byUs != this.isBilledByUs(checked[0], t.tariffCode))
                    .map(t => ({
                        groupId: this.management.tariffGroups[t.tariffCode + 'ByCoach'],
                        direction: t.byUs? 'I' : 'O'
                    }));
                return this.GroupService.putGroupMembershipBulk(this.user.connections.Athletes.groupId, memberships, members);
            }
        }, () => {})
        .then((result) => { result && this.update() }, (error) => { this.SystemMessageService.show(error); this.update(); })
    }

    // removing & other actions
    
    remove () {
        this.dialogs.confirm('Удалить пользователей?')
        .then((confirmed) => confirmed && Promise.all(this.checked.map((m) => this.GroupService.leave(this.user.connections.Athletes.groupId, m.userProfile.userId))), () => {})
        .then(() => { this.update() }, (error) => { this.SystemMessageService.show(error) })
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

