import './requests.component.scss';
import moment from 'moment/src/moment.js';


const stateIcons = {
    'A': 'check',
    'D': 'block',
    'C': 'close'
};

class RequestsCtrl {

    constructor ($scope, $mdDialog, $mdSidenav, UserService, GroupService, RequestsService, SessionService, dialogs, SystemMessageService) {
        this.$scope = Object.assign($scope, { stateIcons });
        this.$mdDialog = $mdDialog;
        this._$mdSidenav = $mdSidenav;
        this.UserService = UserService;
        this.GroupService = GroupService;
        this.SessionService = SessionService;
        this.dialogs = dialogs;
        this.SystemMessageService = SystemMessageService;
        this.RequestsService = RequestsService;

        this.RequestsService.requestsList
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
        
        this.limit = {
            inbox: 20,
            outbox: 20
        };
        
        this.startRefreshing();
    }
    
    setRequests (requests) {
        let userId = this.SessionService.getUser().userId;
        
        this.requests.inbox.new = requests.filter((request) => request.receiver.userId == userId && !request.updated);
        this.requests.inbox.old = requests.filter((request) => request.receiver.userId == userId && request.updated);
        this.requests.outbox.new = requests.filter((request) => request.initiator.userId == userId && !request.updated);
        this.requests.outbox.old = requests.filter((request) => request.initiator.userId == userId && request.updated);
        
        this.$scope.$apply();
    }
    
    fromNow (date) {
        return moment.utc(date).fromNow(true);
    }
    
    startRefreshing () {
        if (this.refreshing) return;
        
        this.refreshing = setInterval(() => { this.$scope.$digest() }, 2000);
    }
    
    stopRefreshing () {
        if (!this.refreshing) return;
        
        clearInterval(this.refreshing);
        this.refreshing = null;
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

RequestsCtrl.$inject = ['$scope','$mdDialog','$mdSidenav','UserService','GroupService','RequestsService','SessionService','dialogs','SystemMessageService'];

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
