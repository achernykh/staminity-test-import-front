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
import { ICalendarItemDialogOptions, ICalendarItemDialogResponse } from "../calendar-item-dialog.interface";
import { CalendarItemDialogService } from "../calendar-item-dialog.service";
import { FormMode } from "../../application.interface";

export class CalendarItemRecordCtrl implements IComponentController {

    // bind
    item: ICalendarItem;
    options: ICalendarItemDialogOptions;
    owner: IUserProfile;
    onAnswer: (response: ICalendarItemDialogResponse) => Promise<void>;
    onCancel: () => IPromise<void>;

    // public
    record: CalendarItemRecord;

    // private
    private fullScreenMode: boolean = false; // режим полноэкранного ввода
    private recordForm: INgModelController;

    static $inject = ['calendarItemRecordConfig', 'SessionService', 'CalendarService', 'CalendarItemDialogService',
        'message', 'quillConfig'];

    constructor (
        private config: ICalendarItemRecordConfig,
        private session: SessionService,
        private calendarService: CalendarService,
        private calendarDialog: CalendarItemDialogService,
        private message: MessageService,
        private quillConf: IQuillConfig
    ) {

    }

    $onInit () {
        this.record = new CalendarItemRecord(this.item, this.options);
    }

    /**
     * Диалог просмотра Записи
     * @param e
     */
    open (e: Event): void {
        this.calendarDialog.record(e, Object.assign(this.options, {formMode: FormMode.View}), this.record)
            .then(response => this.onAnswer(response));
    }

    edit (e: Event): void {
        this.calendarDialog.record(e, Object.assign(this.options, {formMode: FormMode.Put}), this.record)
            .then(response => this.onAnswer(response));
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

        this.record.recordHeader.editParams.asyncEventsDateFrom = this.options.calendarRange.dateStart;
        this.record.recordHeader.editParams.asyncEventsDateTo = this.options.calendarRange.dateEnd;

        if ( this.record.view.isPost ) {
            this.calendarService.postItem(this.record.build())
                .then(response => {
                    this.record.compile(response);// сохраняем id, revision в обьекте
                    this.message.toastInfo('recordCreated');
                    this.close();
                }, error => this.message.toastError(error));
        }
        if ( this.record.view.isPut ) {
            this.calendarService.putItem(this.record.build())
                .then((response)=> {
                    this.record.compile(response); // сохраняем id, revision в обьекте
                    this.message.toastInfo('recordUpdated');
                    this.close();
                }, error => this.message.toastError(error));
        }
    }

    onDelete (rmParams: Object) {
        this.calendarService.deleteItem('F', [this.record.calendarItemId], rmParams)
            .then(() => {
                this.message.toastInfo('recordDeleted');
                this.close();
            }, error => this.message.toastError(error));
    }

    onEditorCreated (editor) {
        editor.getModule('toolbar').addHandler('image', () => {
            new Promise((resolve, reject) => {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.click();

                input.onchange = () => {
                    const file = input.files[0];

                    if (/^image\//.test(file.type)) {
                        resolve(file);
                    } else {
                        reject();
                    }
                };
            })
            .then((picture) => this.calendarService.postImage(picture))
            .then((url) => {
                const range = editor.getSelection();
                editor.insertEmbed(range.index, 'image', url);
            }, (error) => {
                this.message.toastError(error);
            });
        });
    }

    private close (): void {
        this.onCancel();
    }

}

export const CalendarItemRecordComponent: IComponentOptions = {
    bindings: {
        item: '=', // CalendarItem
        options: '<',
        onAnswer: '&',
        onCancel: '&', // отмена открытия
    },
    require: {
        //calendar: '^calendar'
    },
    controller: CalendarItemRecordCtrl,
    template: require('./calendar-item-record.component.html') as string
};