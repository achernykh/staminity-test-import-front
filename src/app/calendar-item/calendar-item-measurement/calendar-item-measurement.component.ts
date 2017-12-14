import './calendar-item-measurement.component.scss';
import { SessionService } from "../../core";
import { CalendarItem } from "../calendar-item.datamodel";
import { CalendarService } from "../../calendar/calendar.service";
import { IMessageService } from "../../core/message.service";
import { ICalendarItem } from "@api/calendar";
import { ICalendarItemDialogOptions } from "@app/calendar-item/calendar-item-dialog.interface";
import { FormMode } from "../../application.interface";

const _FEELING: Array<string> = [ 'sentiment_very_satisfied', 'sentiment_satisfied', 'sentiment_neutral',
    'sentiment_dissatisfied', 'sentiment_very_dissatisfied' ];

class CalendarItemMeasurementCtrl {

    // bind
    data: ICalendarItem;
    options: ICalendarItemDialogOptions;

    // private
    measurement: CalendarItem;


    private feeling: Array<string> = _FEELING;
    public onAnswer: (response: { formMode: FormMode, item: ICalendarItem }) => Promise<void>;
    public onCancel: () => Promise<void>;

    static $inject = [ 'CalendarService', 'SessionService', 'message' ];

    constructor (private CalendarService: CalendarService,
                 private SessionService: SessionService,
                 private message: IMessageService) {
    }

    $onInit () {

        this.measurement = new CalendarItem(this.data, this.options);
        this.measurement.prepare();
    }

    onSave () {
        if (this.options.formMode === FormMode.Post) {
            this.CalendarService.postItem(this.measurement.package())
                .then(response => this.measurement.compile(response)) // сохраняем id, revision в обьекте
                .then(() => this.message.toastInfo('measurementCreated'))
                .then(() => this.onAnswer({ formMode: FormMode.Post, item: this.measurement }),
                    error => this.message.toastError(error));
        }
        if (this.options.formMode === FormMode.Put) {
            this.CalendarService.putItem(this.measurement.package())
                .then(response => this.measurement.compile(response)) // сохраняем id, revision в обьекте
                .then(() => this.message.toastInfo('measurementUpdated'))
                .then(() => this.onAnswer({ formMode: FormMode.Put, item: this.measurement }),
                    error => this.message.toastError(error));
        }
    }

    onDelete () {
        this.CalendarService.deleteItem('F', [ this.measurement.calendarItemId ])
            .then(response => {
                this.message.toastInfo('measurementDeleted');
                this.onAnswer({ formMode: FormMode.Delete, item: this.measurement });
            }, error => this.message.toastError(error));
    }
}

export let CalendarItemMeasurementComponent = {
    bindings: {
        data: '<',
        options: '<',
        onCancel: '&',
        onAnswer: '&'
    },
    transclude: true,
    controller: CalendarItemMeasurementCtrl,
    template: require('./calendar-item-measurement.component.html') as string
};

export default CalendarItemMeasurementComponent;