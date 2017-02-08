import { IComponentOptions, IComponentController, IFormController,IPromise, IScope} from 'angular';
import moment from 'moment/src/moment.js';
import {CalendarService} from "../../calendar/calendar.service";
import UserService from "../../core/user.service";
import ActivityService from "../../activity/activity.service";
import {IMessageService} from "../../core/message.service";
import {IActivityHeader, IActivityDetails} from "../../../../api/activity/activity.interface";
import ActivityDatamodel from '../../activity/activity.datamodel';
import './calendar-item-activity.component.scss';
import {CalendarItem} from "../calendar-item.datamodel";
import SessionService from "../../core/session.service";
import {IUserProfileShort, IUserProfile} from "../../../../api/user/user.interface";
import {ICalendarItem} from "../../../../api/calendar/calendar.interface";
import {Activity} from "../../activity/activity.datamodel";
import {ACTIVITY_TYPE, ACTIVITY_CATEGORY} from "../../activity/activity.constants";

const profileShort = (user: IUserProfile):IUserProfileShort => ({userId: user.userId, public: user.public});

class CalendarItemActivityCtrl implements IComponentController{

    date: Date;
    data: any;
    details: IActivityDetails;
    mode: string;
    activity: Activity;
    onAnswer: (response: Object) => IPromise<void>;
    onCancel: (response: Object) => IPromise<void>;
    private isLoadingDetails: boolean = true;
    private showMap: boolean = true;
    private types: Array<Object> = ACTIVITY_TYPE;
    private categories: Array<Object> = ACTIVITY_CATEGORY;
    private activityForm: IFormController;
    private peaks: Array<any>;


    static $inject = ['$scope','CalendarService','UserService','SessionService','ActivityService','message','$mdMedia'];

    constructor(
        private $scope: IScope,
        private CalendarService: CalendarService,
        private UserService: UserService,
        private SessionService: SessionService,
        private ActivityService: ActivityService,
        private message: IMessageService,
        private $mdMedia: any) {

    }

    $onInit() {

        if (this.mode === 'post') {
            this.data = {
                calendarItemType: 'activity',
                dateStart: this.date,
                dateEnd: this.date,
                userProfileOwner: profileShort(this.SessionService.getUser())
            };
        }

        this.activity = new Activity(this.data);
        this.activity.prepare();

        console.log('activity data after header =',this);

        //TODO intervalW.ActualDataIsImported

        //Получаем детали по тренировке
        this.ActivityService.getDetails2(this.data.activityHeader.activityId)
            .then(response => {
                this.details = response;
                this.activity = new Activity(this.data, this.details);
                this.activity.prepare();
                this.isLoadingDetails = false;
                console.log('activity data after details =',this);
            }, error => console.error(error));

        console.log('activity data=',this);
        this.peaks = this.activity.getPeaks();
    }

    toggleMap(){
       return this.showMap = !this.showMap;
    }

    // Функции можно было бы перенсти в компонент Календаря, но допускаем, что компоненты Активность, Измерения и пр.
    // могут вызваны из любого другого представления
    onSave() {
        console.log('save',this.activity.build());

        if (this.mode === 'post') {
            this.CalendarService.postItem(this.activity.build())
                .then((response)=> {
                    this.activity.compile(response);// сохраняем id, revision в обьекте
                    console.log('result=',this.activity);
                    this.onAnswer({response: {type:'post', item:this.activity}});
                });
        }
        if (this.mode === 'put') {
            this.CalendarService.putItem(this.activity.build())
                .then((response)=> {
                    this.activity.compile(response); // сохраняем id, revision в обьекте
                    console.log('result=',this.activity);
                    this.onAnswer({response: {type:'put',item:this.activity}});
                });
        }
    }

    onDelete() {
        this.CalendarService.deleteItem('F', [this.activity.calendarItemId])
            .then((response)=> {
                console.log('delete result=',response);
                this.onAnswer({response: {type:'delete',item:this.activity}});
            });
    }

	/**
     * Обновление данных из формы ввода/редактирования activity-assignment
     * @param intervalPW
     * @param intervalW
     */
    updateAssignment({intervalPW, intervalW}) {
        debugger;
        this.activity.intervalPW.calcMeasures = intervalPW;
        this.activity.intervalW.calcMeasures = intervalW;
        this.activityForm.$dirty = true;
    }
}

const CalendarItemActivityComponent: IComponentOptions = {
    bindings: {
        date: '=',
        data: '=',
        //details: '=',
        mode: '@',
        onCancel: '&',
        onAnswer: '&'
    },
    transclude: true,
    controller: CalendarItemActivityCtrl,
    template: require('./calendar-item-activity.component.html') as string
};

export default CalendarItemActivityComponent;