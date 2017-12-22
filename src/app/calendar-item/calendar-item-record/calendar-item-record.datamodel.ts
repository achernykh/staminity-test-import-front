import { CalendarItem } from "../calendar-item.datamodel";
import { ICalendarItem, IRecordHeader, IRecordHeaderEditParams } from "../../../../api/calendar/calendar.interface";
import { IUserProfile } from "../../../../api/user/user.interface";
import { CalendarItemRecordConfig } from "./calendar-item-record.config";
import moment from "moment/src/moment.js";
import { ICalendarItemDialogOptions } from "../calendar-item-dialog.interface";

export class CalendarItemRecord extends CalendarItem {

    recordHeader: IRecordHeader;
    isRepeated: boolean = false;

    constructor (private param: ICalendarItem, options?: ICalendarItemDialogOptions) {
        super(param, options);
        this.prepareDefaultType();
    }

    build (): ICalendarItem {
        super.package();
        let item: ICalendarItem = this;
        let format: string = 'YYYY-MM-DD';

        item.dateStart = moment(this.recordHeader.dateStart).format(format);
        item.dateEnd = this.dateStart;

        if (!this.isRepeated) { // Без повторений
            item.recordHeader.repeat = null;
            // 1) смена повторяющееся на не повторяющееся
            if (this.param.hasOwnProperty('recordHeader') &&
                this.param.recordHeader.repeat !== item.recordHeader.repeat) {
                item.recordHeader.editParams = Object.assign(this.recordHeader.editParams, {
                    regenPastEvents: true,
                    regenFutureEvents: true // изменить все будущие события
                })  ;
            }
        } else { // С повторениями
            item.recordHeader.dateStart = item.dateStart;
            if (item.recordHeader.repeat.endType === 'D') {
                item.recordHeader.repeat.endOnDate = moment(this.recordHeader.repeat.endOnDate).format(format);
                item.recordHeader.repeat.endOnCount = null;
            } else {
                item.recordHeader.repeat.endOnDate = null;
            }
            if (this.view.isPut) {
                item.recordHeader.editParams = Object.assign(this.recordHeader.editParams, {
                    // 2) меняется дата начала в повторе
                    regenPastEvents: this.param.recordHeader.dateStart !== item.recordHeader.dateStart,
                    regenFutureEvents: true // изменить все будущие события
                });
            }
        }

        ['param', 'isRepeated', 'user', 'athletes', 'auth', 'view','_dateStart','_dateEnd']
            .map(k => item.hasOwnProperty(k) && delete item[k]);
        return item;
    }

    private prepareDefaultType () {
        if ( this.view.isPost ) {
            this.recordHeader = {
                type: this.recordHeader.hasOwnProperty('type') && this.recordHeader.type || CalendarItemRecordConfig.defaultType,
                dateStart: this.dateStart,
                repeat: CalendarItemRecordConfig.defaultRepeat,
                description: null
            };
            this.recordHeader.repeat.endOnDate = moment(this.dateStart).add('days', 2);
        } else {
            this.isRepeated = !!this.recordHeader.repeat;
        }

        this.recordHeader.editParams = {
            asyncEventsDateFrom: null, // с какой и по какую дату прислать асинхронные записи после создания/рекдактирования
            asyncEventsDateTo: null,
            regenPastEvents: null, // изменить все прошлые события
            regenFutureEvents: null // изменить все будущие события
        };


    }
}