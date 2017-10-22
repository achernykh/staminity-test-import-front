//import { IComponentOptions, IComponentController} from 'angular';
import moment from 'moment/src/moment.js';
import { id, pipe, groupBy, log, map, entries, fold, filter } from '../share/util.js';
import './profile-user.component.scss';


class ProfileCtrl {

    constructor ($scope, $mdDialog, dialogs, SessionService, UserService, GroupService, RequestsService) {
        'ngInject';
        this.$scope = Object.assign($scope, { Boolean });
        this.$mdDialog = $mdDialog;
        this.dialogs = dialogs;
        this.SessionService = SessionService;
        this.UserService = UserService;
        this.GroupService = GroupService;
        this.RequestsService = RequestsService;
    }

    $onInit() {
        this.me = this.auth && this.SessionService.getUser();
        this.isMe = this.auth && this.user.userId === this.me.userId;

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
        this.dialogs.usersList(this.user.connections.Coaches.groupMembers, 'coaches')
    }

    athletes () {
        this.dialogs.usersList(this.user.connections.allAthletes.groupMembers, 'athletes')
    }

    friends () {
        this.dialogs.usersList(this.user.connections.Friends.groupMembers, 'friends')
    }

    subscriptions () {
        this.dialogs.usersList(this.user.connections.Following.groupMembers, 'following')
    }

    subscribers () {
        this.dialogs.usersList(this.user.connections.Followers.groupMembers, 'followers')
    }

    join (group, message) {
        return this.dialogs.confirm({ text: message })
            .then(() => this.GroupService.join(group.groupId, this.me.userId))
            .then((result) => { result && this.update() }, (error) => { error && this.message.show(error) })
    }

    leave (group, message) {
        return this.dialogs.confirm({ text: message })
            .then(() => this.GroupService.leave(group.groupId, this.me.userId))
            .then((result) => { result && this.update() }, (error) => { error && this.message.show(error) })
    }

    cancel (group, message) {
        return this.dialogs.confirm({ text: message })
            .then(() => this.GroupService.processMembership('C', group.groupId))
            .then((result) => { result && this.update() }, (error) => { error && this.message.show(error) })
    }

    openMenu ($mdOpenMenu, event) {
        $mdOpenMenu(event)
    }
};

ProfileCtrl.$inject = ['$scope','$mdDialog','dialogs','SessionService','UserService','GroupService','RequestsService'];

const ProfileComponent = {
    bindings: {
        view: '<',
        user: '<',
        auth: '<'
    },
    controller: ProfileCtrl,
    template: require('./profile-user.component.html')
};

export default ProfileComponent;