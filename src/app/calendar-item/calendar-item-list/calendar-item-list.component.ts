import './calendar-item-list.component.scss';
import {IComponentOptions, IComponentController} from 'angular';
import moment from 'moment/min/moment-with-locales.js';
import { Moment } from 'moment';
import { ICalendarItem } from "../../../../api/calendar/calendar.interface";
import { ICalendarItemDialogOptions } from "../calendar-item-dialog.interface";
import { SessionService } from "../../core/session/session.service";
import { IActivityIntervalPW } from "../../../../api/activity/activity.interface";

class CalendarItemListCtrl implements IComponentController {

    // bind
    data: Array<ICalendarItem>;
    datePoint: Date;
    onEvent: (response: Object) => Promise<void>;

    // private
    itemOptions: ICalendarItemDialogOptions;
    // inject
    static $inject = ['SessionService'];

    constructor(private session: SessionService) {

    }

    $onInit(): void {
        this.itemOptions = {
            currentUser: this.session.getUser(),
            owner: this.session.getUser(),
            trainingPlanMode: true
        };
    }

    /**
     *
     * @param item
     * @returns {{week: null, days: null, data: Date}}
     */
    getDate (item: ICalendarItem): {week: number, day: number, data: Date} {
        return {
            week: moment(item.dateStart).diff(this.datePoint, 'weeks') + 1,
            day: moment(item.dateStart).diff(this.datePoint, 'days') + 1,
            data: new Date(item.dateStart)
        };
    }

    getDescription (item: ICalendarItem): string {
        switch (item.calendarItemType) {
            case 'activity': {
                return (item.activityHeader.intervals.filter(i => i.type === 'pW')[0] as IActivityIntervalPW).trainersPrescription || null;
            }
            case 'record': {
                return item.recordHeader.description || null;
            }
        }
    }

}

export const CalendarItemListComponent:IComponentOptions = {
    bindings: {
        data: '<',
        disableActions: '<',
        absoluteDates: '<', // даты тренировок динамические или статичные
        datePoint: '<', // точка отчета для дат
        onEvent: '&'
    },
    controller: CalendarItemListCtrl,
    template: require('./calendar-item-list.component.html') as string
};