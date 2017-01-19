import { flatMap, unique, keys } from '../util/util'

function equals (x0, x1) {
    return x0 === x1;
}

function allEqual (xs, p = equals) {
    return !xs.length || xs.every((x) => !(x, xs[0]));
}


const orderings = {
    username: (member) => `${member.userProfile.public.firstName} ${member.userProfile.public.lastName}`,
    tariff: (member) => member.tariffs && member.tariffs.map(t => t.tariffCode).join(', '),
    city: (member) => member.userProfile.public.city,
    ageGroup: (member) => member.userProfile.public.sex,
    roles: (member) => member.roleMembership.join(' '),
    coaches: (member) => member.coaches.map(c => c.userId).join(' '),
    athletes: (member) => member.athletes.map(a => a.public.userId).join(' '),
}


class ManagementCtrl {

    constructor ($scope, $mdDialog, GroupService, dialogs, $mdMedia, $mdBottomSheet) {
        'ngInject';
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.$mdBottomSheet = $mdBottomSheet;
        this.GroupService = GroupService;
        this.dialogs = dialogs;
        this.isScreenSmall = $mdMedia('max-width: 959px');
        this.filter = null;
        this.order = {
            by: 'username',
            reverse: false
        }
    }
    
    member (id) {
        return this.management.members.find(m => m.userProfile.userId === id)
    }
    
    update () {
        return this.GroupService.getManagementProfile(this.club.groupId)
            .then((management) => { this.management = management })
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
        return allEqual(this.checked.map((user) => user.tariffs), angular.equals)
    }
    
    subscriptions () {
        this.dialogs.subscriptions(this.checked)
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
        
        this.dialogs.coaches(checked, coaches) 
        .then((coaches) => {
            if (coaches) {
                let requests = flatMap(member => coaches.map(coach => {
                    if (coach.checked && !checkedCoaches.find(c => c.userId == coach.userProfile.userId)) {
                        return this.GroupService.join(coach.ClubAthletesGroupId, member.userProfile.userId)
                    } else if (!coach.checked && checkedCoaches.find(c => c.userId == coach.userProfile.userId)) {
                        return this.GroupService.leave(coach.ClubAthletesGroupId, member.userProfile.userId)
                    }
                })) (checked)
                return Promise.all(requests)
            } else {
                throw new Error()
            }
        })
        .then(() => this.update(), () => this.update())
    }
    
    get rolesAvailable() {
        return allEqual(this.checked.map((user) => user.roles), angular.equals)
    }
    
    roles () {
        let checked = this.checked
        let checkedRoles = checked[0].roleMembership || []
        let roles = keys(this.management.availableGroups)
            .map((role) => ({
                role: role,
                checked: checkedRoles.includes(role)
            }))

        this.dialogs.roles(roles)
        .then((roles) => {
            if (roles) {
                let requests = flatMap(member => roles.map(role => {
                    if (role.checked && !checkedRoles.includes(role.role)) {
                        return this.GroupService.join(this.management.availableGroups[role.role], member.userProfile.userId)
                    } else if (!role.checked && checkedRoles.includes(role.role)) {
                        return this.GroupService.leave(this.management.availableGroups[role.role], member.userProfile.userId)
                    }
                })) (checked)
                return Promise.all(requests)
            } else {
                throw new Error()
            }
        })
        .then(() => this.update(), () => this.update())
    }
    
    remove () {
        this.dialogs.confirm('Удалить пользователей?')
        .then((confirmed) => { if (!confirmed) throw new Error() })
        .then(() => Promise.all(this.checked.map((m) => this.GroupService.leave(this.club.groupId, m.userProfile.userId))))
        .then(() => { this.update() })
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
    
    orderBy () {
        return orderings[this.order.by]
    }
    
    setOrder (by) {
        if (this.order.by == by) {
            this.order.reverse = !this.order.reverse
        } else {
            this.order.by = by
            this.order.reverse = false
        }
    }
};


const management = {

    bindings: {
        view: '<',
        club: '<',
        management: '<'
    },

    require: {
        app: '^staminityApplication'
    },

    controller: ManagementCtrl,

    templateUrl: 'management/management.html',

};


angular.module('staminity.management', ['ngMaterial', 'staminity.components'])
    .component('management', management);
