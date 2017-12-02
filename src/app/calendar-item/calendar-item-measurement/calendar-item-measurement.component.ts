import {IPromise} from "angular";
import {IUserProfile, IUserProfileShort} from "../../../../api";
import {CalendarService} from "../../calendar/calendar.service";
import {SessionService} from "../../core";
import {IMessageService} from "../../core/message.service";
import {CalendarItem} from "../calendar-item.datamodel";
import "./calendar-item-measurement.component.scss";

const profileShort = (user: IUserProfile): IUserProfileShort => ({userId: user.userId, public: user.public});
const _FEELING: string[] = ["sentiment_very_satisfied", "sentiment_satisfied", "sentiment_neutral",
    "sentiment_dissatisfied", "sentiment_very_dissatisfied"];

class CalendarItemMeasurementCtrl {

    private feeling: string[] = _FEELING;
    private data: any;
    private mode: string;
    private item: any;
    private user: IUserProfile;
    public onAnswer: (response: Object) => IPromise<void>;
    public onCancel: (response: Object) => IPromise<void>;

    public static $inject = ["CalendarService", "SessionService", "message"];

    constructor(
        private CalendarService: CalendarService,
        private SessionService: SessionService,
        private message: IMessageService) {
    }

    public $onInit() {

        if (this.mode === "post") {
            this.data = {
                calendarItemType: "measurement",
                dateStart: this.data.date,
                dateEnd: this.data.date,
                userProfileOwner: profileShort(this.user),
            };
        }

        this.item = new CalendarItem(this.data);
        this.item.prepare();
    }

    public onSave() {
        if (this.mode === "post") {
            this.CalendarService.postItem(this.item.package())
                .then((response) => this.item.compile(response)) // сохраняем id, revision в обьекте
                .then(() => this.message.toastInfo("measurementCreated"))
                .then(() => this.onAnswer({response: {type: "post", item: this.item}}),
                    (error) => this.message.toastError(error));
        }
        if (this.mode === "put") {
            this.CalendarService.putItem(this.item.package())
                .then((response) => this.item.compile(response)) // сохраняем id, revision в обьекте
                .then(() => this.message.toastInfo("measurementUpdated"))
                .then(() => this.onAnswer({response: {type: "put", item: this.item}}),
                    (error) => this.message.toastError(error));
        }
    }

    public onDelete() {
        this.CalendarService.deleteItem("F", [this.item.calendarItemId])
            .then((response) => {
                this.message.toastInfo("measurementDeleted");
                this.onAnswer({response: {type: "delete", item: this.item}});
            }, (error) => this.message.toastError(error));
    }
}

export let CalendarItemMeasurementComponent = {
    bindings: {
        data: "=",
        mode: "@",
        user: "<",
        onCancel: "&",
        onAnswer: "&",
    },
    transclude: true,
    controller: CalendarItemMeasurementCtrl,
    template: require("./calendar-item-measurement.component.html") as string,
};

export default CalendarItemMeasurementComponent;
