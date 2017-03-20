import './notification-list.component.scss';
import * as moment from 'moment/min/moment-with-locales.js';
import {IComponentOptions, IComponentController, IPromise, IScope} from 'angular';
import NotificationService from "./notification.service";
import {INotification, Notification} from "../../../../api/notification/notification.interface";


class NotificationListCtrl implements IComponentController {

    public isOpen: boolean;
    public notifications: Array<Notification>;
    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    public readonly readTime: 5000;
    public timer: number;

    static $inject = ['$scope','$mdDialog','$mdSidenav','NotificationService'];

    constructor(
        private $scope: IScope,
        private $mdDialog: any,
        private $mdSidenav: any,
        private NotificationService: NotificationService) {

        this.NotificationService.list$.subscribe((list) => {this.notifications =  list; this.$scope.$apply();});
    }

    $onChanges(changes: any):void {
        if(changes.hasOwnProperty('isOpen') && !changes.isOpen.isFirstChange()){
            this.timer = setTimeout(() => this.notifications.filter(n => !n.isRead)
                .forEach(n => this.NotificationService.put(n.id, true)), this.readTime);
        }
    }

    $onInit() {

    }

    $onDestroy(): void {

    }

    fromNow (date) {
        return moment.utc(date).fromNow(true);
    }

    close () {
        clearTimeout(this.timer);
        this.$mdSidenav('notifications').toggle();
    }
}

const NotificationListComponent:IComponentOptions = {
    bindings: {
        data: '<',
        isOpen: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: NotificationListCtrl,
    template: require('./notification-list.component.html') as string
};

export default NotificationListComponent;