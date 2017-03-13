//import { IComponentOptions, IComponentController} from 'angular';
import moment from 'moment/src/moment.js';
import { id, pipe, groupBy, log, map, entries, fold, filter } from '../share/util.js';
import './profile-user.component.scss';


class ProfileCtrl {

    constructor ($scope, $mdDialog, dialogs, UserService, GroupService, SystemMessageService, RequestsService) {
        'ngInject';
        this.$scope = Object.assign($scope, { Boolean });
        this.$mdDialog = $mdDialog;
        this.dialogs = dialogs;
        this.UserService = UserService;
        this.GroupService = GroupService;
        this.message = SystemMessageService;
        this.RequestsService = RequestsService;

        this.me = UserService.profile;
        this.isMe = this.user.userId === this.me.userId;

        this.subscription = this.RequestsService.requestWithUser(this.user.userId)
        .subscribe(() => { this.update() });
    }

    $onDestroy () {
        this.subscription && this.subscription.unsubscribe();
    }

    update () {
        return this.UserService.getProfile(this.user.userId)
            .then((user) => { this.user = user })
            .then(() => { this.$scope.$apply() })
    }

    coaches () {
        this.dialogs.usersList(this.user.connections.Coaches, 'coaches')
    }

    athletes () {
        this.dialogs.usersList(this.user.connections.Athletes, 'athletes')
    }

    friends () {
        this.dialogs.usersList(this.user.connections.Friends, 'friends')
    }

    subscriptions () {
        this.dialogs.usersList(this.user.connections.Following, 'following')
    }

    subscribers () {
        this.dialogs.usersList(this.user.connections.Followers, 'followers')
    }

    join (group, message) {
        return this.dialogs.confirm(message)
            .then((confirmed) => confirmed && this.GroupService.join(group.groupId, this.me.userId), () => {})
            .then((result) => { result && this.update() }, error => this.message.show(error))
    }

    leave (group, message) {
        return this.dialogs.confirm(message)
            .then((confirmed) => confirmed && this.GroupService.leave(group.groupId, this.me.userId), () => {})
            .then((result) => { result && this.update() }, error => this.message.show(error))
    }

    cancel (group, message) {
        return this.dialogs.confirm(message)
            .then((confirmed) => confirmed && this.GroupService.processMembership('C', group.groupId), () => {})
            .then((result) => { result && this.update() }, error => this.message.show(error))
    }

    openMenu ($mdOpenMenu, event) {
        $mdOpenMenu(event)
    }
};

ProfileCtrl.$inject = ['$scope','$mdDialog','dialogs','UserService','GroupService','SystemMessageService','RequestsService'];

const ProfileComponent = {
    bindings: {
        view: '<',
        user: '<'
    },
    controller: ProfileCtrl,
    template: require('./profile-user.component.html')
};

export default ProfileComponent;