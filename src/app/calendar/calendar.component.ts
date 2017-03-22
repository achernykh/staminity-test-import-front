import './calendar.component.scss';
import moment from 'moment/min/moment-with-locales.js';
import { Subject } from 'rxjs/Subject';
import { times } from '../share/util.js';
import { IComponentOptions, IComponentController, IScope, IAnchorScrollService, ILocationService, IRootScopeService} from 'angular';
import {IMessageService} from "../core/message.service";
import {CalendarService} from "./calendar.service";
import {ISessionService} from "../core/session.service";
import {ICalendarItem} from "../../../api/calendar/calendar.interface";
import {IUserProfile} from "../../../api/user/user.interface";

interface ICalendarWeek {
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

interface ICalendarDay {
    key: string; // формат дня в формате YYYY.MM.DD
    selected: boolean; // индикатор выбора дня
    date: string;// формат дня в формате YYYY.MM.DD
    data: {
        title: string; // день в формате DD
        month: string; // месяц в формате MMM
        day: string; // день в формате dd
        date: string; // день в формате YYYY.MM.DD
        calendarItems: Array<ICalendarItem>; // записи календаря
    };
}

export class CalendarCtrl implements IComponentController{

    static $inject = ['$scope', '$rootScope', '$anchorScroll','$location','message','CalendarService','SessionService'];
    private user: IUserProfile;
    private weekdayNames: Array<string> = [];
    private buffer: Array<any> = [];
    private dateFormat: string = 'YYYY-MM-DD';
    private date: Date;
    private range: Array<number> = [0, 1];
    private calendar: Array<ICalendarWeek> = [];
    private currentWeek: ICalendarWeek;
    private currentUser: IUserProfile;

    constructor(
        private $scope: IScope,
        private $rootScope: IRootScopeService,
        private $anchorScroll: IAnchorScrollService,
        private $location: ILocationService,
        private message: IMessageService,
        private CalendarService: CalendarService,
        private session: ISessionService) 
    {
        (<any>window).c = this;
        let date = moment($location.hash());
        this.setDate(date.isValid()? date.toDate() : new Date());
        //this.$anchorScroll.yOffset = 120;
    }
    
    
    u () {
        this.up(1);
        this.$scope.$apply();
    }
    
    s (h, i = 0) {
        this.calendar[i].height = h;
        this.$scope.$apply();
    }

    $onInit() {
        this.currentUser = this.session.getUser();
        moment.locale('ru');
        let firstDayOfWeek = this.session.getUser().display.firstDayOfWeek;
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
    
    /**
     * Переход на дату, на пустой календарь
     * @patam date
     */
    reset (date: Date) {
        this.date = date;
        this.range = [0, 1];
        this.calendar = [];
        this.down(2);
        this.setCurrentWeek(this.calendar[0]);
    }
    
    setDate (date) {
        date = moment(date).startOf('week');
        let week = this.calendar.find(w => w.date.isSame(date, 'week'));
        
        if (week) {
            this.setCurrentWeek(week, true);
        } else {
            this.reset(date);
        }
    }
    
    setCurrentWeek (week, scrollTo = false) {
        this.currentWeek = week;
        this.$location.hash(week.anchor).replace();
        if (scrollTo) {
            this.$anchorScroll('hotfix' + week.anchor);
        }
    }
    
    prevWeek () {
        this.setDate(moment(this.currentWeek.date).add(-1, 'week'));
    }
    
    nextWeek () {
        this.setDate(moment(this.currentWeek.date).add(1, 'week'));
    }
    
    todayWeek () {
        this.setDate(moment().startOf('week'));
    }

    /**
     * DayItem view model
     * @param date
     * @param calendarItems
     */
    dayItem (date, calendarItems):ICalendarDay {
        return {
            key: date.format(this.dateFormat),
            selected: false,
            date: date.format(this.dateFormat),
            data: {
                title: date.format('DD'),
                month: date.format('MMM'),
                day: date.format('dd'),
                date: date.format(this.dateFormat),
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
        console.log('getWeek=', date, index);
        let start = moment(date).startOf('week');
        let end = moment(start).add(6, 'd');
        
        let days = (items) => times(7).map((i) => {
            let date = moment(start).add(i, 'd');
            let calendarItems = items
                .filter(item => moment(item.dateStart, this.dateFormat).weekday() === i)
                .map(item => {
                    if(item.calendarItemType === 'activity') {
                        item['index'] = Number(`${item.calendarItemId}${item.revision}`);
                    }
                    return item;
                });
            
            return this.dayItem(date, calendarItems);
        });
        
        let loading = this.CalendarService.getCalendarItem(start.format(this.dateFormat), end.format(this.dateFormat), this.user.userId)
        .then(items => { 
            week.subItem = days(items); 
            week.changes++;
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
            .map((i) => this.getWeek(moment(this.date).add(i, 'w'), i))
            .forEach(week => {
                this.calendar.unshift(week);
                week.loading
                .then(() => { 
                    week.loading = null;
                    this.$scope.$apply();
                })
                .catch((exc) => { console.log('Calendar loading fail', exc); });
            });
            
        console.log('add elem', items);
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
            .map((i) => this.getWeek(moment(this.date).add(i, 'w'), i))
            .forEach(week => {
                this.calendar.push(week);
                week.loading
                .then(() => { 
                    week.loading = null;
                    this.$scope.$apply();
                })
                .catch((exc) => { console.log('Calendar loading fail', exc); });
            });
            
        console.log('add elem', items);
    }
    
    /**
     * Верхний загруженный Week Item
     */
    first () {
        return this.calendar[0];
    }
    
    /**
     * Нижний загруженный Week Item
     */
    last () {
        return this.calendar[this.calendar.length - 1];
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
        this.calendar[w].subItem[d].data.calendarItems.splice(p,1);
        this.calendar[w].changes++;
    }

    /**
     * Получение индекса недели в массиве календаря
     * @param w - неделя в формате GGGG-WW
     * @returns {number}
     */
    getDayIndex(w) {
        return this.calendar.findIndex(item => item.week === w);
    }

    /**-----------------------------------------------------------------------------------------------------------------
     *
     * WEEK & DAY ACTIONS
     *
     * 1) onToggleWeek()
     * 2) onCopyWeek()
     * 2) onPasteWeek()
     * 3) onDeleteWeek()
     * 4) onToggleDay()
     * 5) onCopyDay()
     * 6) onPasteDay()
     * 7) onDeleteDay()
     * 8) onAddItem()
     *
     *----------------------------------------------------------------------------------------------------------------*/

	/**
	 * Копирование записи календаря
	 * @param item - обьект формата calendarItem
	 */
	onCopyItem(item) {
        if (!angular.isArray(item)){
            item = [item];
        };
        this.buffer = item;
        this.message.toastInfo(`Записи скопированы (${this.buffer.length})`);
    }
    
    /**
     * Drop записи календаря (операция drag&drop)
     * @param targetDate
     * @param index
     * @param calendarItem
     * @returns {*}
     */
    /*onDropItem(targetDate, index, calendarItem) {

        let init = moment();
        let dayPos = moment(targetDate, 'YYYY-MM-DD');
        let weekPos = dayPos.format('WW') - init.format('WW');
        let weekItem = this.datasource.items.find((item) => item.sid == weekPos)
        let dayItem = weekItem && weekItem.subItem[dayPos.weekday()]
        
        if (weekItem && dayItem) {
            console.log('Calendar: drag&drop', targetDate, index, weekItem, dayItem, calendarItem);
            weekItem.changes = weekItem.changes + 1;
            calendarItem.date = dayPos;
            dayItem.data.calendarItems.splice(index, 0, calendarItem);
            this._ActionMessageService.simple('Запись перемещена');
        }
    }*/
    
    onCopyDay() {

    }

    onPasteDay(date){
        /**
         * Так как скопировать можно диапазон дней-недель, то целевые дни-недели могут иметь разные даты. Поэтому
         * необходимо отдавать по одному элементу на вставку, так как функция grid.update универсальна и работает в
         * рамках одного дня/недели
         */
        // Для массового копирования/вставки необходимо отсортировать буфер по дате от самой ранней к последней.
        // Разница дат между записями в буфере должна остаться и в целевом дипазоне вставки, для этого отслеживается
        // дата предидущего элемента, на эту разнцу сдвигается дата вставки

        let task = [];
        let previewItem, targetDay = date, shift;

        for (let calendarItem of this.buffer) {
            // Для второй и последующих записей буфера вычисляем смещение в днях для вставки
            if (!!previewItem) {
                shift = moment(calendarItem.date, 'YYYY-MM-DD').diff(moment(previewItem.date,'YYYY-MM-DD'), 'days');
                targetDay = moment(date, 'YYYY-MM-DD').add(shift,'d').format('YYYY-MM-DD');
            }
            // Сразу не выполняем, сохраняем задание для общего запуска и отслеживания статуса
            // task.push(this.grid.update('pasteCalendarItem', calendarItem, {date: targetDay}));
            //                     item.changes = item.changes + 1;
            //                     dayPos = moment(params.date, 'YYYY-MM-DD');
            //                     weekPos = dayPos.format('WW') - init.format('WW');
            //                     calendarItem.date = dayPos; // меняем дату в записи на целевую
            //                     item.subItem[dayPos.weekday()].data.calendarItems.push(calendarItem);
            previewItem = calendarItem;
        }
        // Запускаем выполнение
        Promise.all(task).then(
            () => {
                this.message.toastInfo(`Записи вставлены (${this.buffer.length})`);
                this.buffer = [];
            },
            (error) => {
                console.log('CalendarCtrl: onPasteDay => error=', error);
            }
        );
    }

    /*
    onToggleWeek(week, value) {
        console.error('Calendar: onToggleWeek', week, value);
        return this.scrollAdapter.applyUpdates((item, scope) => {
            try {
                if (item.sid == week) {
                    item.selected = value;
                    for (let i = 0; i < item.subItem.length; i++) {
                        item.subItem[i].selected = value;
                    }
                }
            } catch (error) {
                console.error('Calendar: add activity error ', error);
            }
            return item;
        });
    }*/
}

const Calendar: IComponentOptions = {
    bindings: {
        view: '<',
        user: '<'
    },
    transclude: false,
    controller: CalendarCtrl,
    template: require('./calendar.component.html') as string
};
export default Calendar;