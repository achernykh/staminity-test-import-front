import moment from 'moment/min/moment-with-locales.js';
import { ICalendarItem } from "../../../api/calendar";
import { ICalendarWeek } from "./calendar.interface";

export const prepareItem = (item: ICalendarItem, shift: number) => {
    item.dateStart = moment(item.dateStart, 'YYYY-MM-DD').add(shift,'d').format('YYYY-MM-DD');
    item.dateEnd = moment(item.dateEnd, 'YYYY-MM-DD').add(shift,'d').format('YYYY-MM-DD');
    if(item.calendarItemType === 'activity') {
        item.activityHeader.intervals = item.activityHeader.intervals.filter(i => i.type === 'pW' || i.type === 'P');
        delete item.activityHeader.intervals.filter(i => i.type === 'pW')[0].calcMeasures.completePercent.value;
    }
    return item;
};

export const getItemById = (calendar: Array<ICalendarWeek>, id: number):ICalendarItem => {

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