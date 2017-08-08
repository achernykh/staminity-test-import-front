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

    private showSelectAthletes: boolean = false;
    private forAthletes: Array<{profile: IUserProfileShort, active: boolean}> = [];

    public currentUser: IUserProfile = null;
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
        this.currentUser = this.SessionService.getUser();
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

        // Перечень атлетов тренера доступных для планирования
        if(this.currentUser.connections.hasOwnProperty('allAthletes') && this.currentUser.connections.allAthletes){
            this.forAthletes = this.currentUser.connections.allAthletes.groupMembers
                .map(user => ({profile: user, active: user.userId === this.user.userId}));

        }
        if(this.forAthletes.length === 0 || !this.forAthletes.some(athlete => athlete.active)) {
            this.forAthletes.push({profile: profileShort(this.user), active: true});
        }

    }

    /**
     * Функция получает выделенных атлетов для планирования трениовки
     * @param response
     */
    selectAthletes(response){
        debugger;
        this.showSelectAthletes = false;
        this.forAthletes = response;
    }

    /**
     * Возвращает н-ого атлета для планирования тренировки, необходимо для вывода автарки в заголовки тренировки
     * @param pos
     * @returns {IUserProfileShort}
     */
    firstAthlete(pos: number){
        return this.forAthletes.filter(athlete => athlete.active)[pos].profile;
    }

    /**
     * Указывает, что тренировка планируется для более чем одного атлета
     * @returns {boolean}
     */
    multiAthlete(){
        return this.forAthletes.filter(athlete => athlete.active).length > 1;
    }


    onSave() {
        if (this.mode === 'post') {
            let athletes: Array<{profile: IUserProfileShort, active: boolean}> = [];
            athletes.push(...this.forAthletes.filter(athlete => athlete.active));
            athletes.forEach(athlete =>
                this.CalendarService.postItem(this.item.package(athlete.profile))
                    .then((response)=> {
                        this.item.compile(response);// сохраняем id, revision в обьекте
                        this.message.toastInfo('eventCreated');
                        this.onAnswer({response: null});
                    }, error => this.message.toastError(error))
            );
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