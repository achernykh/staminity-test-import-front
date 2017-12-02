import {copy, IComponentController, IComponentOptions, IPromise, IScope} from "angular";
import moment from "moment/min/moment-with-locales.js";
import {
    ICalendarItem,
    IGroupManagementProfile, ITrainingZonesType,
    IUserManagementProfile, IUserProfile, IUserProfileShort,
} from "../../../api";
import {Activity} from "../activity/activity.datamodel";
import {changeUserOwner, clearActualDataActivity, shiftDate, updateIntensity} from "../activity/activity.function";
import {CalendarService} from "../calendar/calendar.service";
import {SessionService, StorageService} from "../core";
import {IMessageService} from "../core/message.service";
import { times } from "../share/util.js";
import "./dashboard.component.scss";

const getItemById = (cache: IDashboardWeek[], id: number): ICalendarItem => {
    let findData: boolean = false;
    let w, d, c, i: number = 0;

    for (w = 0; w < cache.length; w++) {
        for (c = 0; c < cache[w].calendar.length; c++) {
            for (d = 0; d < cache[w].calendar[c].subItem.length; d++) {
                i = cache[w].calendar[c].subItem[d].data.calendarItems.findIndex((item) => item.calendarItemId === id);
                if (i !== -1) {
                    findData = true;
                    break;
                }
            }
            if (findData) {
                break;
            }
        }
        if (findData) {
            break;
        }
    }
    return findData && cache[w].calendar[c].subItem[d].data.calendarItems[i] || null;
};

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
        calendarItems: ICalendarItem[];
    };
    date: Date;
    selected: boolean;
}

export class DashboardCtrl implements IComponentController {

    public coach: IUserProfile;
    public groupId: number;
    public athletes: IGroupManagementProfile;

    private cache: IDashboardWeek[];
    private dashboard: IDashboardWeek;

    private dateFormat: string = "YYYY-MM-DD";
    private currentDate: Date = new Date();
    private currentWeek: number = 0;
    private weekdayNames: string[] = [];
    private selectedAthletes: number[] = [];
    private viewAthletes: number[] = [];
    private orderAthletes: number[] = [];
    private buffer: ICalendarItem[] = [];
    private firstSrcDay: string;

    public static $inject = ["$scope", "$mdDialog", "CalendarService", "SessionService", "message", "storage", "dialogs"];

    constructor(
        private $scope: IScope,
        private $mdDialog: any,
        private calendar: CalendarService,
        private session: SessionService,
        private message: IMessageService,
        private storage: StorageService,
        private dialogs: any) {

    }

    public toolbarDate() {
        return new Date(moment(this.currentDate).format(this.dateFormat));
    }

    public changeOrder(up: boolean) {
        const from: number[] = this.selectedAthletes.map((a) => this.orderAthletes.indexOf(a));
        const to: number[] = from.map((a) => up ?
            this.orderAthletes.indexOf(this.viewAthletes[this.viewAthletes.indexOf(this.orderAthletes[a]) - 1]) :
            this.orderAthletes.indexOf(this.viewAthletes[this.viewAthletes.indexOf(this.orderAthletes[a]) + 1]));

        if ((up && this.viewAthletes.indexOf(this.orderAthletes[from[0]]) === 0) ||
            (!up && this.viewAthletes.indexOf(this.orderAthletes[from[0]]) === this.viewAthletes.length - 1)) {
            return;
        }

        from.forEach((pos, i) => {
            const temp: number = this.orderAthletes[to[i]];
            this.orderAthletes[to[i]] = this.orderAthletes[pos];
            this.orderAthletes[pos] = temp;
        });

        this.viewAthletes.sort((a, b) => this.orderAthletes.indexOf(a) - this.orderAthletes.indexOf(b));

        this.storage.set("dashboard_orderAthletes", this.orderAthletes);
        this.storage.set("dashboard_viewAthletes", this.viewAthletes);

    }

    public isVisible(id: number) {
        return this.viewAthletes.indexOf(id) !== -1;
    }

    public setVisible(view: boolean, id: number) {
        const ind: number = this.viewAthletes.indexOf(id);
        if (view) {
            this.viewAthletes.push(id);
        } else {
            this.viewAthletes.splice(ind, 1);
        }
        this.storage.set("dashboard_viewAthletes", this.viewAthletes);
    }

    public onSelectAthlete(select: boolean, id: number) {
        const ind: number = this.selectedAthletes.indexOf(id);
        if (select) {
            this.selectedAthletes.push(id);
        } else {
            this.selectedAthletes.splice(ind, 1);
        }
        this.storage.set("dashboard_selectedAthletes", this.selectedAthletes);
    }

    public $onInit() {
        this.cache = [];
        this.currentWeek = 0;
        this.currentDate = moment().startOf("week");
        this.getData(this.currentDate);

        this.viewAthletes = this.storage.get("dashboard_viewAthletes") || this.athletes.members.map((p) => p.userProfile.userId);
        this.orderAthletes = this.storage.get("dashboard_orderAthletes") || this.athletes.members.map((p) => p.userProfile.userId);
        this.selectedAthletes = this.storage.get("dashboard_selectedAthletes") || [];

        this.$scope.filter = (calendar) => {
            return this.isVisible(calendar.profile.userId);
        };

        this.$scope.order = (calendar) => {
            return this.orderAthletes.indexOf(calendar.profile.userId);
        };

        this.athletes.members.forEach((p) => {
            p.view = this.isVisible(p.userProfile.userId);
            p.order = (this.orderAthletes.indexOf(p.userProfile.userId) + 1) * 100;
        });

        this.calendar.item$
            .filter((message) => message.value.hasOwnProperty("userProfileOwner") &&
                this.athletes.members.some((member) => member.userProfile.userId === message.value.userProfileOwner.userId))
            .map((message) => {
                message.value.index = Number(`${message.value.calendarItemId}${message.value.revision}`);
                return message;
            })
            .subscribe((message) => {
                switch (message.action) {
                    case "I": {
                        this.onPostItem(message.value as ICalendarItem);
                        this.$scope.$apply();
                        break;
                    }
                    case "D": {
                        this.onDeleteItem(message.value as ICalendarItem);
                        this.$scope.$apply();
                        break;
                    }
                    case "U": {
                        this.onDeleteItem(getItemById(this.cache, message.value.calendarItemId));
                        this.onPostItem(message.value as ICalendarItem);
                        this.$scope.$apply();
                        break;
                    }
                }
            });

    }

    public next() {
        this.currentWeek++;
        this.currentDate = moment(this.currentDate).startOf("week").add(1, "w");
        this.getData(this.currentDate);
    }

    public prev() {
        this.currentWeek--;
        this.currentDate = moment(this.currentDate).startOf("week").add(-1, "w");
        this.getData(this.currentDate);
    }

    public getData(date) {

        console.log("getDate", date.format("YYYY-MM-DD"));
        const start = moment(date).startOf("week");
        const end = moment(start).add(6, "d");
        this.weekdayNames = times(7).map((i) => moment(date).startOf("week").add(i, "d").format("ddd DD"));

        if (this.cache.some((d) => d.sid === this.currentWeek)) {
            this.dashboard = this.cache.filter((d) => d.sid === this.currentWeek)[0];
            //this.$scope.$apply();
        } else {
            this.calendar.getCalendarItem(start.format(this.dateFormat), end.format(this.dateFormat), null, this.groupId)
                .then((response: ICalendarItem[]) => {
                    this.cache.push({
                        sid: this.currentWeek,
                        week: moment(start).format("GGGG-WW"),
                        calendar: this.athletes.members.map((athlete) => ({
                            profile: athlete.userProfile,
                            subItem: times(7).map((i) => ({
                                data: {
                                    calendarItems: [],
                                },
                                date: moment(start).add(i, "day").format(this.dateFormat),
                                selected: false,
                            })),
                            changes: 0,
                        })),
                    });
                    response.map((item) => {
                        //if(item.calendarItemType === 'activity') {
                            item.index = Number(`${item.calendarItemId}${item.revision}`);
                        //}

                            const sidId = this.cache.findIndex((d) => d.sid === this.currentWeek);
                            const calendarId = this.cache[sidId].calendar.findIndex((c) => c.profile.userId === item.userProfileOwner.userId);

                            if (calendarId !== -1) {
                            // Добавляем записи календаря в соответсвующий день дэшборда
                            this.cache[sidId].calendar[calendarId]
                                .subItem[moment(item.dateStart, this.dateFormat).weekday()].data.calendarItems.push(item);
                            // Сигнализируем об изменение итогов
                            this.cache[sidId].calendar[calendarId].changes ++;
                        }
                    });
                    this.dashboard = this.cache.filter((d) => d.sid === this.currentWeek)[0];
                    this.$scope.$apply();
                }, (error) => console.error(error));
        }
    }

    /**
     * Создание записи календаря
     * @param item
     */
    public onPostItem(item: ICalendarItem) {

        const id: string = moment(item.dateStart).format("GGGG-WW");
        const w: number = this.cache.findIndex((d) => d.week === id);
        const c: number = this.cache[w].calendar.findIndex((c) => c.profile.userId === item.userProfileOwner.userId);
        const d: number = moment(item.dateStart).weekday();

        this.cache[w].calendar[c].subItem[d].data.calendarItems.push(item);
        this.cache[w].calendar[c].changes++;
    }

    /**
     * Удаление записи календаря
     * @param item
     */
    public onDeleteItem(item: ICalendarItem) {

        const id: string = moment(item.dateStart).format("GGGG-WW");
        const w: number = this.cache.findIndex((d) => d.week === id);
        const c: number = this.cache[w].calendar.findIndex((c) => c.profile.userId === item.userProfileOwner.userId);
        const d: number = moment(item.dateStart).weekday();
        const p: number = this.cache[w].calendar[c].subItem[d].data.calendarItems.findIndex((i) => i.calendarItemId === item.calendarItemId);

        this.cache[w].calendar[c].subItem[d].data.calendarItems.splice(p, 1);
        this.cache[w].calendar[c].changes++;
    }

    public onCopy(items: ICalendarItem[]) {
        this.buffer = [];
        this.firstSrcDay = null;

        if (items) {
            this.buffer.push(...copy(items));
            this.firstSrcDay = moment(items[0].dateStart).format("YYYY-MM-DD");
        } else {
            this.cache.forEach((w) => w.calendar.forEach((a) => a.subItem.forEach((d) => {
                if (d.selected) {
                    if (!this.firstSrcDay) {
                        this.firstSrcDay = moment(d.date).format("YYYY-MM-DD");
                    }
                    if (d.data.calendarItems && d.data.calendarItems.length > 0) {
                        this.buffer.push(...copy(d.data.calendarItems));
                    }
                }
            })));
        }
        if (this.buffer && this.buffer.length > 0) {
            this.message.toastInfo("itemsCopied");
            this.unSelect();
        }
    }

    public onPaste(firstTrgDay: string, athlete: IUserProfile) {
        const shift = moment(firstTrgDay, "YYYY-MM-DD").diff(moment(this.firstSrcDay, "YYYY-MM-DD"), "days");
        const updateZones: boolean = false;

        if (this.buffer && this.buffer.length > 0) {
            if (this.buffer.some((i) => i.userProfileOwner.userId !== athlete.userId)) {
                this.dialogs.confirm({ text: "dialogs.updateIntensity" })
                    .then(() => this.buffer.map((i) => updateIntensity(i, athlete.trainingZones)))
                    .then(() => this.buffer.map((i) => changeUserOwner(i, athlete)))
                    .then(() => this.onProcessPaste(shift));
            } else if (shift) {
                this.onProcessPaste(shift);
            }
        }
    }

    public onProcessPaste(shift: number) {

        let task: Array<Promise<any>> = [];
        task = this.buffer
            .filter((item) => item.calendarItemType === "activity" && item.activityHeader.intervals.some((interval) => interval.type === "pW"))
            .map((item) => this.calendar.postItem(clearActualDataActivity(shiftDate(item, shift))));

        Promise.all(task)
            .then(() => this.message.toastInfo("itemsPasted"), (error) => this.message.toastError(error))
            .then(() => this.clearBuffer()); ;

    }

    public onDelete(items: ICalendarItem[] = []) {
        const selected: ICalendarItem[] = [];
        this.cache
            .forEach((w) => w.calendar
                .forEach((a) => a.subItem
                    .forEach((d) => (d.selected && d.data.calendarItems && d.data.calendarItems.length > 0) &&
                        selected.push(...d.data.calendarItems))));

        const inSelection: boolean = (selected && selected.length > 0) && selected.some((s) => items.some((i) => i.calendarItemId === s.calendarItemId));

        this.dialogs.confirm({ text: "dialogs.deletePlanActivity" })
            .then(() => this.calendar.deleteItem("F", inSelection ? selected.map((item) => item.calendarItemId) : items.map((item) => item.calendarItemId)))
            .then(() => this.message.toastInfo("itemsDeleted"), (error) => error && this.message.toastError(error))
            .then(() => inSelection && this.clearBuffer());
    }

    public clearBuffer() {
        this.buffer = [];
        this.firstSrcDay = null;
        this.unSelect();
    }

    public unSelect() {
        this.cache.forEach((d) => d.calendar.forEach((w) => w.subItem.forEach((d) => d.selected && (d.selected = false))));
    }

    public onOpen($event, mode, data) {
        this.$mdDialog.show({
            controller: DialogController,
            controllerAs: "$ctrl",
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
                data,
                mode,
                user: this.coach,
            },
            /*resolve: {
             details: () => this.ActivityService.getDetails(this.data.activityHeader.activityId)
             .then(response => response, error => console.error(error))
             },*/
            bindToController: true,
            clickOutsideToClose: true,
            escapeToClose: true,
            fullscreen: true,

        })
            .then((response) => {
                console.log("user close dialog with =", response);

                // При изменение записи сначала удаляем старую, потом создаем новую
                if (response.type === "put") {
                    //this.calendar.onDeleteItem(this.data)
                    //this.calendar.onPostItem(response.item)
                    //this.message.toastInfo('Изменения сохранены')
                }

                if (response.type === "delete") {
                    //this.calendar.onDeleteItem(response.item)
                    //this.message.toastInfo('Запись удалена')
                }

            }, () => {
                console.log("user cancel dialog, data=");
            });
    }

    public onSelectWeek(select: boolean, id: number) {

    }

}

const DashboardComponent: IComponentOptions = {
    bindings: {
        coach: "<",
        groupId: "<",
        athletes: "<",
    },
    require: {
        //component: '^component'
    },
    controller: DashboardCtrl,
    template: require("./dashboard.component.html") as string,
};

export default DashboardComponent;

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
