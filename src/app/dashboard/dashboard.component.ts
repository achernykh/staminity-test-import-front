import './dashboard.component.scss';
import moment from 'moment/min/moment-with-locales.js';
import {IComponentOptions, IComponentController, IPromise,IScope} from 'angular';
import {CalendarService} from "../calendar/calendar.service";
import {ISessionService} from "../core/session.service";
import {IMessageService} from "../core/message.service";
import {IUserProfile} from "../../../api/user/user.interface";
import {IGroupManagementProfile, IUserManagementProfile} from "../../../api/group/group.interface";
import { times } from '../share/util.js';
import {ICalendarItem} from "../../../api/calendar/calendar.interface";

export interface IDashboardWeek {
    sid: number;
    calendar: Array<{
        profile: IUserManagementProfile,
        subItem: IDashboardDay[];
    }>;
};

export interface IDashboardDay {
    data: {
        calendarItems: Array<ICalendarItem>;
    };
};

class DashboardCtrl implements IComponentController {

    public currentUser: IUserProfile;
    public groupId: number;
    public athletes: IGroupManagementProfile;

    private cache: Array<IDashboardWeek>;
    private dashboard: IDashboardWeek;

    private dateFormat: string = 'YYYY-MM-DD';
    private currentDate: Date = new Date();
    private currentWeek: number = 0;
    private weekdayNames: Array<string> = [];

    static $inject = ['$scope','$mdDialog','CalendarService','SessionService', 'message'];

    constructor(
        private $scope: IScope,
        private $mdDialog: any,
        private calendar: CalendarService,
        private session: ISessionService,
        private message: IMessageService) {

    }

    $onInit() {
        moment.locale('ru');
        this.cache = [];
        this.currentWeek = 0;
        this.currentDate = moment().startOf('week');
        this.getData(this.currentDate);

    }

    next() {
        this.currentWeek++;
        this.currentDate = moment(this.currentDate).startOf('week').add(1,'w');
        this.getData(this.currentDate);
    }

    prev() {
        this.currentWeek--;
        this.currentDate = moment(this.currentDate).startOf('week').add(-1,'w');
        this.getData(this.currentDate);
    }

    getData(date) {

        console.log('getDate', date.format('YYYY-MM-DD'));
        let start = moment(date).startOf('week');
        let end = moment(start).add(6, 'd');
        this.weekdayNames = times(7).map(i => moment(date).startOf('week').add(i,'d').format('ddd DD'));

        if(this.cache.some(d => d.sid === this.currentWeek)) {
            this.dashboard = this.cache.filter(d => d.sid === this.currentWeek)[0];
            //this.$scope.$apply();
        } else {
            this.calendar.getCalendarItem(start.format(this.dateFormat), end.format(this.dateFormat),null,this.groupId)
                .then((response:Array<ICalendarItem>) => {
                    this.cache.push({
                        sid: this.currentWeek,
                        calendar: this.athletes.members.map(athlete => ({
                            profile: athlete.userProfile,
                            subItem: times(7).map(i => ({
                                data: {
                                    calendarItems: []
                                }
                            }))
                        }))
                    });
                    response.map(item => {
                        this.cache.filter(d => d.sid === this.currentWeek)[0].calendar
                            .filter(c => c.profile.userId === item.userProfileOwner.userId)[0]
                            .subItem[moment(item.dateStart, this.dateFormat).weekday()].data.calendarItems.push(item);
                    });
                    this.dashboard = this.cache.filter(d => d.sid === this.currentWeek)[0];
                    this.$scope.$apply();
                }, error => console.error(error));
        }
    }

    onOpen($event, mode, data) {
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
                                on-cancel="cancel()" on-answer="answer(response)">
                        </calendar-item-activity>
                   </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: $event,
            locals: {
                data: data,
                mode: mode,
                user: this.currentUser
            },
            /*resolve: {
             details: () => this.ActivityService.getDetails(this.data.activityHeader.activityId)
             .then(response => response, error => console.error(error))
             },*/
            bindToController: true,
            clickOutsideToClose: true,
            escapeToClose: true,
            fullscreen: true

        })
            .then(response => {
                console.log('user close dialog with =', response);

                // При изменение записи сначала удаляем старую, потом создаем новую
                if(response.type === 'put'){
                    //this.calendar.onDeleteItem(this.data)
                    //this.calendar.onPostItem(response.item)
                    //this.message.toastInfo('Изменения сохранены')
                }

                if(response.type === 'delete') {
                    //this.calendar.onDeleteItem(response.item)
                    //this.message.toastInfo('Запись удалена')
                }


            }, ()=> {
                console.log('user cancel dialog, data=');
            });
    }

}

const DashboardComponent:IComponentOptions = {
    bindings: {
        currentUser: '<',
        groupId: '<',
        athletes: '<'
    },
    require: {
        //component: '^component'
    },
    controller: DashboardCtrl,
    template: require('./dashboard.component.html') as string
};

export default DashboardComponent;

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