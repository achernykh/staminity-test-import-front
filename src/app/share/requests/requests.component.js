import './requests.component.scss';
import moment from 'moment/min/moment-with-locales.js';
import { Subject } from "rxjs/Rx";


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
        this.destroy = new Subject();
        this.requestsList = [];
        
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

        this.setRequests(this.RequestsService.requests);

        this.RequestsService.requestsChanges
        .takeUntil(this.destroy)
        .subscribe((requests) => {
            this.setRequests(requests);
            this.$scope.$applyAsync();
        });
        
        this.refreshing = setInterval(() => { this.$scope.$digest() }, 2000);
    }

    $onInit () {
        moment.locale('ru');
    }

    $onDestroy () {
        this.destroy.next(); 
        this.destroy.complete();
        clearInterval(this.refreshing);
    }
    
    setRequests (requests) {
        let userId = this.SessionService.getUser().userId;
        
        this.requestsList = requests; 
        this.requests.inbox.new = requests.filter((request) => request.receiver.userId == userId && !request.updated);
        this.requests.inbox.old = requests.filter((request) => request.receiver.userId == userId && request.updated);
        this.requests.outbox.new = requests.filter((request) => request.initiator.userId == userId && !request.updated);
        this.requests.outbox.old = requests.filter((request) => request.initiator.userId == userId && request.updated);
        
        this.$scope.$applyAsync();
    }
    
    fromNow (date) {
        return moment.utc(date).fromNow(true);
    }
    
    processRequest (request, action) {
        this.dialogs.confirm({ text: 'dialogs.performAction' + action })
        .then(() => this.GroupService.processMembership(action, null, request.userGroupRequestId))
        .then(() => this.message.toastInfo('requestComplete'), (error) => error && this.message.toastError(error));
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
