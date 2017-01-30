import { flatMap, unique, keys } from '../share/util.js';
import './athletes.component.scss';

function equals (x0, x1) {
    return x0 === x1;
}

function allEqual (xs, p = equals) {
    return !xs.length || xs.every((x) => p(x, xs[0]));
}

function tariffs (member) {
    return {
        byUs: {
            Coach: member.userProfile.billing.find((t) => t.tariffCode == 'Coach' && t.payerUserProfile),
            Premium: member.userProfile.billing.find((t) => t.tariffCode == 'Coach' && t.payerUserProfile)
        },
        bySelf: {
            Coach: member.userProfile.billing.find((t) => t.tariffCode == 'Premium' && !t.payerUserProfile),
            Premium: member.userProfile.billing.find((t) => t.tariffCode == 'Premium' && !t.payerUserProfile)
        }
    }
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
            username: (user) => `${user.public.firstName} ${user.public.lastName}`,
            club: (user) => (user.connections.Clubs[0] && user.connections.Clubs[0].public.name) || '-',
            tariff: (user) => user.billing && user.billing.map(t => t.tariffCode).join(', '),
            city: (user) => user.public.city,
            ageGroup: (user) => user.public.sex
        };
        this.orderBy = 'username';
    }

    sortingHotfix () {
        this.management.members.forEach((member) => {
            member.sort = keys(this.orderings).reduce((r, key) => (r[key] = this.orderings[key] (member), r), {})
        });
    }
    
    update () {
        return this.GroupService.getManagementProfile(this.user.connections.Athletes.groupId, 'coach')
            .then((management) => { this.management = management }, (error) => { this.SystemMessageService.show(error) })
            .then(() => { this.sortingHotfix() })
            .then(() => { this.$scope.$apply() })
    }
    
    get checked () {
        return this.management.members.filter((member) => member.checked);
    }
    
    set allChecked (value) {
        if (this.allChecked) {
            this.management.members.forEach((member) => { member.checked = false; });
        } else {
            this.management.members.forEach((member) => { member.checked = true; });
        }
    }
    
    get allChecked () {
        return this.management.members.every((member) => member.checked);
    }
    
    get subscriptionsAvailable () {
        return allEqual(this.checked.map(tariffs), angular.equals)
    }
    
    subscriptions () {
        let checked = this.checked
        let oldTariffs = tariffs(checked[0])

        this.dialogs.subscriptions(oldTariffs)
        .then((newTariffs) => {
            if (newTariffs) {
                let members = checked.map(member => member.userProfile.userId);
                let memberships = [{
                    groupId: this.management.availableGroups.CoachByGroup,
                    direction: newTariffs.byUs.Coach? 'I' : 'O'
                }, {
                    groupId: this.management.availableGroups.PremiumByGroup,
                    direction: newTariffs.byUs.Premium? 'I' : 'O'
                }];
                coaches.map(coach => ({
                    groupId: coach.ClubAthletesGroupId,
                    direction: coach.checked? 'I' : 'O'
                }));
                return this.GroupService.putGroupMembershipBulk(this.user.connections.Athletes.groupId, memberships, members);
            }
        })
        .then(() => this.update(), (error) => { this.SystemMessageService.show(error); this.update(); })
    }
    
    remove () {
        this.dialogs.confirm('Удалить пользователей?')
        .then((confirmed) => { if (!confirmed) throw new Error() })
        .then(() => Promise.all(this.checked.map((m) => this.GroupService.leave(this.user.connections.Athletes.groupId, m.userProfile.userId))))
        .then(() => { this.update() }, (error) => { this.SystemMessageService.show(error) })
    }
    
    showActions (member) {
        this.management.members.forEach((m) => { m.checked = m === member })
        
        this.$mdBottomSheet.show({
            template: require('./member-actions.html'),
            scope: this.$scope
        })
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

