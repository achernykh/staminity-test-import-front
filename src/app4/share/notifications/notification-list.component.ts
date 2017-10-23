import * as moment from 'moment/min/moment-with-locales.js';
import { Subject} from "rxjs/Rx";
import { NotificationService } from "./notifications.service";
import { INotification, Notification, Initiator } from "../../../../api/notification/notification.interface";
import { IUserProfile } from "../../../../api/user/user.interface";
import { ICalendarItem } from "../../../../api/calendar/calendar.interface";
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { SessionService, getUser, UserProfileService, CommentService } from "../../core";

@Component({
    selector: 'st-notification-list',
    template: require('./notification-list.component.html') as string,
    styles: [require('./notification-list.component.scss').toString()]
})
export class NotificationListComponent implements OnInit, OnDestroy {

    public notifications: Array<Notification>;
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
    private currentUser: IUserProfile;
	private destroy: Subject<any> = new Subject();

    constructor(
        private chRef: ChangeDetectorRef,
        private notificationService: NotificationService,
        //private CalendarService: CalendarService,
        //private UserService: UserService,
        private session: SessionService
    ) {

    }


    ngOnInit() {
        this.notifications = this.notificationService.notifications;
        
        this.notificationService.notificationsChanges
            .takeUntil(this.destroy)
            .subscribe((notifications) => {
                this.notifications = notifications;
                this.chRef.detectChanges();
            });

        this.session.getObservable()
            .takeUntil(this.destroy)
            .map(getUser)
            .subscribe((profile) => this.currentUser = Object.assign({}, profile));
    }

    ngOnDestroy() {
        this.destroy.next(); 
        this.destroy.complete();
    }

    fromNow (date) {
        return moment.utc(date).fromNow(true);
    }

    close () {
        //clearTimeout(this.timer);
        //this.$mdSidenav('notifications').toggle();
        this.notificationService.put(null, moment().utc() ,true);
        /*setTimeout(() => {
            if(this.notifications) {
                this.notifications.filter(n => !n.isRead).forEach(n => this.NotificationService.put(n.id, true));
            }
        },1);*/
    }
    /**
    onClick($event, notification: Notification):void {
        if(Object.keys(this.activityTemplates).some(k => k === notification.template)) {

            this.CalendarService.getCalendarItem(null,null,null,null,notification.context[this.activityTemplates[notification.template]])
                .then(response => {
                    let activity: ICalendarItem = response[0];
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
                                        tab="$ctrl.tab" popup="true"
                                        on-cancel="cancel()" on-answer="answer(response)">
                                </calendar-item-activity>
                           </md-dialog>`,
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        locals: {
                            data: activity,
                            mode: 'view',
                            tab: (this.commentTemplates.some(t => t === notification.template) && 'chat') || null
                        },
                        resolve: {
                            user: () => {
                                return this.currentUser.userId === activity.userProfileOwner.userId ? Promise.resolve(this.currentUser) :
                                    this.UserService.getProfile(activity.userProfileOwner.userId).catch(error => console.error(error));
                            }
                        },
                        bindToController: true,
                        clickOutsideToClose: true,
                        escapeToClose: true,
                        fullscreen: true

                    }).then(response => console.log(response), error => console.log(error));

                }, error => {throw new Error(error);});

            this.NotificationService.put(notification.id, null, true).catch();

        }
    }
    **/
}


/**export default NotificationListComponent;

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
DialogController.$inject = ['$scope','$mdDialog'];**/