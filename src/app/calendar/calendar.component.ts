import './calendar.component.scss';
import moment from 'moment/min/moment-with-locales.js';
import { Subject } from 'rxjs/Subject';
import { times } from '../share/util.js';
import { IComponentOptions, IComponentController, IScope, IAnchorScrollService, ILocationService, IRootScopeService, copy} from 'angular';
import {IMessageService} from "../core/message.service";
import {CalendarService} from "./calendar.service";
import {ISessionService} from "../core/session.service";
import {ICalendarItem} from "../../../api/calendar/calendar.interface";
import {IUserProfile} from "../../../api/user/user.interface";


const prepareItem = (item: ICalendarItem, shift: number) => {
    item.dateStart = moment(item.dateStart, 'YYYY-MM-DD').add(shift,'d').format('YYYY-MM-DD');
    item.dateEnd = moment(item.dateEnd, 'YYYY-MM-DD').add(shift,'d').format('YYYY-MM-DD');
    if(item.calendarItemType === 'activity') {
        item.activityHeader.intervals = item.activityHeader.intervals.filter(i => i.type === 'pW' || i.type === 'P');
        delete item.activityHeader.intervals.filter(i => i.type === 'pW')[0].calcMeasures.completePercent.value;
    }
    return item;
};

const getItemById = (calendar: Array<ICalendarWeek>, id: number):ICalendarItem => {

    let findData: boolean = false;
    let w,d,i: number;

    for (w = 0; w < calendar.length; w++) {
        for(d = 0; d < calendar[w].subItem.length; d++) {
            i = calendar[w].subItem[d].data.calendarItems.findIndex(item => item.calendarItemId === id);
            if (i !== -1) {
                findData = true;
                break;
            }
        }
        if (findData) {
            break;
        }
    }
    //let data: any = calendar.find(week => !!week.subItem.find(day => !!day.data.calendarItems.find(item => item.calendarItemId === id)));
    return findData && calendar[w].subItem[d].data.calendarItems[i] || null;
};

export interface ICalendarWeek {
    sid: number; // номер недели, текущая неделя календаря = 0
    date: any; // дата начала недели
    anchor: string; // anchor просматриваемой недели добавляется в url
    changes: number; // счетчик изменений внутри недели
    toolbarDate: string; //дата недели в формате тулабара Год + Месяц date.format('YYYY MMMM'),
    selected: boolean; // индикатор выделения недели
    subItem: ICalendarDay[]; //дни недели
    week: string; //индикатор недели для поиска
    loading: Promise<any>;
    height: number;
};

export interface ICalendarDay {
    key: string; // формат дня в формате YYYY.MM.DD
    selected: boolean; // индикатор выбора дня
    date: string;// формат дня в формате GMT
    data: ICalendarDayData;
}

export interface ICalendarDayData {
    title: string; // день в формате DD
    month: string; // месяц в формате MMM
    day: string; // день в формате dd
    date: string; // день в формате YYYY.MM.DD
    calendarItems: Array<ICalendarItem>; // записи календаря
}

export class CalendarCtrl implements IComponentController{

    static $inject = ['$scope', '$mdDialog', '$rootScope', '$anchorScroll','$location','message',
        'CalendarService','SessionService','dialogs'];
    public user: IUserProfile; //
    private weekdayNames: Array<string> = [];
    private buffer: Array<ICalendarItem> = [];
    private firstSrcDay: string;
    private dateFormat: string = 'YYYY-MM-DD';
    private date: Date;
    private range: Array<number> = [0, 1];
    private calendar: Array<ICalendarWeek> = [];
    private currentWeek: ICalendarWeek;
    private lockScroll: boolean;
    public currentUser: IUserProfile;

    constructor(
        private $scope: IScope,
        private $mdDialog: any,
        private $rootScope: IRootScopeService,
        private $anchorScroll: IAnchorScrollService,
        private $location: ILocationService,
        private message: IMessageService,
        private CalendarService: CalendarService,
        private session: ISessionService,
        private dialogs: any)
    {

    }

    $onInit() {
        moment.locale('ru');

        let date = moment(this.$location.hash());
        let firstDayOfWeek = this.session.getUser().display.firstDayOfWeek;
        this.currentUser = this.session.getUser();
        this.toDate(date.isValid()? date.toDate() : new Date());

        this.CalendarService.item$
            .filter(message => message.value.hasOwnProperty('userProfileOwner') &&
            message.value.userProfileOwner.userId === this.user.userId)
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
                        this.onDeleteItem(getItemById(this.calendar, message.value.calendarItemId));
                        this.onPostItem(<ICalendarItem>message.value);
                        this.$scope.$apply();
                        break;
                    }
                }
            });

        //console.log('first day=', firstDayOfWeek, moment.localeData().firstDayOfWeek(),moment.locale());
        if(moment.localeData().firstDayOfWeek() !== firstDayOfWeek){
            moment.updateLocale(moment.locale(), {
                week : {
                    dow : firstDayOfWeek
                }
            });
        }
        console.log('new first day=', moment.localeData().firstDayOfWeek());
        this.weekdayNames = times(7).map(i => moment().startOf('week').add(i,'d').format('dddd'));
    }

    takeWeek (date) {
        date = moment(date).startOf('week');
        let week = this.calendar.find(w => w.date.isSame(date, 'week'));
        let calendarFirst = this.calendar[0] && moment(this.calendar[0].date);
        let calendarLast = this.calendar[0] && moment(this.calendar[this.calendar.length - 1].date);

        if (week) {
            return Promise.resolve(week);
        } else if (calendarFirst && calendarFirst.add(- 1, 'w').isSame(date, 'date')) {
            return this.up() [0];
        } else if (calendarLast && calendarLast.add(1, 'w').isSame(date, 'date')) {
            return this.down() [0];
        } else {
            return this.reset(date) [0];
        }
    }

    reset (date: Date) {
        this.date = date;
        this.range = [0, 1];
        this.calendar = [];
        this.currentWeek = <ICalendarWeek> {};
        return this.up();
    }
    
    setCurrentWeek (week) {
        if (this.currentWeek !== week) {
            this.currentWeek = week;
            //this.$location.hash(week.anchor).replace();
        }
    }
    
    toPrevWeek () {
        this.toDate(moment(this.currentWeek.date).add(-1, 'week'));
    }
    
    toNextWeek () {
        this.toDate(moment(this.currentWeek.date).add(1, 'week'));
    }
    
    toCurrentWeek () {
        this.toDate(moment().startOf('week'));
    }
    
    toDate (date) {        
        let week = this.takeWeek(date);
        this.scrollToWeek(week);
        
        (week.loading || Promise.resolve(week))
        .then(week => setTimeout(() => {
            this.scrollToWeek(week);
         }, 1));
    }

    scrollToWeek (week) {
        this.setCurrentWeek(week);
        let anchor = 'hotfix' + week.anchor;
        this.$anchorScroll('hotfix' + week.anchor);
    }

    /**
     * DayItem view model
     * @param date
     * @param calendarItems
     */
    dayItem (date, calendarItems):ICalendarDay {
        //debugger;
        //console.log('dayItem',date.utc(),date.utc().add(moment().utcOffset(),'minutes').format());
        return {
            key: date.format(this.dateFormat),
            selected: false,
            date: date.format(this.dateFormat),
            data: {
                title: date.format('DD'),
                month: date.format('MMM'),
                day: date.format('dd'),
                date: date.format(),//date.utc().add(moment().utcOffset(),'minutes').format(),
                calendarItems: calendarItems
            }
        };
    }
    
    /**
     * WeekItem view model
     * @param index 
     * @param date - дата начала недели
     * @param days : DayItem[]
     */
    weekItem (index, date, days, loading):ICalendarWeek {
        return {
            sid: index,
            date: date,
            anchor: date.format('YYYY-MM-DD'),
            changes: 0,
            toolbarDate: date.format('YYYY MMMM'),
            selected: false,
            subItem: days,
            week: date.format('GGGG-WW'),
            loading: loading,
            height: 180
        };
    }
    
    /**
     * Предоставляет объекты WeekItem
     * @param date - любой Datetime недели
     * @param index - позиция в списке
     */
    getWeek (date, index) {
        let start = moment(date).startOf('week');
        let end = moment(start).add(6, 'd');
        
        let days = (items) => times(7).map((i) => {
            let date = moment(start).add(i, 'd');
            let calendarItems = items
                .filter(item => moment(item.dateStart, this.dateFormat).weekday() === i)
                .map(item => {
                    //if(item.calendarItemType === 'activity') {
                        item['index'] = Number(`${item.calendarItemId}${item.revision}`);
                    //}
                    return item;
                });
            
            return this.dayItem(date, calendarItems);
        });
        
        let loading = this.CalendarService.getCalendarItem(start.format(this.dateFormat), end.format(this.dateFormat), this.user.userId)
        .then(items => { 
            week.subItem = days(items); 
            week.changes++;
            return week;
        });
        
        let week = this.weekItem(index, start, days([]), loading);
        
        return week;
    }
    
    /**
     * Подгрузка n записей вверх
     * @param n
     */
    up (n = 1) {
        let i0 = this.range[0];
        this.range[0] -= n;
        
        let items = times(n)
            .map((i) => i0 - i)
            .map((i) => this.getWeek(moment(this.date).add(i, 'w'), i));

        items
            .map(week => {
                this.calendar.unshift(week);
                week.loading
                .then(() => { 
                    week.loading = null;
                    this.$scope.$apply();
                })
                .catch((exc) => { console.log('Calendar loading fail', exc); });
            });
            
        return items;
    }
    
    /**
     * Подгрузка n записей вниз
     * @param n
     */
    down (n = 1) {
        let i0 = this.range[1];
        this.range[1] += n;
        
        let items = times(n)
            .map((i) => i0 + i)
            .map((i) => this.getWeek(moment(this.date).add(i, 'w'), i));

        items
            .forEach(week => {
                this.calendar.push(week);
                week.loading
                .then(() => { 
                    week.loading = null;
                    this.$scope.$apply();
                })
                .catch((exc) => { console.log('Calendar loading fail', exc); });
            });
            
        return items;
    }

    onAddActivity($event){
        this.$mdDialog.show({
            controller: DialogController,
            controllerAs: '$ctrl',
            template:
                `<md-dialog id="post-activity" aria-label="Activity">
                        <calendar-item-activity
                                layout="row" class="calendar-item-activity"
                                date="$ctrl.date"
                                mode="'post'"
                                user="$ctrl.user" popup="true"
                                on-cancel="cancel()" on-answer="answer(response)">
                        </calendar-item-activity>
                   </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: $event,
            locals: {
                date: new Date(), // дата дня в формате ГГГГ-ММ-ДД
                user: this.user
            },
            //resolve: {
            //    details: () => this.ActivityService.getDetails(data.activityHeader.activityId)
            //        .then(response => response, error => console.error(error))
            //},
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: false,
            fullscreen: true
        })
            .then(response => {
                if(response.type === 'post') {
                    console.log('save activity', response);
                    //this.calendar.onPostItem(response.item);
                    //this.message.toastInfo('Создана новая запись');
                }
            }, ()=> {
                console.log('user cancel dialog');
            });
    }

    onAddMeasurement($event){
        this.$mdDialog.show({
            controller: DialogController,
            controllerAs: '$ctrl',
            template: `<calendar-item-measurement
                            class="calendar-item-measurement"
                            data="$ctrl.data"
                            mode="post"
                            user="$ctrl.user"
                            on-cancel="cancel()" on-answer="answer(response)">
                      </calendar-item-measurement>`,
            parent: angular.element(document.body),
            targetEvent: $event,
            locals: {
                data: {
                    date: new Date() // дата дня в формате ГГГГ-ММ-ДД
                },
                user: this.user
            },
            bindToController: true,
            clickOutsideToClose: true,
            escapeToClose: true,
            fullscreen: true

        })
            .then(response => {
                if(response.type === 'post') {
                    //this.calendar.onPostItem(response.item)
                    //this.message.toastInfo('Создана новая запись');
                }

            }, ()=> {
                console.log('user cancel dialog');
            });
    }

    onAddEvent($event, data) {
        this.$mdDialog.show({
            controller: DialogController,
            controllerAs: '$ctrl',
            template: `<md-dialog id="events" aria-label="Events">
                        <calendar-item-events
                                flex layout="column" class="calendar-item-events"
                                data="$ctrl.data"
                                user="$ctrl.user"
                                mode="post"
                                on-cancel="cancel()" on-answer="answer(response)">
                        </calendar-item-events>
                   </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: $event,
            locals: {
                data: {
                    date: new Date() // дата дня в формате ГГГГ-ММ-ДД
                },
                user: this.user
            },
            bindToController: true,
            clickOutsideToClose: true,
            escapeToClose: true,
            fullscreen: true

        })
            .then(response => {
                console.log('user close dialog with =', response);

            }, () => {
                console.log('user cancel dialog, data=', data);
            });
    }



    /**
     * Создание записи календаря
     * @param item<ICalendarItem>
     */
    onPostItem(item) {
        let w = this.getDayIndex(moment(item.dateStart).format('GGGG-WW'));
        let d = moment(item.dateStart).weekday();
        console.log('onPostItem to',w,d,item,moment(item.dateStart).format('GGGG-WW'));
        this.calendar[w].subItem[d].data.calendarItems.push(item);
        this.calendar[w].changes++;
    }

    /**
     * Удаление записи календаря
     * @param item
     */
    onDeleteItem(item) {
        let w = this.getDayIndex(moment(item.dateStart).format('GGGG-WW'));
        let d = moment(item.dateStart).weekday();
        let p = this.calendar[w].subItem[d].data.calendarItems.findIndex(i => i.calendarItemId === item.calendarItemId);

        console.log('onDeleteItem', w,d,p,item,this.calendar);
        if (w && d >= 0 && p !== -1) {
            this.calendar[w].subItem[d].data.calendarItems.splice(p,1);
            this.calendar[w].changes++;
        }
    }

    onFileUpload(){
        this.dialogs.uploadFile()
            .then(file => this.CalendarService.postFile(file,null))
            .then(response => this.message.toastInfo(response), error => this.message.toastInfo(error));
    }

    /**
     * Получение индекса недели в массиве календаря
     * @param w - неделя в формате GGGG-WW
     * @returns {number}
     */
    getDayIndex(w) {
        return this.calendar.findIndex(item => item.week === w);
    }


    onCopy(items: Array<ICalendarItem>){
        debugger;
        this.buffer = [];
        this.firstSrcDay = null;

        if(items){
            this.buffer.push(...copy(items));
            this.firstSrcDay = moment(items[0].dateStart).format('YYYY-MM-DD');
        } else {
            this.calendar.forEach(w => w.subItem.forEach(d => {
                if(d.selected) {
                    if(!this.firstSrcDay) {
                        this.firstSrcDay = d.data.date;
                    }
                    if (d.data.calendarItems && d.data.calendarItems.length > 0) {
                        this.buffer.push(...copy(d.data.calendarItems));
                    }
                }
            }));
        }
        if(this.buffer && this.buffer.length > 0) {
            this.message.toastInfo('itemsCopied');
        }
    }

    onPaste(firstTrgDay: string){
        debugger;
        let shift = moment(firstTrgDay, 'YYYY-MM-DD').diff(moment(this.firstSrcDay,'YYYY-MM-DD'), 'days');
        let task:Array<Promise<any>> = [];

        if (shift && this.buffer && this.buffer.length > 0) {
            task = this.buffer
                .filter(item => item.calendarItemType === 'activity' && item.activityHeader.intervals.some(interval => interval.type === 'pW'))
                .map(item => this.CalendarService.postItem(prepareItem(item, shift)));
            Promise.all(task)
                .then(()=> this.message.toastInfo('itemsPasted'), (error)=> this.message.toastError(error))
                .then(()=> this.clearBuffer());;
        }

    }

    onDelete(items:Array<ICalendarItem>) {
        debugger;
        let selected: Array<ICalendarItem> = [];

        this.calendar.forEach(w => w.subItem.forEach(d => {
            if(d.selected && d.data.calendarItems && d.data.calendarItems.length > 0) {
                selected.push(...d.data.calendarItems);
            }
        }));

        let inSelection: boolean = (selected && selected.length > 0) && selected.some(s => items.some(i => i.calendarItemId === s.calendarItemId));

        debugger;

        this.dialogs.confirm('dialogs.deletePlanActivity')
            .then(() => this.CalendarService.deleteItem('F', inSelection ? selected.map(item => item.calendarItemId) : items.map(item => item.calendarItemId))
                .then(()=> this.message.toastInfo('itemsDeleted'), (error)=> this.message.toastError(error))
                .then(()=> inSelection && this.clearBuffer()));
    }

    clearBuffer() {
        this.buffer = [];
        this.firstSrcDay = null;
        this.calendar.forEach(w => w.subItem.forEach(d => {
            if(d.selected) {
                d.selected = false;
            }
        }));
    }

}

const CalendarComponent: IComponentOptions = {
    bindings: {
        view: '<',
        user: '<'
    },
    transclude: false,
    controller: CalendarCtrl,
    template: require('./calendar.component.html') as string
};
export default CalendarComponent;

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