import './notification-list.component.scss';
import * as moment from 'moment/min/moment-with-locales.js';
import {IComponentOptions, IComponentController, IPromise, IScope} from 'angular';
import NotificationService from "./notification.service";
import {INotification} from "../../../../api/notification/notification.interface";


class NotificationListCtrl implements IComponentController {

    public notifications: Array<INotification>;
    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = ['$scope','$mdDialog','$mdSidenav','NotificationService'];

    constructor(
        private $scope: IScope,
        private $mdDialog: any,
        private $mdSidenav: any,
        private NotificationService: NotificationService) {

        this.NotificationService.notificationList.subscribe((notifications) => this.notifications =  notifications);
    }

    $onInit() {

    }

    $onDestroy(): void {

    }

    fromNow (date) {
        return moment.utc(date).fromNow(true);
    }

    close () {
        this.$mdSidenav('notifications').toggle();
    }
}

const NotificationListComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: NotificationListCtrl,
    template: require('./notification-list.component.html') as string
};

export default NotificationListComponent;