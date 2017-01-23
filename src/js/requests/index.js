class RequestsCtrl {

    constructor ($scope, $mdDialog, $mdSidenav, UserService, GroupService, API, dialogs, SystemMessageService) {
        'ngInject';
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this._$mdSidenav = $mdSidenav;
        this.UserService = UserService;
        this.GroupService = GroupService;
        this.dialogs = dialogs;
        this.API = API;
        this.SystemMessageService = SystemMessageService;
        
        this.user = this.UserService.profile
        this.update()
        
        this.requests = {
          inbox: {
            new: [],
            old: []
          },
          outbox: {
            new: [],
            old: []
          }
        };
    }
    
    update () {
      this.GroupService.getMembershipRequest(0, 20)
      .then((requests) => {
        this.requests.inbox.new = requests.filter((request) => request.receiver.userId == this.user.userId && !request.updated)
        this.requests.inbox.old = requests.filter((request) => request.receiver.userId == this.user.userId && request.updated)
        this.requests.outbox.new = requests.filter((request) => request.initiator.userId == this.user.userId && !request.updated)
        this.requests.outbox.old = requests.filter((request) => request.initiator.userId == this.user.userId && request.updated)
        this.$scope.$apply()
      })
    }
    
    processRequest (request, action) {
      this.dialogs.confirm()
      .then((confirmed) => { if (!confirmed) throw new Error() })
      .then(() => this.GroupService.processMembershipRequest(request.userGroupRequestId, action))
      .then(() => this.update(), (error) => { this.SystemMessageService.show(error) })
    }
    
    close () {
      this._$mdSidenav('requests').toggle();
    }

};


const requests = {

    bindings: {
        view: '<'
    },

    require: {
        app: '^staminityApplication'
    },

    controller: RequestsCtrl,

    templateUrl: 'requests/requests.html'

}

angular.module('staminity.requests', ['ngMaterial', 'staminity.components'])
    .component('requests', requests)