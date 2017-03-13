import './club.component.scss';

class ClubCtrl {

    constructor ($scope, dialogs, GroupService, UserService, RequestsService, message) {
        this.$scope = Object.assign($scope, { Boolean });
        this.dialogs = dialogs;
        this.GroupService = GroupService;
        this.UserService = UserService;
        this.RequestsService = RequestsService;
        this.message = message;

        let user = UserService.profile;
        this.isManager = this.club.innerGroups.ClubManagement.groupMembers.find(m => m.userId === user.userId);

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
        return this.dialogs.confirm('startClub')
            .then((confirmed) => confirmed && this.GroupService.join(this.club.groupId, this.UserService.profile.userId)
                .then(result => {
                    this.message.toastInfo('requestComplete');
                    this.update();
                }, error => this.message.toastError(error)));
            //.then((result) => { result && this.update() }, (error) => { this.SystemMessageService.show(error) })
    }
    
    leave () {
        return this.dialogs.confirm('leaveClub')
            .then((confirmed) => confirmed && this.GroupService.leave(this.club.groupId, this.UserService.profile.userId)
                .then(result => {
                    this.message.toastInfo('requestComplete');
                    this.update();
                }, error => this.message.toastError(error)));
    }
    
    cancel () {
        return this.dialogs.confirm('rejectRequest')
            .then((confirmed) => confirmed && this.GroupService.processMembership('C',this.club.groupId)
                .then(result => {
                    this.message.toastInfo('requestComplete');
                    this.update();
                }, error => this.message.toastError(error)));
    }

    showMembers () {
        this.dialogs.usersList(this.club, 'members')
    }

    showCoaches () {
        this.dialogs.usersList(this.club.innerGroups.ClubCoaches, 'coaches')
    }

    showAthletes () {
        this.dialogs.usersList(this.club.innerGroups.ClubAthletes, 'athletes')
    }
    
    openMenu ($mdOpenMenu, event) {
        $mdOpenMenu(event)
    }

};
ClubCtrl.$inject = ['$scope','dialogs','GroupService','UserService','RequestsService','message'];

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
