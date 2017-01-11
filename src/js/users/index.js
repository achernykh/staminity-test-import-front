import { flatMap, unique, keys } from '../util/util'

const coaches = ['Задорожный Андрей', 'Хабаров Евгений'];

function equals (x0, x1) {
    return x0 === x1;
}

function allEqual (xs, p = equals) {
    return !xs.length || !xs.find((x) => !equals(x, xs[0]));
}


class UsersCtrl {

    constructor ($scope, $mdDialog, GroupService, dialogs, $mdMedia, $mdBottomSheet) {
        'ngInject';
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.$mdBottomSheet = $mdBottomSheet;
        this.GroupService = GroupService;
        this.dialogs = dialogs;
        this.isScreenSmall = $mdMedia('max-width: 959px');
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
        return allEqual(this.checked.map((user) => user.subscription))
    }
    
    subscriptions () {
        this.$mdDialog.show({
            controller: SubscriptionsController,
            locals: { users: this.checked },
            templateUrl: 'users/subscriptions.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
    }
    
    get coachesAvailable () {
        return allEqual(this.checked.map((user) => user.coach))
    }
    
    coaches () {
        this.$mdDialog.show({
            controller: CoachesController,
            locals: { users: this.checked },
            templateUrl: 'users/coaches.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
    }
    
    get rolesAvailable() {
        return allEqual(this.checked.map((user) => user.role))
    }
    
    roles () {
        let checked = this.checked
        let checkedRoles = checked[0].roleMembership || []
        let roles = keys(this.management.availableGroups)
            .map((role) => ({
                role: role,
                checked: checkedRoles.includes(role)
            }))
        console.log('roles', checkedRoles, roles)
        this.$mdDialog.show({
            controller: RolesController,
            locals: { roles: roles },
            templateUrl: 'users/roles.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true
        })
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
        .then(() => this.update())
    }
    
    remove () {
        this.dialogs.confirm('Удалить пользователей?')
        .then((confirmed) => { if (!confirmed) throw new Error() })
        .then(() => Promise.all(this.checked.map((m) => this.GroupService.leave(this.club.groupId, m.userProfile.userId))))
        .then(() => { this.update() })
    }
    
    filters (key, value) {
      
    }
    
    showActions (member) {
        this.management.members.forEach((m) => { m.checked = m === member })
        
        this.$mdBottomSheet.show({
            templateUrl: 'users/member-actions.html',
            scope: this.$scope
        })
    }
};


function RolesController ($scope, roles, $mdDialog) {
    'ngInject';
    
    $scope.roles = roles;
    
    $scope.commit = () => {
        $mdDialog.hide($scope.roles);
    };
    
    $scope.cancel = () => {
        $mdDialog.hide();
    };
}


function SubscriptionsController ($scope, users, $mdDialog) {
    'ngInject';
    
    $scope.commit = () => {
        $mdDialog.hide($scope.subscriptions);
    };
    
    $scope.cancel = () => {
        $mdDialog.hide();
    };
}


function CoachesController ($scope, users, $mdDialog) {
    'ngInject';
    
    $scope.coaches = coaches.map((coach) => ({ 
        name: coach, 
        checked: users[0].coach.includes(coach) 
    }));
    
    $scope.commit = () => {
        $mdDialog.hide($scope.coaches);
    };
    
    $scope.cancel = () => {
        $mdDialog.hide();
    };
}


const users = {

    bindings: {
        view: '<',
        club: '<',
        management: '<'
    },

    require: {
        app: '^staminityApplication'
    },

    controller: UsersCtrl,

    templateUrl: 'users/users.html',

};


angular.module('staminity.users', ['ngMaterial', 'staminity.components'])
    .component('users', users);
