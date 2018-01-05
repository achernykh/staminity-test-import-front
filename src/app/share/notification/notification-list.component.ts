import './notification-list.component.scss';
import * as moment from 'moment/min/moment-with-locales.js';
import {IComponentOptions, IComponentController, IPromise, IScope} from 'angular';
import {Subject} from "rxjs/Rx";
import NotificationService from "./notification.service";
import {CalendarService} from "../../calendar/calendar.service";
import UserService from "../../core/user.service";
import { SessionService, getUser} from "../../core";
import {IUserProfile, ICalendarItem, INotification, Notification, Initiator} from "../../../../api";
import { CalendarItemDialogService } from "@app/calendar-item/calendar-item-dialog.service";
import { ICalendarItemDialogOptions } from "@app/calendar-item/calendar-item-dialog.interface";
import {FormMode } from '../../application.interface';

class NotificationListCtrl implements IComponentController {

    public isOpen: boolean;
    public notifications: Array<Notification>;
    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    public readonly readTime: 5000;
    public timer: number;
    private activityDialogOptions: ICalendarItemDialogOptions;
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

    static $inject = ['$scope','$mdDialog','$mdSidenav','NotificationService','CalendarService', 'UserService',
        'SessionService', 'CalendarItemDialogService'];

    constructor(
        private $scope: IScope,
        private $mdDialog: any,
        private $mdSidenav: any,
        private NotificationService: NotificationService,
        private CalendarService: CalendarService,
        private UserService: UserService,
        private session: SessionService,
        private calendarDialogService: CalendarItemDialogService
    ) {

    }

    $onChanges(changes: any):void {
        /*if(changes.hasOwnProperty('isOpen') && !changes.isOpen.isFirstChange()){
            this.timer = setTimeout(() => !!this.notifications && this.notifications.filter(n => !n.isRead)
                .forEach(n => this.NotificationService.put(n.id, true)), this.readTime);
        }*/
    }

    $onInit() {
        this.notifications = this.NotificationService.notifications;
        
        this.NotificationService.notificationsChanges
        .takeUntil(this.destroy)
        .subscribe((notifications) => {
            this.notifications = notifications;
            this.$scope.$applyAsync();
        });

        this.session.getObservable()
        .takeUntil(this.destroy)
        .map(getUser)
        .subscribe((profile) => this.currentUser = angular.copy(profile));

        this.activityDialogOptions = {
            currentUser: this.currentUser,
            owner: null,
            formMode: FormMode.View,
            popupMode: true,
            templateMode: false
        };
    }

    $onDestroy() {
        this.destroy.next(); 
        this.destroy.complete();
    }

    fromNow (date) {
        return moment.utc(date).fromNow(true);
    }

    close () {
        //clearTimeout(this.timer);
        this.$mdSidenav('notifications').toggle();
        this.NotificationService.put(null, moment().utc() ,true);
        /*setTimeout(() => {
            if(this.notifications) {
                this.notifications.filter(n => !n.isRead).forEach(n => this.NotificationService.put(n.id, true));
            }
        },1);*/
    }

    /**
     *
     * @param e
     * @param notification
     */
    onClick(e: Event, notification: Notification):void {
        if(Object.keys(this.activityTemplates).some(k => k === notification.template)) {

            this.CalendarService.getCalendarItem(null,null,null,null,notification.context[this.activityTemplates[notification.template]])
                .then(response => {
                    let activity: ICalendarItem = response[0];
                    Promise.resolve(() => {})
                        .then(() => this.currentUser.userId === activity.userProfileOwner.userId ?
                                this.currentUser :
                                this.UserService.getProfile(activity.userProfileOwner.userId))
                        .then(owner => {
                            this.calendarDialogService.activity(e, Object.assign(this.activityDialogOptions, {owner: owner}), activity)
                                .then(() => {});
                        });
                });



            /**this.CalendarService.getCalendarItem(null,null,null,null,notification.context[this.activityTemplates[notification.template]])
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

                }, error => {throw new Error(error);});**/

            this.NotificationService.put(notification.id, null, true).catch();

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