import './calendar-item-events.component.scss';
import {IPromise} from 'angular';
import {IUserProfileShort, IUserProfile} from "../../../../api/user/user.interface";
import {ISessionService} from "../../core/session.service";
import {CalendarItem} from "../calendar-item.datamodel";
import {CalendarService} from "../../calendar/calendar.service";
import {IMessageService} from "../../core/message.service";
import {_eventsType} from "./calendar-items-events.constants";

const profileShort = (user: IUserProfile):IUserProfileShort => ({userId: user.userId, public: user.public});


class CalendarItemEventsCtrl {

    private data: any;
    private mode: string;
    private user: IUserProfile;

    private item: CalendarItem;

    private types: Array<string> = _eventsType;
    public onAnswer: (response: Object) => IPromise<void>;
    public onCancel: (response: Object) => IPromise<void>;

    public isOwner: boolean; // true - если пользователь владелец тренировки, false - если нет
    public isCreator: boolean;
    public isPro: boolean;
    public isMyCoach: boolean;

    static $inject = ['CalendarService','SessionService', 'message'];

    constructor(
        private CalendarService: CalendarService,
        private SessionService: ISessionService,
        private message: IMessageService) {
    }

    $onInit() {
        debugger;
        if (this.mode === 'post') {
            this.data = {
                calendarItemType: 'event',
                eventHeader: {
                    eventType: 'restDay'
                },
                dateStart: this.data.date,
                dateEnd: this.data.date,
                userProfileOwner: profileShort(this.user),
                userProfileCreator: profileShort(this.SessionService.getUser())
            };
        }

        this.item = new CalendarItem(this.data);
        this.item.prepare();
        //this.item.eventHeader.eventType = 'restDay';
        this.isCreator = this.item.userProfileCreator.userId === this.user.userId;
        this.isMyCoach = this.item.userProfileCreator.userId !== this.user.userId;
    }

    onSave() {
        if (this.mode === 'post') {
            this.CalendarService.postItem(this.item.package())
                .then((response)=> {
                    this.item.compile(response);// сохраняем id, revision в обьекте
                    this.message.toastInfo('eventCreated');
                    this.onAnswer({response: {type:'post', item:this.item.package()}});
                }, error => this.message.toastError(error));
        }
        if (this.mode === 'put') {
            this.CalendarService.putItem(this.item.package())
                .then((response)=> {
                    this.item.compile(response); // сохраняем id, revision в обьекте
                    this.message.toastInfo('eventUpdated');
                    this.onAnswer({response: {type:'put',item:this.item.package()}});
                }, error => this.message.toastError(error));
        }
    }

    onDelete() {
        this.CalendarService.deleteItem('F', [this.item.calendarItemId])
            .then(() => {
                this.message.toastInfo('eventDeleted');
                this.onAnswer({response: {type:'delete',item:this.item}});
            }, error => this.message.toastError(error));
    }
}

export let CalendarItemEventsComponent = {
    bindings: {
        data: '=',
        mode: '@',
        user: '<',
        onCancel: '&',
        onAnswer: '&'
    },
    transclude: true,
    controller: CalendarItemEventsCtrl,
    template: require('./calendar-item-events.component.html') as string
};

export default CalendarItemEventsComponent;