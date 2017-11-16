import "./calendar-item-record.component.scss";
import { IComponentOptions, IComponentController, IPromise, INgModelController } from "angular";
import { ICalendarItem } from "../../../../api/calendar/calendar.interface";
import { IUserProfile } from "../../../../api/user/user.interface";
import { CalendarItemRecord } from "./calendar-item-record.datamodel";
import { SessionService } from "../../core";
import { CalendarService } from "../../calendar/calendar.service";
import { ICalendarItemRecordConfig } from "./calendar-item-record.config";
import MessageService from "../../core/message.service";
import { IQuillConfig } from "@app/share/quill/quill.config";

class CalendarItemRecordCtrl implements IComponentController {

    // bind
    data: ICalendarItem;
    mode: 'put' | 'view' | 'post';
    owner: IUserProfile;
    calendarRange: Array<string>;
    onCancel: () => IPromise<void>;

    // public
    record: CalendarItemRecord;
    user: IUserProfile;

    // private
    private fullScreenMode: boolean = false; // режим полноэкранного ввода
    private recordForm: INgModelController;

    static $inject = ['calendarItemRecordConfig', 'SessionService', 'CalendarService', 'message', 'quillConfig'];

    constructor (private config: ICalendarItemRecordConfig,
                 private session: SessionService,
                 private calendarService: CalendarService,
                 private message: MessageService,
                 private quillConf: IQuillConfig) {

    }

    $onInit () {
        this.user = this.session.getUser();
        this.record = new CalendarItemRecord(this.data, this.user);
    }

    toggle (item, list) {
        let idx = list.indexOf(item);
        idx > -1 ? list.splice(idx, 1) : list.push(item);
        this.changeForm();
    }

    exists (item, list) {
        return list.indexOf(item) > -1;
    }

    changeRepeatMode (): void {
        if (this.record.isRepeated) {

        } else {
            this.record.recordHeader.dateStart = this.record.dateStart;
        }
    }

    changeForm (): void {
        this.recordForm.$setDirty();
    }

    onSave () {


        [this.record.recordHeader.editParams.asyncEventsDateFrom,
            this.record.recordHeader.editParams.asyncEventsDateTo] = this.calendarRange;

        if ( this.mode === 'post' ) {
            this.calendarService.postItem(this.record.build(this.mode))
                .then(response => {
                    this.record.compile(response);// сохраняем id, revision в обьекте
                    this.message.toastInfo('recordCreated');
                    this.close();
                }, error => this.message.toastError(error));
        }
        if ( this.mode === 'put' ) {
            this.calendarService.putItem(this.record.build(this.mode))
                .then((response)=> {
                    this.record.compile(response); // сохраняем id, revision в обьекте
                    this.message.toastInfo('recordUpdated');
                    this.close();
                }, error => this.message.toastError(error));
        }
    }

    onDelete(rmParams: Object) {
        this.calendarService.deleteItem('F', [this.record.calendarItemId], rmParams)
            .then(() => {
                this.message.toastInfo('recordDeleted');
                this.close();
            }, error => this.message.toastError(error));
    }

    private get isViewMode (): boolean {
        return this.mode === 'view';
    }

    private close (): void {
        this.onCancel();
    }

}

export const CalendarItemRecordComponent: IComponentOptions = {
    bindings: {
        data: '=', // CalendarItem
        mode: '@', // Режим открытия: 'put' изменить | 'view' просмотр | 'post' создание
        user: '<', // UserProfile для userProfileOwner,
        calendarRange: '=', // Загруженный календарь [начало, окончание]
        onCancel: '&', // отмена открытия
    },
    require: {
        //calendar: '^calendar'
    },
    controller: CalendarItemRecordCtrl,
    template: require('./calendar-item-record.component.html') as string
};