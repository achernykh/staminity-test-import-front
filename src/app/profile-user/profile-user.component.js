//import { IComponentOptions, IComponentController} from 'angular';
import moment from 'moment/src/moment.js';
import { id, pipe, groupBy, log, map, entries, fold, filter } from '../share/util.js';
import './profile-user.component.scss';
import { saveUtmParams } from "../share/location/utm.functions";
import { ITrainingPlanSearchRequest } from "../../../api/trainingPlans/training-plans.interface";
import {gtmRequest} from "../share/google/google-analitics.functions";


class ProfileCtrl {

    //private authorSearch;//: ITrainingPlanSearchRequest;

    constructor ($scope, $mdDialog, dialogs, SessionService, UserService, GroupService, SystemMessageService,
                 RequestsService, $location, TrainingPlansService) {
        'ngInject';
        this.$scope = Object.assign($scope, { Boolean });
        this.$mdDialog = $mdDialog;
        this.dialogs = dialogs;
        this.SessionService = SessionService;
        this.UserService = UserService;
        this.GroupService = GroupService;
        this.message = SystemMessageService;
        this.RequestsService = RequestsService;
        this.trainingPlansService = TrainingPlansService;
        saveUtmParams($location.search());
    }

    $onInit() {
        this.me = this.auth && this.SessionService.getUser();
        this.isMe = this.auth && this.user.userId === this.me.userId;

        this.subscription = this.RequestsService.requestWithUser(this.user.userId)
        .subscribe(() => { this.update() });

        this.authorSearch = {
            ownerId: this.me.userId,
            purchased: false
        };
    }

    checkPlanData (list, length) {
        if (length) {this.hasPlans = true;}
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
            .then((result) => {
                    gtmRequest('join', 'coach');
                    result && this.update();
                }, (error) => { error && this.message.show(error) })
    }

    leave (group, message) {
        return this.dialogs.confirm({ text: message })
            .then(() => this.GroupService.leave(group.groupId, this.me.userId))
            .then((result) => {
                    gtmRequest('leave', 'coach');
                    result && this.update()
                }, (error) => { error && this.message.show(error) })
    }

    cancel (group, message) {
        return this.dialogs.confirm({ text: message })
            .then(() => this.GroupService.processMembership('C', group.groupId))
            .then((result) => {
                    gtmRequest('cancel', 'coach');
                    result && this.update()
                }, (error) => { error && this.message.show(error) })
    }

    openMenu ($mdOpenMenu, event) {
        $mdOpenMenu(event)
    }
};

ProfileCtrl.$inject = ['$scope','$mdDialog','dialogs','SessionService','UserService','GroupService',
    'SystemMessageService','RequestsService','$location','TrainingPlansService'];

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