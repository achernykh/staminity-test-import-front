import "./calendar-item-record.component.scss";
import { IComponentOptions, IComponentController, IPromise } from "angular";
import { ICalendarItem } from "../../../../api/calendar/calendar.interface";
import { IUserProfile } from "../../../../api/user/user.interface";
import { CalendarItemRecord } from "./calendar-item-record.datamodel";
import SessionService from "../../core/session.service";
import { CalendarService } from "../../calendar/calendar.service";
import { ICalendarItemRecordConfig } from "./calendar-item-record.config";
import MessageService from "../../core/message.service";

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
    private toolbarConfig: Object = { // https://github.com/KillerCodeMonkey/ng-quill
        toolbar: [
            [{ header: [3, 4, false] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image', 'video']
        ]
    };
    private toolbarFullConfig: Object = { // https://github.com/KillerCodeMonkey/ng-quill
        toolbar: [
            [{ header: [3, 4, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'image', 'video']
        ]
    };

    static $inject = ['calendarItemRecordConfig', 'SessionService', 'CalendarService', 'message'];

    constructor (private config: ICalendarItemRecordConfig,
                 private session: SessionService,
                 private calendarService: CalendarService,
                 private message: MessageService) {

    }

    $onInit () {
        this.user = this.session.getUser();
        this.record = new CalendarItemRecord(this.data, this.user);
    }

    toggle (item, list) {
        let idx = list.indexOf(item);
        idx > -1 ? list.splice(idx, 1) : list.push(item);
    }

    exists (item, list) {
        return list.indexOf(item) > -1;
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