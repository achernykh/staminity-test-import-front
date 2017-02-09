import './club.component.scss';

class ClubCtrl {

    constructor ($scope, dialogs, GroupService, UserService, RequestsService, SystemMessageService) {
        this.$scope = Object.assign($scope, { Boolean });
        this.dialogs = dialogs;
        this.GroupService = GroupService;
        this.UserService = UserService;
        this.RequestsService = RequestsService;
        this.SystemMessageService = SystemMessageService;

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
            .then((club) => { this.club = club }, (error) => { this.SystemMessageService.show(error) })
            .then(() => { this.$scope.$apply() })
    }
    
    join () {
        return this.dialogs.confirm('Отправить заявку на вступление в клуб?')
            .then((confirmed) => confirmed && this.GroupService.join(this.club.groupId, this.UserService.profile.userId))
            .then((result) => { result && this.update() }, (error) => { this.SystemMessageService.show(error) })
    }
    
    leave () {
        return this.dialogs.confirm('Покинуть клуб?')
            .then((confirmed) => confirmed && this.GroupService.leave(this.club.groupId, this.UserService.profile.userId))
            .then((result) => { result && this.update() }, (error) => { this.SystemMessageService.show(error) })
    }
    
    cancel () {
        return this.dialogs.confirm('Отменить заявку?')
            .then((confirmed) => confirmed && this.GroupService.processMembership('C',this.club.groupId))
            .then((result) => { result && this.update() }, (error) => { this.SystemMessageService.show(error) })
    }

    showMembers () {
        this.dialogs.usersList(this.club, 'Участники')
    }

    showCoaches () {
        this.dialogs.usersList(this.club.innerGroups.ClubCoaches, 'Тренеры')
    }

    showAthletes () {
        this.dialogs.usersList(this.club.innerGroups.ClubAthletes, 'Спортсмены')
    }
    
    openMenu ($mdOpenMenu, event) {
        $mdOpenMenu(event)
    }

};
ClubCtrl.$inject = ['$scope','dialogs','GroupService','UserService','RequestsService','SystemMessageService'];

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
