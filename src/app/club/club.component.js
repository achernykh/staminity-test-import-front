import './club.component.scss';

class ClubCtrl {

    constructor ($scope, dialogs, GroupService, UserService, SystemMessageService) {
        this.$scope = $scope;
        this.dialogs = dialogs;
        this.GroupService = GroupService;
        this.UserService = UserService;
        this.SystemMessageService = SystemMessageService;
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
    
    openMenu ($mdOpenMenu, event) {
        $mdOpenMenu(event)
    }

};
ClubCtrl.$inject = ['$scope','dialogs','GroupService','UserService','SystemMessageService'];

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
