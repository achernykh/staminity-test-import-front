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

export interface CompetitionItems {
    mode: FormMode;
    item: Activity;
}

export class CalendarItemCompetition extends CalendarItem {

    competitionHeader: ICompetitionHeader;
    items: Array<CompetitionItems>;
    calendarItems: Array<ICalendarItem>; // массив вложенных тренировок

    constructor (private item: ICalendarItem, private options: ICalendarItemDialogOptions) {
        super(item, options);
        this.prepare();
    }

    prepare (): void {
        super.prepare();
        if (this.calendarItems && this.calendarItems.length) {
            this.items = [];
            this.calendarItems.map(i => this.items.push({ mode: FormMode.View, item: new Activity(i, this.options)}));
        }
    }

    setParentId (id: number = this.calendarItemId) {
        this.items.map(i => i.item.parentId = id);
    }

    setItems(template: Array<ICompetitionStageConfig>, options: ICalendarItemDialogOptions = this.options) {

        this.items = [];

        template.map(t => {
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

            this.items.push({mode: FormMode.Post, item: activity});

        });
    }

    build (): ICalendarItem {
        let item: ICalendarItem = Object.assign({}, this);
        ['item', 'items', 'options'].map(k => delete item[k]);
        return this;
    }

    get sportBasic (): string {
        return this.competitionHeader.type;
    }

    get movingDuration (): number {
        let sum: number = 0;
        this.items.map(i => sum = sum + i.item.movingDuration);
        return sum;
    }

    get distance  (): number {
        let sum: number = 0;
        this.items.map(i => sum = sum + i.item.distance);
        return sum;
    }
}