import './requests.component.scss';

const stateIcons = {
    'A': 'check',
    'D': 'block',
    'C': 'close'
};

class RequestsCtrl {

    constructor ($scope, $mdDialog, $mdSidenav, UserService, GroupService, RequestsService, dialogs, SystemMessageService) {
        this.$scope = Object.assign($scope, { stateIcons });
        this.$mdDialog = $mdDialog;
        this._$mdSidenav = $mdSidenav;
        this.UserService = UserService;
        this.GroupService = GroupService;
        this.dialogs = dialogs;
        this.SystemMessageService = SystemMessageService;
        this.RequestsService = RequestsService;
        
        this.user = this.UserService.profile

        this.RequestsService.requests
        .subscribe((requests) => { this.setRequests(requests) });
        
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
    
    setRequests (requests) {
        this.requests.inbox.new = requests.filter((request) => request.receiver.userId == this.user.userId && !request.updated)
        this.requests.inbox.old = requests.filter((request) => request.receiver.userId == this.user.userId && request.updated)
        this.requests.outbox.new = requests.filter((request) => request.initiator.userId == this.user.userId && !request.updated)
        this.requests.outbox.old = requests.filter((request) => request.initiator.userId == this.user.userId && request.updated)
        this.$scope.$apply()
    }
    
    processRequest (request, action) {
        this.dialogs.confirm('performAction' + action)
        .then((confirmed) => confirmed && this.GroupService.processMembership(action, null, request.userGroupRequestId))
        .then(() => {}, (error) => { this.SystemMessageService.show(error) })
    }
    
    close () {
        this._$mdSidenav('requests').toggle();
    }

};
RequestsCtrl.$inject = ['$scope','$mdDialog','$mdSidenav','UserService','GroupService','RequestsService','dialogs','SystemMessageService'];

const RequestsComponent = {

    bindings: {
        view: '<'
    },
    require: {
        app: '^staminityApplication'
    },
    controller: RequestsCtrl,
    template: require('./requests.component.html')

}
export default RequestsComponent;
