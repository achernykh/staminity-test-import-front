import './club.component.scss';

class ClubCtrl {

  constructor ($scope, dialogs, GroupService, UserService, SystemMessageService) {
    this.$scope = $scope;
    this.dialogs = dialogs;
    this.GroupService = GroupService;
    this.UserService = UserService;
    this.SystemMessageService = SystemMessageService;
    console.log($scope);
  }

  getUserpic () {
    return `url('${this.app.user && this.app.user.public.avatar? this.API.apiUrl('/content/avatar/' + this.app.user.public.avatar) : '/assets/avatar/default.png'}')`
  }

  getHeader () {
    return `url('${this.app.user &&  this.app.user.public.background? this.API.apiUrl('/content/background/' + this.app.user.public.background) : '/assets/picture/pattern0.jpg'}')`
  }
  
  update () {
    return this.GroupService.getProfile(this.club.groupUri)
      .then((club) => { this.club = club }, (error) => { this.SystemMessageService.show(error) })
      .then(() => { this.$scope.$apply() })
  }
    
    join () {
        return this.dialogs.confirm('Отправить заявку на вступление в клуб?')
            .then((confirmed) => { if (!confirmed) throw new Error() })
            .then(() => this.GroupService.join(this.club.groupId, this.UserService.profile.userId))
            .then(() => this.update(), (error) => { this.SystemMessageService.show(error) })
    }
    
    leave () {
        return this.dialogs.confirm('Покинуть клуб?')
            .then((confirmed) => { if (!confirmed) throw new Error() })
            .then(() => this.GroupService.leave(this.club.groupId, this.UserService.profile.userId))
            .then(() => this.update(), (error) => { this.SystemMessageService.show(error) })
    }
    
    cancel () {
        return this.dialogs.confirm('Отменить заявку?')
            .then((confirmed) => { if (!confirmed) throw new Error() })
            .then(() => this.GroupService.processGroupMembership(this.club.groupId, 'C'))
            .then(() => this.update(), (error) => { this.SystemMessageService.show(error) })
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
