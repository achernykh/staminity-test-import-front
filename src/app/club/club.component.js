import './club.component.scss';
import { saveUtmParams } from "../share/location/utm.functions";
import {gtmRequest} from "../share/google/google-analitics.functions";

class ClubCtrl {

    constructor ($scope, dialogs, SessionService, GroupService, UserService, RequestsService, message, $location) {
        this.$scope = Object.assign($scope, { Boolean });
        this.dialogs = dialogs;
        this.SessionService = SessionService;
        this.GroupService = GroupService;
        this.UserService = UserService;
        this.RequestsService = RequestsService;
        this.message = message;
        saveUtmParams($location.search());
    }

    $onInit(){
        let user = this.SessionService.getUser();
        this.isManager = this.club.innerGroups.ClubManagement.groupMembers.find(m => m.userId === user.userId);
        this.isCoach = user.public.hasOwnProperty('isCoach') && user.public.isCoach;

        this.subscription = this.RequestsService.requestWithClub(this.club.groupId)
            .subscribe(() => { this.update() });
    }

    $onDestroy () {
        this.subscription && this.subscription.unsubscribe();
    }
    
    update () {
        return this.GroupService.getProfile(this.club.groupUri, 'club')
            .then((club) => { this.club = club }, (error) => { this.message.toastError(error) })
            .then(() => { this.$scope.$apply() })
    }
    
    join () {
        return this.dialogs.confirm({ text: 'dialogs.startClub' })
            .then(() => this.GroupService.join(this.club.groupId, this.SessionService.getCurrentUserId()))
            .then((result) => {
                gtmRequest('join', 'club');
                this.message.toastInfo('requestComplete');
                this.update();
            }, (error) => {
                error && this.message.toastError(error);
            });
    }
    
    leave () {
        return this.dialogs.confirm({ text: 'dialogs.leaveClub' })
            .then(() => this.GroupService.leave(this.club.groupId, this.SessionService.getCurrentUserId()))
            .then((result) => {
                gtmRequest('leave', 'club');
                this.message.toastInfo('requestComplete');
                this.update();
            }, (error) => {
                error && this.message.toastError(error);
            });
    }
    
    cancel () {
        return this.dialogs.confirm({ text: 'dialogs.rejectRequest' })
            .then(() => this.GroupService.processMembership('C',this.club.groupId))
            .then((result) => {
                gtmRequest('cancel', 'club');
                this.message.toastInfo('requestComplete');
                this.update();
            }, (error) => {
                error && this.message.toastError(error);
            });
    }

    showMembers () {
        this.dialogs.usersList(this.club.groupMembers, 'members')
    }

    showCoaches () {
        this.dialogs.usersList(this.club.innerGroups.ClubCoaches.groupMembers, 'coaches')
    }

    showAthletes () {
        this.dialogs.usersList(this.club.innerGroups.ClubAthletes.groupMembers, 'athletes')
    }
    
    openMenu ($mdOpenMenu, event) {
        $mdOpenMenu(event)
    }

};
ClubCtrl.$inject = ['$scope','dialogs','SessionService','GroupService','UserService','RequestsService',
    'message','$location'];

const ClubComponent = {

    bindings: {
        view: '<',
        club: '<',
        userId: '<'
    },
    require: {
        app: '^staminityApplication'
    },
    transclude: false,
    controller: ClubCtrl,
    template: require('./club.component.html')
};

export default ClubComponent;
