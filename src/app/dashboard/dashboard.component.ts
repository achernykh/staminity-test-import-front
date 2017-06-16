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
import {Activity} from "../activity/activity.datamodel";

export interface IDashboardWeek {
    sid: number;
    week: string; // номер недели в формате GGGG-WW
    calendar: Array<{
        profile: IUserManagementProfile,
        subItem: IDashboardDay[];
        changes: number; // счетчик изменений внутри недели
    }>;
}

export interface IDashboardDay {
    data: {
        calendarItems: Array<ICalendarItem>;
    };
    date: Date;
}

export class DashboardCtrl implements IComponentController {

    public coach: IUserProfile;
    public groupId: number;
    public athletes: IGroupManagementProfile;

    private cache: Array<IDashboardWeek>;
    private dashboard: IDashboardWeek;

    private dateFormat: string = 'YYYY-MM-DD';
    private currentDate: Date = new Date();
    private currentWeek: number = 0;
    private weekdayNames: Array<string> = [];

    public selectedAthletes: Array<number> = [];

    static $inject = ['$scope','$mdDialog','CalendarService','SessionService', 'message'];

    constructor(
        private $scope: IScope,
        private $mdDialog: any,
        private calendar: CalendarService,
        private session: ISessionService,
        private message: IMessageService) {

    }

    toolbarDate() {
        return new Date(moment(this.currentDate).format(this.dateFormat));
    }

    onSelectAthlete(select: boolean, id: number){
        debugger;
        let ind: number = this.selectedAthletes.indexOf(id);
        if (select) {
            this.selectedAthletes.push(id);
        } else {
            this.selectedAthletes.splice(ind,1);
        }
    }

    $onInit() {
        moment.locale('ru');
        this.cache = [];
        this.currentWeek = 0;
        this.currentDate = moment().startOf('week');
        this.getData(this.currentDate);

        this.calendar.item$
            .filter(message => message.value.hasOwnProperty('userProfileOwner') &&
                this.athletes.members.some(member => member.userProfile.userId === message.value.userProfileOwner.userId))
            .map(message => {
                message.value['index'] = Number(`${message.value.calendarItemId}${message.value.revision}`);
                return message;})
            .subscribe((message) => {
                debugger;
                switch (message.action) {
                    case 'I': {
                        this.onPostItem(<ICalendarItem>message.value);
                        this.$scope.$apply();
                        break;
                    }
                    case 'D': {
                        this.onDeleteItem(<ICalendarItem>message.value);
                        this.$scope.$apply();
                        break;
                    }
                    case 'U': {
                        //this.onDeleteItem(getItemById(this.calendar, message.value.calendarItemId));
                        this.onPostItem(<ICalendarItem>message.value);
                        this.$scope.$apply();
                        break;
                    }
                }
            });


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
                        week: moment(start).format('GGGG-WW'),
                        calendar: this.athletes.members.map(athlete => ({
                            profile: athlete.userProfile,
                            subItem: times(7).map(i => ({
                                data: {
                                    calendarItems: []
                                },
                                date: moment(start).add(i,'day').format(this.dateFormat)
                            })),
                            changes: 0
                        }))
                    });
                    response.map(item => {
                        if(item.calendarItemType === 'activity') {
                            item['index'] = Number(`${item.calendarItemId}${item.revision}`);
                        }

                        let sidId = this.cache.findIndex(d => d.sid === this.currentWeek);
                        let calendarId = this.cache[sidId].calendar.findIndex(c => c.profile.userId === item.userProfileOwner.userId);

                        // Добавляем записи календаря в соответсвующий день дэшборда
                        this.cache[sidId].calendar[calendarId]
                            .subItem[moment(item.dateStart, this.dateFormat).weekday()].data.calendarItems.push(item);
                        // Сигнализируем об изменение итогов
                        this.cache[sidId].calendar[calendarId].changes ++;


                        /*this.cache.filter(d => d.sid === this.currentWeek)[0].calendar
                            .filter(c => c.profile.userId === item.userProfileOwner.userId)[0]
                            .subItem[moment(item.dateStart, this.dateFormat).weekday()].data.calendarItems.push(item);*/
                    });
                    this.dashboard = this.cache.filter(d => d.sid === this.currentWeek)[0];
                    this.$scope.$apply();
                }, error => console.error(error));
        }
    }

    /**
     * Создание записи календаря
     * @param item
     */
    onPostItem(item: ICalendarItem) {
        debugger;

        let id:string = moment(item.dateStart).format('GGGG-WW');
        let w:number = this.cache.findIndex(d => d.week === id);
        let c:number = this.cache[w].calendar.findIndex(c => c.profile.userId === item.userProfileOwner.userId);
        let d:number = moment(item.dateStart).weekday();

        this.cache[w].calendar[c].subItem[d].data.calendarItems.push(item);
        this.cache[w].calendar[c].changes++;
    }

    /**
     * Удаление записи календаря
     * @param item
     */
    onDeleteItem(item: ICalendarItem){
        debugger;

        let id:string = moment(item.dateStart).format('GGGG-WW');
        let w:number = this.cache.findIndex(d => d.week === id);
        let c:number = this.cache[w].calendar.findIndex(c => c.profile.userId === item.userProfileOwner.userId);
        let d:number = moment(item.dateStart).weekday();
        let p:number = this.cache[w].calendar[c].subItem[d].data.calendarItems.findIndex(i => i.calendarItemId === item.calendarItemId);

        this.cache[w].calendar[c].subItem[d].data.calendarItems.splice(p,1);
        this.cache[w].calendar[c].changes++;
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
                                user="$ctrl.user" popup="true"
                                on-cancel="cancel()" on-answer="answer(response)">
                        </calendar-item-activity>
                   </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: $event,
            locals: {
                data: data,
                mode: mode,
                user: this.coach
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

    onSelectWeek(select: boolean, id: number) {

    }

}

const DashboardComponent:IComponentOptions = {
    bindings: {
        coach: '<',
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