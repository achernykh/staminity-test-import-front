import './requests.component.scss';
import moment from 'moment/min/moment-with-locales.js';


const stateIcons = {
    'A': 'check',
    'D': 'block',
    'C': 'close'
};

class RequestsCtrl {

    constructor ($scope, $mdDialog, $mdSidenav, UserService, GroupService, RequestsService, SessionService, dialogs, message) {
        this.$scope = Object.assign($scope, { stateIcons });
        this.$mdDialog = $mdDialog;
        this._$mdSidenav = $mdSidenav;
        this.UserService = UserService;
        this.GroupService = GroupService;
        this.SessionService = SessionService;
        this.dialogs = dialogs;
        this.message = message;
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

    $onInit() {
        moment.lang('ru');
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
        .then((confirmed) => confirmed && this.GroupService.processMembership(action, null, request.userGroupRequestId)
            .then(this.message.toastInfo('requestComplete'), error => this.message.toastError(error)));
    }
    
    close () {
        this._$mdSidenav('requests').toggle();
    }
};

RequestsCtrl.$inject = ['$scope','$mdDialog','$mdSidenav','UserService','GroupService','RequestsService','SessionService','dialogs','message'];

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
