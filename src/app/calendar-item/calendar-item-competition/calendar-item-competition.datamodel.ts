import { CalendarItem } from "../calendar-item.datamodel";
import { ICompetitionHeader, ICalendarItem } from "../../../../api/calendar/calendar.interface";
import { ICalendarItemDialogOptions } from "../calendar-item-dialog.interface";
import { ICompetitionStageConfig } from "./calendar-item-competition.config";
import { Activity } from "../../activity/activity-datamodel/activity.datamodel";
import { profileShort } from "../../core/user.function";
import { getType } from "../../activity/activity.constants";
import { ActivityInterval } from "../../activity/activity-datamodel/activity.interval";
import { ActivityIntervalPW } from "../../activity/activity-datamodel/activity.interval-pw";
import { FormMode } from "../../application.interface";
import { toDay } from "../../activity/activity.datamodel";
import { IActivityIntervalPW } from "../../../../api/activity/activity.interface";

const sortAsc = (a: number, b: number): number => a < b ? -1: 1;
const sortDsc = (a: number, b: number): number => a > b ? -1: 1;

export interface CompetitionItems {
    item: Activity;
    dirty: boolean;
}

export class CalendarItemCompetition extends CalendarItem {

    competitionHeader: ICompetitionHeader;
    items: Array<CompetitionItems>;
    calendarItems: Array<ICalendarItem>; // массив вложенных тренировок

    //private
    private readonly statusLimit: { warn: number, error: number} = { warn: 10, error: 20 };

    constructor (private item: ICalendarItem, private options: ICalendarItemDialogOptions) {
        super(item, options);
        this.prepare();
    }

    /**set dateStart(value: Date) {

    }**/

    prepare (): void {
        super.prepare();
        // записи собраны на стороне бэка
        if (this.calendarItems && this.calendarItems.length) {
            this.items = [];
            this.calendarItems.map(i => this.items.push({ dirty: false, item: new Activity(i, this.options)}));
        }
        // записи собраны на стороне фронта
        else if (this.items && this.items.length) {
            this.items = this.items.map(i => ({ dirty: false, item: new Activity(i.item, this.options)}));
        }

        if (this.items && this.items.length) {
            this.items.sort((a,b) =>
                sortAsc(a.item.activityHeader.competitionStagePosition,b.item.activityHeader.competitionStagePosition));
        }
    }

    setDate (date: Date): void {
        if (this.items) {
            this.items.forEach((s,i) => this.items[i] = {
                dirty: true,
                item: Object.assign(s.item, {_dateStart: date, _dateEnd: date})
            });
        }
    }

    setParentId (id: number = this.calendarItemId) {
        this.items.map(i => i.item.parentId = id);
    }

    setItems(template: Array<ICompetitionStageConfig>, options: ICalendarItemDialogOptions = this.options) {
        this.items = [];
        if (!template || template.length === 0) { return; }
        template.map((t,i) => {
           let activity: Activity = new Activity({
               calendarItemId: null,
               calendarItemType: 'activity',
               revision: null,
               dateStart: options.dateStart,
               dateEnd: options.dateStart,
               activityHeader: {
                   activityType: getType(t.activityTypeId),
                   activityCategory: options.activityCategory || null,
                   intervals: []
               },
               userProfileOwner: profileShort(options.owner),
               userProfileCreator: profileShort(options.currentUser),
               groupProfile: options.groupCreator
           }, this.options);
            // удаляем плановый интервал
            activity.intervals.splice('pW');
           // создаем плановый интервал
            let interval: ActivityIntervalPW = new ActivityIntervalPW('pW', Object.assign({type: 'pW'}, t));
            activity.intervals.add([interval]);
            activity.header.competitionStagePosition = i;
            this.items.push({dirty: false, item: activity});
        });
    }

    build (): ICalendarItem {
        super.package();
        let item: ICalendarItem = Object.assign({}, this);
        this.items.map(i => {
            let pW: IActivityIntervalPW = i.item.intervals.PW;
            if (pW && pW.distanceLength && pW.durationValue === 0) {
                pW.durationValue = pW.distanceLength;
                pW.durationMeasure = 'distance';
            }
            if (pW && pW.movingDurationLength && pW.durationValue === 0) {
                pW.durationValue = pW.movingDurationLength;
                pW.durationMeasure = 'movingDuration';
            }
        });
        //item.calendarItems = this.items.map(i => new Activity(i.item, this.options));
        ['item', 'items', 'calendarItems', 'options', 'statusLimit', 'athletes', 'auth', 'view','_dateStart','_dateEnd']
            .map(k => item.hasOwnProperty(k) && delete item[k]);
        return item;
    }

    get status (): string {
        return !this.isToday ?
            // приоритетов статусов для дыты = сегодня;
            (this.isComing && 'coming') ||
            (!this.isSpecified && 'not-specified') ||
            (!this.isCompleted && 'dismiss') ||
            ((Math.abs(100-this.percent) <= this.statusLimit.warn && this.percent > 0) && 'complete') ||
            ((Math.abs(100-this.percent) <= this.statusLimit.error && this.percent > 0) && 'complete-warn') ||
            ((Math.abs(100-this.percent) > this.statusLimit.error && this.percent > 0)  && 'complete-error') :
            // приоритетов статусов дада != сегодня
            ((Math.abs(100-this.percent) <= this.statusLimit.warn && this.percent > 0) && 'complete')
            || ((Math.abs(100-this.percent) <= this.statusLimit.error && this.percent > 0)  && 'complete-warn')
            || ((Math.abs(100-this.percent) > this.statusLimit.error && this.percent > 0)  && 'complete-error')
            || (!this.isSpecified && 'not-specified')
            || (this.isComing && 'coming');
    }

    get isSpecified (): boolean {
        return this.items && this.items.some(i => i.item.intervals.PW && i.item.intervals.PW.specified());
    }

    get isToday (): boolean {
        return this.items && this._dateStart.getTime() === toDay(new Date()).getTime();
    }

    get isComing (): boolean {
        return (this.options && this.options.hasOwnProperty('trainingPlanMode') && this.options.trainingPlanMode) ||
            (this.options && this.options.hasOwnProperty('templateMode') && this.options.templateMode) ||
            this._dateStart.getTime() >= toDay(new Date()).getTime();
    }

    get isCompleted (): boolean {
        return this.items && this.items.some(i => i.item.isCompleted);
    }

    get percent (): number {
        if (!this.items) { return null; }
        let percent: number = null;
        this.items.map(i => percent = percent + i.item.percent);
        return this.isCompleted && percent / this.items.length || null;

    }

    get sportBasic (): string {
        return this.competitionHeader.type;
    }

    get movingDuration (): number {
        if (!this.items) { return null; }
        let sum: number = 0;
        this.items.map(i => sum = sum + i.item.movingDuration);
        return sum;
    }

    get distance  (): number {
        if (!this.items) { return null; }
        let sum: number = 0;
        this.items.map(i => sum = sum + i.item.distance);
        return sum;
    }
}