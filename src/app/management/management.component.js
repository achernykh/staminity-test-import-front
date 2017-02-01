import { flatMap, unique, keys, entries } from '../share/util.js';
import './management.component.scss';

function equals (x0, x1) {
    return x0 === x1;
}

function allEqual (xs, p = equals) {
    return !xs.length || xs.every((x) => p(x, xs[0]));
}


class ManagementCtrl {

    constructor ($scope, $mdDialog, GroupService, dialogs, $mdMedia, $mdBottomSheet, SystemMessageService) {
        'ngInject';
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.$mdBottomSheet = $mdBottomSheet;
        this.GroupService = GroupService;
        this.dialogs = dialogs;
        this.SystemMessageService = SystemMessageService;
        this.isScreenSmall = $mdMedia('max-width: 959px');
        this.filter = null;

        this.orderings = {
            username: (member) => `${member.userProfile.public.firstName} ${member.userProfile.public.lastName}`,
            tariff: (member) => member.billing && member.billing.map(t => t.tariffCode).join(', '),
            city: (member) => member.userProfile.public.city,
            ageGroup: (member) => member.userProfile.public.sex,
            roles: (member) => member.roleMembership.join(' '),
            coaches: (member) => member.coaches.map(c => c.userId).join(' '),
            athletes: (member) => this.athletes(member).map(a => a.userProfile.userId).join(' '),
        };
        this.orderBy = 'sort.username';

        this.sortingHotfix();
    }
    
    member (id) {
        return this.management.members.find(m => m.userProfile.userId === id)
    }

    athletes (member) {
        return this.management.members.filter((m) => m.coaches.includes(member.userProfile.userId));
    }

    tariffs (member) {
        return {
            byUs: {
                Coach: member.userProfile.billing.find((t) => t.tariffCode == 'Coach' && t.clubProfile.groupId == this.club.groupId),
                Premium: member.userProfile.billing.find((t) => t.tariffCode == 'Premium' && t.clubProfile == this.club.groupId)
            },
            bySelf: {
                Coach: member.userProfile.billing.find((t) => t.tariffCode == 'Coach' && !t.clubProfile == this.club.groupId),
                Premium: member.userProfile.billing.find((t) => t.tariffCode == 'Premium' && !t.clubProfile == this.club.groupId)
            }
        }
    }

    sortingHotfix () {
        this.management.members.forEach((member) => {
            member.sort = keys(this.orderings).reduce((r, key) => (r[key] = this.orderings[key] (member), r), {})
        });
    }
    
    update () {
        return this.GroupService.getManagementProfile(this.club.groupId,'club')
            .then((management) => { this.management = management }, (error) => { this.SystemMessageService.show(error) })
            .then(() => { this.sortingHotfix() })
            .then(() => { this.$scope.$apply() })
    }
    
    get checked () {
        return this.management.members.filter((user) => user.checked);
    }
    
    set allChecked (value) {
        if (this.allChecked) {
            this.management.members.forEach((user) => { user.checked = false; });
        } else {
            this.management.members.forEach((user) => { user.checked = true; });
        }
    }
    
    get allChecked () {
        return this.management.members.every((user) => user.checked);
    }
    
    get subscriptionsAvailable () {
        return allEqual(this.checked.map(m => this.tariffs(m)), angular.equals)
    }
    
    subscriptions () {
        let checked = this.checked
        let oldTariffs = this.tariffs(checked[0])

        this.dialogs.subscriptions(oldTariffs, 'byClub')
        .then((newTariffs) => {
            if (newTariffs) {
                let members = checked.map(member => member.userProfile.userId);
                let memberships = [{
                    groupId: this.management.tariffGroups.CoachByClub,
                    direction: newTariffs.byUs.Coach? 'I' : 'O'
                }, {
                    groupId: this.management.tariffGroups.PremiumByClub,
                    direction: newTariffs.byUs.Premium? 'I' : 'O'
                }];
                return this.GroupService.putGroupMembershipBulk(this.club.groupId, memberships, members);
            }
        })
        .then(() => this.update(), (error) => { this.SystemMessageService.show(error); this.update(); })
    }
    
    get coaches () {
        return this.management.members.filter(m => (m.roleMembership || []).includes('ClubCoaches'))
    }
    
    get coachesAvailable () {
        return allEqual(this.checked.map((user) => user.coaches), angular.equals)
    }
    
    showCoaches () {
        let checked = this.checked
        let checkedCoaches = checked[0].coaches || []
        let coaches = this.coaches
            .map((coach) => ({
                userProfile: coach.userProfile,
                ClubAthletesGroupId: coach.ClubAthletesGroupId,
                checked: checkedCoaches.includes(coach.userProfile.userId)
            }))

        this.dialogs.coaches(coaches) 
        .then((coaches) => {
            if (coaches) {
                let members = checked.map(member => member.userProfile.userId);
                let memberships = coaches.map(coach => ({
                    groupId: coach.ClubAthletesGroupId,
                    direction: coach.checked? 'I' : 'O'
                }));
                return this.GroupService.putGroupMembershipBulk(this.club.groupId, memberships, members);
            } 
        })
        .then(() => this.update(), (error) => { this.SystemMessageService.show(error); this.update(); })
    }
    
    get rolesAvailable() {
        return allEqual(this.checked.map((user) => user.roleMembership), angular.equals)
    }
    
    roles () {
        let checked = this.checked
        let checkedRoles = checked[0].roleMembership || []
        let roles = ['ClubAthletes', 'ClubCoaches', 'ClubManagement']
            .map((role) => ({
                role: role,
                checked: checkedRoles.includes(role)
            }))

        this.dialogs.roles(roles)
        .then((roles) => {
            if (roles) {
                let members = checked.map(member => member.userProfile.userId);
                let memberships = roles.map(role => ({
                    groupId: this.management.availableGroups[role.role],
                    direction: role.checked? 'I' : 'O'
                }));
                return this.GroupService.putGroupMembershipBulk(this.club.groupId, memberships, members);
            } 
        })
        .then(() => this.update(), (error) => { this.SystemMessageService.show(error); this.update(); })
    }
    
    remove () {
        this.dialogs.confirm('Удалить пользователей?')
        .then((confirmed) => { if (!confirmed) throw new Error() })
        .then(() => Promise.all(this.checked.map((m) => this.GroupService.leave(this.club.groupId, m.userProfile.userId))))
        .then(() => { this.update() }, (error) => { this.SystemMessageService.show(error) })
    }
    
    showActions (member) {
        this.management.members.forEach((m) => { m.checked = m === member })
        
        this.$mdBottomSheet.show({
            templateUrl: 'users/member-actions.html',
            scope: this.$scope
        })
    }
    
    clearFilter () {
        this.filter = null
    }
    
    filterNoCoach () {
        this.filter = {
            type: 'no coach',
            label: 'Без тренера',
            pred: (member) => !member.coaches || !member.coaches.length
        }
    }
    
    filterCoach (coach) {
        this.filter = {
            type: 'coach',
            label: coach.userProfile.public.firstName + ' ' +  coach.userProfile.public.lastName,
            coach: coach,
            pred: (member) => member.coaches && member.coaches.find((c) => c.userId === coach.userProfile.userId)
        }
    }
    
    filterRole (role) {
        this.filter = {
            type: 'role',
            label: role,
            role: role,
            pred: (member) => member.roleMembership && member.roleMembership.find((r) => r === role)
        }
    }
    
    isVisible () {
        return (member) => !this.filter || this.filter.pred(member)
    }
};

ManagementCtrl.$inject = ['$scope','$mdDialog','GroupService','dialogs','$mdMedia','$mdBottomSheet','SystemMessageService'];


let ManagementComponent = {

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
