import { IAnchorScrollService, IScope } from "angular";
import moment from "moment/min/moment-with-locales.js";
import { IUserProfile } from "../../../api/user/user.interface";
import { times } from "../share/util.js";
import { ICalendarDay, ICalendarWeek } from "./calendar.interface";
import { CalendarService } from "./calendar.service";

export class Calendar {

    weeks: ICalendarWeek[] = []; //todo rename to weeks
    pos: number = 0;

    // private
    // todo need comment
    private date: Date;
    private readonly dateFormat: string = "YYYY-MM-DD";
    private range: number[] = [0, 1];
    private currentWeek: ICalendarWeek;

    constructor(
        private $scope: IScope,
        private $anchorScroll: IAnchorScrollService,
        private calendarService: CalendarService,
        private owner: IUserProfile) {

    }

    toDate(date) {
        const week = this.takeWeek(date);
        this.scrollToWeek(week);

        (week.loading || Promise.resolve(week))
            .then((week) => setTimeout(() => {
                this.scrollToWeek(week);
            }, 1));
    }

    reset(date: Date) {
        this.date = date;
        this.range = [0, 1];
        this.weeks = [];
        this.currentWeek = {} as ICalendarWeek;
        return this.up();
    }

    setCurrentWeek(week) {
        if (this.currentWeek !== week) {
            this.currentWeek = week;
            //this.$location.hash(week.anchor).replace();
        }
    }

    toPrevWeek() {
        this.toDate(moment(this.currentWeek.date).add(-1, "week"));
    }

    toNextWeek() {
        this.toDate(moment(this.currentWeek.date).add(1, "week"));
    }

    toCurrentWeek() {
        this.toDate(moment().startOf("week"));
    }

    scrollToWeek(week) {
        this.setCurrentWeek(week);
        const anchor = "hotfix" + week.anchor;
        this.$anchorScroll("hotfix" + week.anchor); //todo this is used?
    }

    takeWeek(date) {
        date = moment(date).startOf("week");
        const week = this.weeks.find((w) => w.date.isSame(date, "week"));
        const calendarFirst = this.weeks[0] && moment(this.weeks[0].date);
        const calendarLast = this.weeks[0] && moment(this.weeks[this.weeks.length - 1].date);

        if (week) {
            return Promise.resolve(week);
        } else if (calendarFirst && calendarFirst.add(- 1, "w").isSame(date, "date")) {
            return this.up() [0];
        } else if (calendarLast && calendarLast.add(1, "w").isSame(date, "date")) {
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
    dayItem(date, calendarItems): ICalendarDay {
        //debugger;
        //console.log('dayItem',date.utc(),date.utc().add(moment().utcOffset(),'minutes').format());
        return {
            key: date.format(this.dateFormat),
            selected: false,
            date: date.format(this.dateFormat),
            data: {
                pos: ++this.pos,
                title: date.format("DD"),
                month: date.format("MMM"),
                day: date.format("dd"),
                date: date.format(), //date.utc().add(moment().utcOffset(),'minutes').format(),
                calendarItems,
            },
        };
    }

    /**
     * WeekItem view model
     * @param index
     * @param date - дата начала недели
     * @param days : DayItem[]
     */
    weekItem(index, date, days, loading): ICalendarWeek {
        return {
            sid: index,
            date,
            anchor: date.format("YYYY-MM-DD"),
            changes: 0,
            toolbarDate: date.format("YYYY MMMM"),
            selected: false,
            subItem: days,
            week: date.format("GGGG-WW"),
            loading,
            height: 180,
        };
    }

    /**
     * Подгрузка n записей вверх
     * @param n
     */
    up(n = 1) {
        const i0 = this.range[0];
        this.range[0] -= n;

        const items = times(n)
            .map((i) => i0 - i)
            .map((i) => this.getWeek(moment(this.date).add(i, "w"), i));

        items
            .map((week) => {
                this.weeks.unshift(week);
                week.loading
                    .then(() => {
                        week.loading = null;
                        this.$scope.$apply();
                    })
                    .catch((exc) => { console.log("Calendar loading fail", exc); });
            });

        return items;
    }

    /**
     * Подгрузка n записей вниз
     * @param n
     */
    down(n = 1) {
        const i0 = this.range[1];
        this.range[1] += n;

        const items = times(n)
            .map((i) => i0 + i)
            .map((i) => this.getWeek(moment(this.date).add(i, "w"), i));

        items
            .forEach((week) => {
                this.weeks.push(week);
                week.loading
                    .then(() => {
                        week.loading = null;
                        this.$scope.$apply();
                    })
                    .catch((exc) => { console.log("Calendar loading fail", exc); });
            });

        return items;
    }

    /**
     * Предоставляет объекты WeekItem
     * @param date - любой Datetime недели
     * @param index - позиция в списке
     */
    getWeek(date, index) {
        const start = moment(date).startOf("week");
        const end = moment(start).add(6, "d");

        const days = (items) => times(7).map((i) => {
            const date = moment(start).add(i, "d");
            const calendarItems = items
                .filter((item) => moment(item.dateStart, this.dateFormat).weekday() === i)
                .map((item) => {
                    //if(item.calendarItemType === 'activity') {
                    item.index = Number(`${item.calendarItemId}${item.revision}`);
                    //}
                    return item;
                });

            return this.dayItem(date, calendarItems);
        });

        const loading = this.calendarService.getCalendarItem(start.format(this.dateFormat), end.format(this.dateFormat), this.owner.userId)
            .then((items) => {
                week.subItem = days(items);
                week.changes++;
                return week;
            });

        const week = this.weekItem(index, start, days([]), loading);

        return week;
    }

}
