import './calendar-item-list.component.scss';
import {IComponentOptions, IComponentController} from 'angular';
import { ICalendarItem } from "../../../../api/calendar/calendar.interface";
import { ICalendarItemDialogOptions } from "../calendar-item-dialog.interface";
import { SessionService } from "../../core/session/session.service";
import { IActivityIntervalPW } from "../../../../api/activity/activity.interface";

class CalendarItemListCtrl implements IComponentController {

    // bind
    data: Array<ICalendarItem>;
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