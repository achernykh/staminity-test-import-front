import moment from 'moment/min/moment-with-locales.js';
import { Moment } from 'moment';
import { times } from '../share/utility';
import { IScope, IAnchorScrollService, copy } from 'angular';
import { ICalendarWeek, ICalendarDay } from "./calendar.interface";
import { CalendarService } from "./calendar.service";
import { IUserProfile } from "../../../api/user/user.interface";
import { ICalendarItem } from "@api/calendar";

export class Calendar {

    weeks: Array<ICalendarWeek> = []; //todo rename to weeks
    pos: number;
    range: Array<number>;
    firstWeekComplete: boolean = false;

    // private
    // todo need comment
    private date: Date;
    private readonly dateFormat: string = 'YYYY-MM-DD';
    private currentWeek: ICalendarWeek;

    constructor(
        private $scope: IScope,
        private $anchorScroll: IAnchorScrollService,
        private itemService: CalendarService,
        private owner: IUserProfile,
        private cache?: Array<ICalendarItem>) {

        this.pos = 0;
        this.range = [0,1];
    }

    toDate (date) {
        let week = this.takeWeek(date);
        this.scrollToWeek(week);

        (week.loading || Promise.resolve(week))
            .then(week => setTimeout(() => {
                this.scrollToWeek(week);
            }, 1));
    }

    reset (date: Date) {
        this.date = date;
        this.range = [0, 1];
        this.weeks = [];
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

    scrollToWeek (week) {
        this.setCurrentWeek(week);
        let anchor = 'hotfix' + week.anchor;
        this.$anchorScroll('hotfix' + week.anchor); //todo this is used?
    }

    takeWeek (date) {
        date = moment(date).startOf('week');
        let week = this.weeks.find(w => w.date.isSame(date, 'week'));
        let calendarFirst: Moment = this.weeks[0] && moment(this.weeks[0].date);
        let calendarLast: Moment = this.weeks[0] && moment(this.weeks[this.weeks.length - 1].date);

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

    /**
     * DayItem view model
     * @param date
     * @param calendarItems
     */
    dayItem (date: Moment, calendarItems: Array<ICalendarItem>):ICalendarDay {
        return {
            key: date.format(this.dateFormat),
            selected: false,
            date: date.format(this.dateFormat),
            data: {
                //pos: ++this.pos, //> 7 ? Math.ceil(this.pos / 2) : this.pos,
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
            week: date.format('GGGG-ww'),
            loading: loading,
            height: 180
        };
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
                this.weeks.unshift(week);
                this.firstWeekComplete = true;
                week.loading
                    .then(() => {
                        week.loading = null;
                        this.$scope.$applyAsync();
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
        console.time(`calendar down ${this.range[1]}`);

        let items = times(n)
            .map((i) => i0 + i)
            .map((i) => this.getWeek(moment(this.date).add(i, 'w'), i));

        items.forEach(week => {
                this.weeks.push(week);
                this.firstWeekComplete = true;
                week.loading
                    .then(_ => week.loading = null)
                    .then(_ => console.timeEnd(`calendar down ${this.range[1]}`))
                    .then(_ => this.$scope.$applyAsync())
                    .catch(e => console.log('Calendar loading fail', e));
            });

        return items;
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
                .map(item => Object.assign(item, {index: Number(`${item.calendarItemId}${item.revision}`)}));
            return this.dayItem(date, calendarItems);
        });

        let loading = this.hasCache ?

            this.getItemsFromCache(this.cache, start, end)
                .then(items => {
                    week.subItem = days(items);
                    week.changes++;
                    return week;
                }) :

            this.itemService.getCalendarItem(start.format(this.dateFormat), end.format(this.dateFormat), this.owner.userId)
                .then(items => {
                    week.subItem = days(items);
                    week.changes++;
                    return week;
                });

        let week = this.weekItem(index, start, days([]), loading);
        return week;
    }

    /**
     * Создание записи календаря
     * @param item<ICalendarItem>
     * @param parentId
     */
    post (item: ICalendarItem, parentId?: number): void {
        if (this.include(item.calendarItemId, item.revision)) {
            console.info('post: item already exist');
            return;
        }
        let child: ICalendarItem;
        if (parentId && item.calendarItemType === 'activity') {
            child = copy(item);
            item = this.searchItem(parentId);
            if (!item) { console.error('post: parent not found'); return;}
            this.delete(item);
        }
        let w = this.getWeekSeed(moment(item.dateStart).format('GGGG-ww'));
        let d = moment(item.dateStart).weekday();

        if (w !== -1 && d >= 0 && this.weeks[w]) {
            if (!parentId || item.calendarItemType === 'record') {
                item['index'] = Number(`${item.calendarItemId}${item.revision}`);
                console.info('post: item success', item.calendarItemId, item.revision, item['index'], w);
                this.weeks[w].subItem[d].data.calendarItems.push(item);
            } else {
                item['index'] =  Number(`${item["index"] + 1}`);
                let p = item.calendarItems.findIndex(i => i.calendarItemId === child.calendarItemId);
                p !== -1 ? item.calendarItems.splice(p,1,child) : item.calendarItems.push(child);
                this.weeks[w].subItem[d].data.calendarItems.push(item);
                console.info('post: item with child success', item.calendarItemId, item.revision, item['index']);
                this.$scope.$apply();
            }
            this.weeks[w].changes++;
            this.$scope.$applyAsync();
        } else {
            if (this.hasCache) {
                this.cache.push(item);
                console.info('post: save item to cache', item.calendarItemId, item.revision, item['index']);
            } else {
                console.warn('post: position error');
            }
        }
    }

    /**
     * Проверка наличия итема в календаре
     * @param id
     * @param revision
     * @returns {boolean}
     */
    include (id: number, revision: number): boolean {
        return this.weeks
                .some(w => w.subItem
                    .some(d => d.data.calendarItems
                        .some(i =>i.calendarItemId === id && ((revision && i.revision === revision || !revision))))) ||
            this.weeks
                .some(w => w.subItem
                    .some(d => d.data.calendarItems
                        .some(i => i.calendarItems && i.calendarItems
                            .some(c => c.calendarItemId === id && ((revision && c.revision === revision) || !revision)))));
    }
    /**
     * Удаление записи календаря
     * @param item
     * @param parentId
     */
    delete (item: ICalendarItem, parentId?: number): void {

        let child: ICalendarItem;
        item = !item.hasOwnProperty('calendarItemType') ? this.searchItem(item.calendarItemId) : item;
        parentId = item && item.hasOwnProperty('parentId') && item.parentId || parentId;
        if (parentId && item.calendarItemType === 'activity') {
            child = copy(item);
            item = this.searchItem(parentId);
            if (!item) { console.error('calendar datamodel: delete parent not found'); return;}
        }
        if (!item || !item.hasOwnProperty('dateStart')) {
            console.info(`calendar datamodel: item not found or not exist`);
            return;
        }

        let w = this.getWeekSeed(moment(item.dateStart).format('GGGG-ww'));
        let d = moment(item.dateStart).weekday();
        let p = w !== -1 ? this.weeks[w].subItem[d].data.calendarItems.findIndex(i => i.calendarItemId === item.calendarItemId) : null;

        if (w !== -1 && d >= 0 && p >= 0) {
            if (!parentId || item.calendarItemType === 'record') {
                console.info('calendar datamodel: delete item success');
                this.weeks[w].subItem[d].data.calendarItems.splice(p, 1);
            } else {
                let pos: number = this.weeks[w].subItem[d].data.calendarItems[p].calendarItems.findIndex(c => c.calendarItemId === child.calendarItemId);
                if (pos !== -1) {
                    console.info('calendar datamodel: delete child item success');
                    this.weeks[w].subItem[d].data.calendarItems[p]['index'] ++;
                    this.weeks[w].subItem[d].data.calendarItems[p].calendarItems.splice(pos,1);
                }
            }
            this.weeks[w].changes++;
            this.$scope.$applyAsync();
        } else {
            console.error('calendar datamodel: delete item not found');
        }
    }

    /**
     * Поиск итема по id
     * @param id
     * @returns {ICalendarItem}
     */
    searchItem (id: number): ICalendarItem {

        let include: boolean = false;
        let week: number = null;
        let day: number = null;
        let pos: number = null;
        let child: number = null;

        this.weeks.map((w,wi) => w.subItem.map((d, di) => d.data.calendarItems.map((i,ii) => {
            if (i.calendarItemId === id) {
                include = true;
                week = wi;
                day = di;
                pos = ii;
            }
            if (i.hasOwnProperty('calendarItems') && i.calendarItems && i.calendarItems.some(c => c.calendarItemId === id)) {
                include = true;
                week = wi;
                day = di;
                pos = ii;
                child = i.calendarItems.findIndex(c => c.calendarItemId === id);
            }
        })));
        console.info('calendar datamodel: search result', include, !child, week, day, pos, child);
        return  (include && child !== null && child > -1 && this.weeks[week].subItem[day].data.calendarItems[pos].calendarItems[child]) ||
                (include && child === null && this.weeks[week].subItem[day].data.calendarItems[pos]) || null;
    }

    /**
     * Снять выделение с дней недели
     */
    deselect (): void {
        this.weeks.forEach(w => w.subItem.forEach(d => {
            if(d.selected) {
                d.selected = false;
            }
        }));
    }

    get selectedDaysCount (): number {
        let count: number = 0;
        this.weeks.forEach(w => w.subItem.forEach(d => d.selected && count++));
        return count;
    }

    get firstDaySelected (): string {
        let date: string = null;
        this.weeks.forEach(w => w.subItem.forEach(d => {
            if (d.selected && !date) {
                date = d.date;
            }
        }));
        return date;
    }

    /**
     * Получение индекса недели в массиве календаря
     * @param w - неделя в формате GGGG-ww
     * @returns {number}
     */
    private getWeekSeed( w: string ): number {
        return this.weeks.some(d => d.week === w) ? this.weeks.findIndex(d => d.week === w) : -1;
    }


    private get hasCache (): boolean {
        return !!this.cache;
    }

    private getItemsFromCache (cache: Array<ICalendarItem>, dateStart: Moment, dateFinish: Moment): Promise<Array<ICalendarItem>> {

        /**return Promise.resolve(cache.filter(item =>item && item.hasOwnProperty('dateStart') &&
            moment(item.dateStart).isSameOrAfter(dateStart, 'day') &&
            moment(item.dateStart).isSameOrBefore(dateFinish, 'day'))
            .map(item => Object.assign(item, {index: Number(`${item.calendarItemId}${item.revision}`)})));**/

        return new Promise(resolve => {
            return resolve(cache
                .filter(item =>
                    item && item.hasOwnProperty('dateStart') &&
                    moment(item.dateStart).isSameOrAfter(dateStart, 'day') &&
                    moment(item.dateStart).isSameOrBefore(dateFinish, 'day'))
                .map(item => Object.assign(item, {index: Number(`${item.calendarItemId}${item.revision}`)}))
            );
        });
    }

}