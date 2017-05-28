import './calendar-item-events.component.scss';
import {IPromise} from 'angular';
import {IUserProfileShort, IUserProfile} from "../../../../api/user/user.interface";
import {ISessionService} from "../../core/session.service";
import {CalendarItem} from "../calendar-item.datamodel";
import {CalendarService} from "../../calendar/calendar.service";
import {IMessageService} from "../../core/message.service";

const profileShort = (user: IUserProfile):IUserProfileShort => ({userId: user.userId, public: user.public});
const _FEELING: Array<string> = ['sentiment_very_satisfied','sentiment_satisfied','sentiment_neutral',
    'sentiment_dissatisfied','sentiment_very_dissatisfied'];

class CalendarItemEventsCtrl {

    private feeling: Array<string> = _FEELING;
    private data: any;
    private mode: string;
    private item: any;
    public onAnswer: (response: Object) => IPromise<void>;
    public onCancel: (response: Object) => IPromise<void>;

    static $inject = ['CalendarService','SessionService', 'message'];

    constructor(
        private CalendarService: CalendarService,
        private SessionService: ISessionService,
        private message: IMessageService) {
    }

    $onInit() {
        console.log('data======================', profileShort(this.SessionService.getUser()));
        //if (this.mode === 'post') {
            this.data = {
                calendarItemType: 'events',
                dateStart: new Date(this.data.date),
                dateEnd: new Date(this.data.date),
                userProfileOwner: profileShort(this.SessionService.getUser()),
                userProfileCreator: profileShort(this.SessionService.getUser())
            };
        //}
        console.log('WWWWWww',this.data.userProfileOwner.public.avatar);

        this.item = new CalendarItem(this.data);
        this.item.prepare();
    }

    onSave() {
        if (this.mode === 'post') {
            this.CalendarService.postItem(this.item.package())
                .then(response => this.item.compile(response)) // сохраняем id, revision в обьекте
                .then(() => this.onAnswer({response: {type:'post',item:this.item}}),
                    error => this.message.systemError(error));
        }
        if (this.mode === 'put') {
            this.CalendarService.putItem(this.item.package())
                .then(response => this.item.compile(response)) // сохраняем id, revision в обьекте
                .then(() => this.onAnswer({response: {type:'put',item:this.item}}),
                    error => this.message.systemError(error));
        }
    }

    onDelete() {
        this.CalendarService.deleteItem('F', [this.item.calendarItemId])
            .then(response => this.onAnswer({response: {type:'delete',item:this.item}}),
                error => this.message.systemError(error));
    }
}

export let CalendarItemEventsComponent = {
    bindings: {
        data: '=',
        mode: '@',
        onCancel: '&',
        onAnswer: '&'
    },
    transclude: true,
    controller: CalendarItemEventsCtrl,
    template: require('./calendar-item-events.component.html') as string
};

export default CalendarItemEventsComponent;