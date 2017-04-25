import './notification-list.component.scss';
import * as moment from 'moment/min/moment-with-locales.js';
import {IComponentOptions, IComponentController, IPromise, IScope} from 'angular';
import NotificationService from "./notification.service";
import {INotification, Notification, Initiator} from "../../../../api/notification/notification.interface";
import {CalendarService} from "../../calendar/calendar.service";
import UserService from "../../core/user.service";
import CommentService from "../../core/comment.service";


class NotificationListCtrl implements IComponentController {

    public isOpen: boolean;
    public notifications: Array<Notification>;
    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    public readonly readTime: 5000;
    public timer: number;
    private readonly activityTemplates = {
        uploadActivityByProvider: 2,
        activityCompletedByAthlete: 2,
        activityCreatedByCoach: 3,
        activityModifiedByCoach: 3,
        activityCreatedByAthlete: 3,
        activityFactModifiedByAthlete: 3,
        newCoachComment: 3,
        newAthleteComment: 3
    };
    private readonly commentTemplates: Array<string> = ['newCoachComment','newAthleteComment'];

    static $inject = ['$scope','$mdDialog','$mdSidenav','NotificationService','CalendarService', 'UserService'];

    constructor(
        private $scope: IScope,
        private $mdDialog: any,
        private $mdSidenav: any,
        private NotificationService: NotificationService,
        private CalendarService: CalendarService,
        private UserService: UserService) {

    }

    $onChanges(changes: any):void {
        /*if(changes.hasOwnProperty('isOpen') && !changes.isOpen.isFirstChange()){
            this.timer = setTimeout(() => !!this.notifications && this.notifications.filter(n => !n.isRead)
                .forEach(n => this.NotificationService.put(n.id, true)), this.readTime);
        }*/
    }

    $onInit() {
        this.NotificationService.list$.subscribe((list) => {this.notifications =  list; this.$scope.$apply();});
    }

    $onDestroy(): void {

    }

    fromNow (date) {
        return moment.utc(date).fromNow(true);
    }

    close () {
        //clearTimeout(this.timer);
        this.$mdSidenav('notifications').toggle();
        if(this.notifications) {
            this.notifications.filter(n => !n.isRead).forEach(n => this.NotificationService.put(n.id, true));
        }
    }

    onClick($event, notification: Notification):void {
        debugger;
        if(Object.keys(this.activityTemplates).some(k => k === notification.template)) {
            this.$mdDialog.show({
                controller: DialogController,
                controllerAs: '$ctrl',
                template:
                    `<md-dialog id="activity" aria-label="Activity">
                        <calendar-item-activity
                                layout="row" class="calendar-item-activity"
                                data="$ctrl.data"
                                mode="$ctrl.mode"
                                user="$ctrl.user"
                                tab="$ctrl.tab"
                                on-cancel="cancel()" on-answer="answer(response)">
                        </calendar-item-activity>
                   </md-dialog>`,
                parent: angular.element(document.body),
                targetEvent: $event,
                locals: {
                    //data: this.data,
                    mode: 'view',
                    tab: (this.commentTemplates.some(t => t === notification.template) && 3) || 0
                },
                resolve: {
                    user: () => this.UserService.getProfile(notification.initiator[Initiator.uri])
                        .catch(error => console.error(error)),
                    data: () => this.CalendarService.getCalendarItem(null,null,null,null,notification.context[this.activityTemplates[notification.template]])
                        .then(response => response[0], error => {throw new Error(error);})
                },
                bindToController: true,
                clickOutsideToClose: true,
                escapeToClose: true,
                fullscreen: true

            }).then(response => console.log(response), error => console.log(error));

            this.NotificationService.put(notification.id, true).catch();

        }
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

function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        console.log('cancel');
        $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
}
DialogController.$inject = ['$scope','$mdDialog'];