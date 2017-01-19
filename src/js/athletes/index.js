import { flatMap, unique, keys } from '../util/util'

function equals (x0, x1) {
    return x0 === x1;
}

function allEqual (xs, p = equals) {
    return !xs.length || xs.every((x) => p(x, xs[0]));
}

const orderings = {
    username: (user) => `${user.public.firstName} ${user.public.lastName}`,
    club: (user) => (user.connections.Clubs[0] && user.connections.Clubs[0].public.name) || '-',
    tariff: (user) => user.tariffs && user.tariffs.map(t => t.tariffCode).join(', '),
    city: (user) => user.public.city,
    ageGroup: (user) => user.public.sex
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
        this.order = {
            by: 'username',
            reverse: false
        }
    }
    
    get athletes () {
        return this.user.connections.Athletes.groupMembers
    }
    
    update () {
        return this.UserService.getProfile(this.user.userId)
            .then((user) => { this.user = user })
            .then(() => { this.$scope.$apply() }, (error) => { this.SystemMessageService.show(error) })
    }
    
    get checked () {
        return this.athletes.filter((user) => user.checked);
    }
    
    set allChecked (value) {
        if (this.allChecked) {
            this.athletes.forEach((user) => { user.checked = false; });
        } else {
            this.athletes.forEach((user) => { user.checked = true; });
        }
    }
    
    get allChecked () {
        return this.athletes.every((user) => user.checked);
    }
    
    get subscriptionsAvailable () {
        return allEqual(this.checked.map((user) => user.tariffs), angular.equals)
    }
    
    subscriptions () {
        this.dialogs.subscriptions(this.checked)
    }
    
    remove () {
        this.dialogs.confirm('Удалить пользователей?')
        .then((confirmed) => { if (!confirmed) throw new Error() })
        .then(() => Promise.all(this.checked.map((m) => this.GroupService.leave(this.club.groupId, m.userProfile.userId))))
        .then(() => { this.update() }, (error) => { this.SystemMessageService.show(error) })
    }
    
    showActions (user) {
        this.athletes.forEach((a) => { a.checked = a === user })
        
        this.$mdBottomSheet.show({
            templateUrl: 'athletes/member-actions.html',
            scope: this.$scope
        })
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


const athletes = {

    bindings: {
        view: '<',
        user: '<'
    },

    require: {
        app: '^staminityApplication'
    },

    controller: AthletesCtrl,

    templateUrl: 'athletes/athletes.html',

};


angular.module('staminity.athletes', ['ngMaterial', 'staminity.components'])
    .component('athletes', athletes);
