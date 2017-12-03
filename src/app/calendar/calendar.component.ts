import { copy, IAnchorScrollService, IComponentController, IComponentOptions, ILocationService, IRootScopeService, IScope} from "angular";
import moment from "moment/min/moment-with-locales.js";
import { Subject } from "rxjs/Subject";
import {ICalendarItem, IUserProfile} from "../../../api";
import {SessionService} from "../core";
import DisplayService from "../core/display.service";
import {IMessageService} from "../core/message.service";
import { times } from "../share/util.js";
import {TrainingPlan} from "../training-plans/training-plan/training-plan.datamodel";
import "./calendar.component.scss";
import { Calendar } from "./calendar.datamodel";
import { getItemById, prepareItem } from "./calendar.functions";
import { ICalendarDay, ICalendarDayData, ICalendarWeek } from "./calendar.interface";
import {CalendarService} from "./calendar.service";

export class CalendarCtrl implements IComponentController {

    static $inject = ["$scope", "$mdDialog", "$rootScope", "$anchorScroll", "$location", "message",
        "CalendarService", "SessionService", "dialogs", "DisplayService"];
    user: IUserProfile; // calendar owner
    private weekdayNames: number[] = [];
    private buffer: ICalendarItem[] = [];
    private firstSrcDay: string;
    private dateFormat: string = "YYYY-MM-DD";
    private date: Date;
    private range: number[] = [0, 1];
    //private calendar: Array<ICalendarWeek> = [];
    private calendar: Calendar;
    private currentWeek: ICalendarWeek;
    private lockScroll: boolean;
    currentUser: IUserProfile;

    constructor(
        private $scope: IScope,
        private $mdDialog: any,
        private $rootScope: IRootScopeService,
        private $anchorScroll: IAnchorScrollService,
        private $location: ILocationService,
        private message: IMessageService,
        private CalendarService: CalendarService,
        private session: SessionService,
        private dialogs: any,
        private display: DisplayService,
    ) {

    }

    $onInit() {
        this.calendar = new Calendar(this.$scope, this.$anchorScroll, this.CalendarService, this.user);
        this.calendar.toDate(new Date());
        //let date = moment(this.$location.hash());
        this.currentUser = this.session.getUser();
        //this.toDate(date.isValid()? date.toDate() : new Date());

        this.CalendarService.item$
            .filter((message) => message.value.hasOwnProperty("userProfileOwner") &&
                message.value.userProfileOwner.userId === this.user.userId)
            .map((message) => {
                console.log("new calendar message: ", message);
                message.value.index = Number(`${message.value.calendarItemId}${message.value.revision}`);
                return message; })
            .subscribe((message) => {
                switch (message.action) {
                    case "I": {
                        this.onPostItem(message.value as ICalendarItem);
                        this.$scope.$applyAsync();
                        break;
                    }
                    case "D": {
                        this.onDeleteItem(message.value as ICalendarItem);
                        this.$scope.$applyAsync();
                        break;
                    }
                    case "U": {
                        this.onDeleteItem(getItemById(this.calendar.weeks, message.value.calendarItemId));
                        this.onPostItem(message.value as ICalendarItem);
                        this.$scope.$applyAsync();
                        break;
                    }
                }
            });

        this.weekdayNames = moment.weekdays(true);
    }

    /**
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
    } **/

    /**
     * DayItem view model
     * @param date
     * @param calendarItems
     */ /**
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
    }**/

    /**
     * WeekItem view model
     * @param index
     * @param date - дата начала недели
     * @param days : DayItem[]
     */ /**
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
    } **/

    /**
     * Предоставляет объекты WeekItem
     * @param date - любой Datetime недели
     * @param index - позиция в списке
     */ /**
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
    } **/

    /**
     * Подгрузка n записей вверх
     * @param n
     */ /**
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
    }**/

    /**
     * Подгрузка n записей вниз
     * @param n
     */ /**
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
    }**/

    onAddActivity($event) {
        this.$mdDialog.show({
            controller: DialogController,
            controllerAs: "$ctrl",
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
                user: this.user,
            },
            //resolve: {
            //    details: () => this.ActivityService.getDetails(data.activityHeader.activityId)
            //        .then(response => response, error => console.error(error))
            //},
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: false,
            fullscreen: true,
        })
            .then((response) => {
                if (response.type === "post") {
                    console.log("save activity", response);
                    //this.calendar.onPostItem(response.item);
                    //this.message.toastInfo('Создана новая запись');
                }
            }, () => {
                console.log("user cancel dialog");
            });
    }

    onAddMeasurement($event) {
        this.$mdDialog.show({
            controller: DialogController,
            controllerAs: "$ctrl",
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
                    date: new Date(), // дата дня в формате ГГГГ-ММ-ДД
                },
                user: this.user,
            },
            bindToController: true,
            clickOutsideToClose: true,
            escapeToClose: true,
            fullscreen: true,

        })
            .then((response) => {
                if (response.type === "post") {
                    //this.calendar.onPostItem(response.item)
                    //this.message.toastInfo('Создана новая запись');
                }

            }, () => {
                console.log("user cancel dialog");
            });
    }

    onAddEvent($event, data) {
        this.$mdDialog.show({
            controller: DialogController,
            controllerAs: "$ctrl",
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
                    date: new Date(), // дата дня в формате ГГГГ-ММ-ДД
                },
                user: this.user,
            },
            bindToController: true,
            clickOutsideToClose: true,
            escapeToClose: true,
            fullscreen: true,

        })
            .then((response) => {
                console.log("user close dialog with =", response);

            }, () => {
                console.log("user cancel dialog, data=", data);
            });
    }

    /**
     * Создание записи календаря
     * @param item<ICalendarItem>
     */
    onPostItem(item) {
        const w = this.getDayIndex(moment(item.dateStart).format("GGGG-WW"));
        const d = moment(item.dateStart).weekday();

        if (w !== -1 && d >= 0) {
            this.calendar.weeks[w].subItem[d].data.calendarItems.push(item);
            this.calendar.weeks[w].changes++;
        }
    }

    /**
     * Удаление записи календаря
     * @param item
     */
    onDeleteItem(item) {
        const w = this.getDayIndex(moment(item.dateStart).format("GGGG-WW"));
        const d = moment(item.dateStart).weekday();
        const p = this.calendar.weeks[w].subItem[d].data.calendarItems.findIndex((i) => i.calendarItemId === item.calendarItemId);

        if (w !== -1 && d >= 0 && p !== -1) {
            this.calendar.weeks[w].subItem[d].data.calendarItems.splice(p, 1);
            this.calendar.weeks[w].changes++;
        }
    }

    onFileUpload() {
        this.dialogs.uploadFile()
            .then((file) => this.CalendarService.postFile(file, null))
            .then((response) => this.message.toastInfo(response), (error) => this.message.toastInfo(error));
    }

    /**
     * Получение индекса недели в массиве календаря
     * @param w - неделя в формате GGGG-WW
     * @returns {number}
     */
    getDayIndex(w) {
        return this.calendar.weeks.findIndex((item) => item.week === w);
    }

    onCopy(items: ICalendarItem[]) {
        this.buffer = [];
        this.firstSrcDay = null;

        if (items) {
            this.buffer.push(...copy(items));
            this.firstSrcDay = moment(items[0].dateStart).format("YYYY-MM-DD");
        } else {
            this.calendar.weeks.forEach((w) => w.subItem.forEach((d) => {
                if (d.selected) {
                    if (!this.firstSrcDay) {
                        this.firstSrcDay = d.data.date;
                    }
                    if (d.data.calendarItems && d.data.calendarItems.length > 0) {
                        this.buffer.push(...copy(d.data.calendarItems));
                    }
                }
            }));
        }
        if (this.buffer && this.buffer.length > 0) {
            this.message.toastInfo("itemsCopied");
        }
    }

    onPaste(firstTrgDay: string) {
        const shift = moment(firstTrgDay, "YYYY-MM-DD").diff(moment(this.firstSrcDay, "YYYY-MM-DD"), "days");
        let task: Array<Promise<any>> = [];

        if (shift && this.buffer && this.buffer.length > 0) {
            task = this.buffer
                .filter((item) => item.calendarItemType === "activity" && item.activityHeader.intervals.some((interval) => interval.type === "pW"))
                .map((item) => this.CalendarService.postItem(prepareItem(item, shift)));
            Promise.all(task)
                .then(() => this.message.toastInfo("itemsPasted"), (error) => this.message.toastError(error))
                .then(() => this.clearBuffer()); ;
        }

    }

    onPostPlan(env: Event) {
        this.$mdDialog.show({
            controller: ["$scope", "$mdDialog", ($scope, $mdDialog) => {
                $scope.hide = () => $mdDialog.hide();
                $scope.cancel = () => $mdDialog.cancel();
                $scope.answer = (chart, update) => $mdDialog.hide({chart, update});
            }],
            controllerAs: "$ctrl",
            template:
                `<md-dialog id="training-plan-form" aria-label="Training Plan Form">
                        <training-plan-form
                                layout="column" layout-fill class="training-plan-form"
                                mode="post"
                                plan="$ctrl.plan"
                                on-cancel="cancel()" on-save="answer(chart, update)">
                        </training-plan-form>
                   </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: env,
            locals: {
                plan: new TrainingPlan({
                    isPublic: false,
                    calendarItems: this.buffer,
                }),
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: true,
            fullscreen: true,

        }).then((response) => {}, () => {});
    }

    onDelete(items: ICalendarItem[]) {
        const selected: ICalendarItem[] = [];

        this.calendar.weeks.forEach((w) => w.subItem.forEach((d) => {
            if (d.selected && d.data.calendarItems && d.data.calendarItems.length > 0) {
                selected.push(...d.data.calendarItems);
            }
        }));

        const inSelection: boolean = (selected && selected.length > 0) && selected.some((s) => items.some((i) => i.calendarItemId === s.calendarItemId));

        this.dialogs.confirm({ text: "dialogs.deletePlanActivity" })
        .then(() => this.CalendarService.deleteItem("F", inSelection ? selected.map((item) => item.calendarItemId) : items.map((item) => item.calendarItemId)))
        .then(() => this.message.toastInfo("itemsDeleted"), (error) => error && this.message.toastError(error))
        .then(() => inSelection && this.clearBuffer());
    }

    clearBuffer() {
        this.buffer = [];
        this.firstSrcDay = null;
        this.calendar.weeks.forEach((w) => w.subItem.forEach((d) => {
            if (d.selected) {
                d.selected = false;
            }
        }));
    }

    /**
     * Диапазон дат от начала загруженного календаря до окончания
     * @returns {any[]}
     */
    get calendarRange(): string[] {
        return [
            this.calendar.weeks[0].date.format(this.dateFormat),
            this.calendar.weeks[this.calendar.weeks.length - 1].date.add("days", 6).format(this.dateFormat),
        ];
    }

}

const CalendarComponent: IComponentOptions = {
    bindings: {
        view: "<",
        user: "<",
    },
    transclude: false,
    controller: CalendarCtrl,
    template: require("./calendar.component.html") as string,
};
export default CalendarComponent;

function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        console.log("cancel");
        $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
}
DialogController.$inject = ["$scope", "$mdDialog"];
