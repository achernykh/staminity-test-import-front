import './calendar-item-activity.component.scss';
import { IComponentOptions, IComponentController, IFormController,IPromise, IScope, merge} from 'angular';
import moment from 'moment/src/moment.js';
import {CalendarService} from "../../calendar/calendar.service";
import UserService from "../../core/user.service";
import ActivityService from "../../activity/activity.service";
import {IMessageService} from "../../core/message.service";
import {
    IActivityHeader, IActivityDetails, IActivityIntervalPW,
    IActivityMeasure, ICalcMeasures, IActivityCategory, IActivityType
} from "../../../../api/activity/activity.interface";
import SessionService from "../../core/session.service";
import {IUserProfileShort, IUserProfile} from "../../../../api/user/user.interface";
import {Activity} from "../../activity/activity.datamodel";
import {CalendarCtrl} from "../../calendar/calendar.component";
import {activityTypes, getType} from "../../activity/activity.constants";
import {IAuthService} from "../../auth/auth.service";

const profileShort = (user: IUserProfile):IUserProfileShort => ({userId: user.userId, public: user.public});

enum HeaderTab {
    Overview,
    Details,
    Zones,
    Chat
};

export class CalendarItemActivityCtrl implements IComponentController{

    date: Date;
    data: any;
    details: IActivityDetails;
    mode: string;
    activity: Activity;
    user: IUserProfile;
    onAnswer: (response: Object) => IPromise<void>;
    onCancel: () => IPromise<void>;

    private selectedTimestamp: Array<any> = [];
    private selectedIntervalIndex: {} = { L: null, P: null};
    private selectedIntervalType: string;
    private changeSelectInterval: number = 0;
    private selectedTab: number = 0; // Индекс панели закладок панели заголовка тренировки
    private isOwner: boolean; // true - если пользователь владелец тренировки, false - если нет
    private isCreator: boolean;
    private isPro: boolean;
    private isMyCoach: boolean;

    private isLoadingDetails: boolean = false;
    private activityForm: IFormController;
    private calendar: CalendarCtrl;
    private types: Array<IActivityType> = [];

    static $inject = ['$scope','CalendarService','UserService','SessionService','ActivityService','AuthService','message','$mdMedia'];

    constructor(
        private $scope: IScope,
        private CalendarService: CalendarService,
        private UserService: UserService,
        private SessionService: SessionService,
        private ActivityService: ActivityService,
        private AuthService: IAuthService,
        private message: IMessageService,
        private $mdMedia: any) {

    }

    $onChanges(changes) {
        if(changes.mode && !changes.mode.isFirstChange()) {
            this.changeMode(changes.mode);
        }
    }

    $onInit() {
        let currentUser: IUserProfile = this.SessionService.getUser();
        if (this.mode === 'post') {
            this.data = {
                calendarItemType: 'activity',
                dateStart: this.date,
                dateEnd: this.date,
                userProfileOwner: profileShort(this.user),
                userProfileCreator: profileShort(currentUser)
            };
        }

        this.activity = new Activity(this.data);
        this.activity.prepare();

        //Получаем детали по тренировке загруженной из внешнего источника
        if (this.mode !== 'post' && this.activity.intervalW.actualDataIsImported) {
            this.ActivityService.getIntervals(this.activity.activityHeader.activityId)
                .then(response => this.activity.completeIntervals(response),
                    error => this.message.toastError('errorCompleteIntervals'));

            this.ActivityService.getDetails2(this.data.activityHeader.activityId)
                .then(response => {
                    this.activity.completeDetails(this.details = response);
                    this.isLoadingDetails = false;
                }, error => this.message.toastError('errorCompleteDetails'));
        }


        this.types = activityTypes; // Список видов спорта
        this.isOwner = this.activity.userProfileOwner.userId === currentUser.userId;
        this.isCreator = this.activity.userProfileCreator.userId === currentUser.userId;
        this.isPro = this.AuthService.isActivityPro();
        this.isMyCoach = this.activity.userProfileCreator.userId !== currentUser.userId;
        // Список категорий тренировки
        if (this.mode === 'put' || this.mode === 'post') {
            this.ActivityService.getCategory()
                .then(list => this.activity.categoriesList = list,
                    error => this.message.toastError(error));
        }

    }

    changeMode(mode:string) {
        this.mode = mode;
        if (mode === 'put' && !this.activity.categoriesList.length) {
            this.ActivityService.getCategory()
                .then(list => this.activity.categoriesList = list,
                    error => this.message.toastError(error));
        }
    }

    changeSelectedIndex(type: string, index: Array<number>){
        console.log('changeSelectedInterval',type, index);
        this.selectedIntervalType = type;
        this.selectedIntervalIndex[type] = index;
        this.calculateTimestampInterval(type,index);
        this.changeSelectInterval++;
        // по любому выделению инетрвала пользователя переходим на вкладку Детали
        if (this.selectedTab !== HeaderTab.Details && this.isPro) {
            this.selectedTab = HeaderTab.Details;
        }
    }

    calculateTimestampInterval(type: string, index: Array<number>) {
        this.selectedTimestamp = [];
        index.forEach(i => this.selectedTimestamp.push({
            startTimestamp: this.activity['interval'+type][i].startTimestamp,
            endTimestamp: this.activity['interval'+type][i].endTimestamp
        }));
    }

    addUserInterval(range: {startTimestamp: number, endTimestamp: number}){
        this.ActivityService.calculateRange(this.activity.id, range.startTimestamp, range.endTimestamp, [this.activity.intervalW])
            .then(response=>console.log(response));
    }

    onReset(mode: string) {
        this.mode = mode;
        if(mode === 'post') {
            this.onCancel();
        } else {
            this.activity.prepare();
        }
    }

    // Функции можно было бы перенсти в компонент Календаря, но допускаем, что компоненты Активность, Измерения и пр.
    // могут вызваны из любого другого представления
    onSave() {
        console.log('save',this.activity.build());

        if (this.mode === 'post') {
            this.CalendarService.postItem(this.activity.build())
                .then((response)=> {
                    this.activity.compile(response);// сохраняем id, revision в обьекте
                    this.onAnswer({response: {type:'post', item:this.activity.build()}});
                }, error => this.message.toastError(error));
        }
        if (this.mode === 'put') {
            this.CalendarService.putItem(this.activity.build())
                .then((response)=> {
                    this.activity.compile(response); // сохраняем id, revision в обьекте
                    this.onAnswer({response: {type:'put',item:this.activity.build()}});
                }, error => this.message.toastError(error));
        }
    }

    onDelete() {
        this.CalendarService.deleteItem('F', [this.activity.calendarItemId])
            .then((response)=> this.onAnswer({response: {type:'delete',item:this.activity.build()}}),
                error => this.message.toastError(error));
    }

	/**
     * Обновление данных из формы ввода/редактирования activity-assignment
     */
    updateAssignment(plan:IActivityIntervalPW, actual:ICalcMeasures) {
        this.activity.intervalPW = plan;

        this.activity.intervalPW.durationMeasure = (!!plan.distance.value && 'distance') ||
            (!!plan.movingDuration.value && 'movingDuration') || null;
        this.activity.intervalPW.durationValue =
            (plan[this.activity.intervalPW.durationMeasure] && plan[this.activity.intervalPW.durationMeasure].value) || null;

        this.activity.intervalPW.intensityMeasure = (!!plan.heartRate['from'] && 'heartRate') ||
            (!!plan.speed['from'] && 'speed') || (!!plan.power['from'] && 'power') || null;

        this.activity.intervalPW.intensityLevelFrom =
            (plan[this.activity.intervalPW.intensityMeasure] && plan[this.activity.intervalPW.intensityMeasure]['from']) || null;
        this.activity.intervalPW.intensityLevelTo =
            (plan[this.activity.intervalPW.intensityMeasure] && plan[this.activity.intervalPW.intensityMeasure]['to']) || null;

        this.activity.intervalW.calcMeasures = actual;
        //this.activityForm.$dirty = true;
        //this.activityForm.$valid = valid && this.activityForm.$valid;
    }
}

const CalendarItemActivityComponent: IComponentOptions = {
    bindings: {
        date: '<', // в режиме создания передает дату календаря
        data: '<', // в режиме просмотр/изменение передает данные по тренировке из календаря
        mode: '<', // режим: созадние, просмотр, изменение
        user: '<', // пользователь - владелец календаря
        onCancel: '&',
        onAnswer: '&'
    },
    require: {
        //calendar: '^calendar'
    },
    transclude: true,
    controller: CalendarItemActivityCtrl,
    template: require('./calendar-item-activity.component.html') as string
};

export default CalendarItemActivityComponent;