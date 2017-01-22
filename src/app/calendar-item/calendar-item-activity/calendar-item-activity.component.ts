import { IComponentOptions, IComponentController, IChangesObject,IPromise} from 'angular';
import moment from 'moment/src/moment.js';
import {CalendarService} from "../../calendar/calendar.service";
import UserService from "../../core/user.service";
import ActivityService from "../../activity/activity.service";
import {IMessageService} from "../../core/message.service";
import {IActivityHeader, IActivityDetails} from "../../../../api/activity/activity.interface";
import './calendar-item-activity.component.scss';

class CalendarItemActivityData {

    constructor(mode, data) {

    }
    prepare(){

    }
    compile(){

    }
}
//CalendarItemMeasurementData.$inject = ['UserService'];

class CalendarItemActivityCtrl implements IComponentController{

    private itemHeader: IActivityHeader;
    private itemDetails: IActivityDetails;
    public data: any;
    public mode: any;
    public item: any;
    public onAnswer: (response: Object) => IPromise<void>;
    public onCancel: (response: Object) => IPromise<void>;


    static $inject = ['CalendarService','UserService','ActivityService','MessageService'];

    constructor(
        private CalendarService: CalendarService,
        private UserService: UserService,
        private ActivityService: ActivityService,
        private message: IMessageService) {

    }

    $onInit() {
        console.log('data=',this, moment().format());
        this.item = new CalendarItemActivityData( this.mode, this.data);
    }

    // Функции можно было бы перенсти в компонент Календаря, но допускаем, что компоненты Активность, Измерения и пр.
    // могут вызваны из любого другого представления
    onSave() {
        console.log('save',this.item);
        if (this.mode === 'post') {
            this.CalendarService.postItem(this.item.prepare())
                .then((response)=> {
                    this.item.compile(response);// сохраняем id, revision в обьекте
                    console.log('result=',this.item);
                    this.onAnswer({response: {type:'post',item:this.item}});
                });
        }
        if (this.mode === 'put') {
            this.CalendarService.putItem(this.item.prepare())
                .then((response)=> {
                    this.item.compile(response); // сохраняем id, revision в обьекте
                    console.log('result=',this.item);
                    this.onAnswer({response: {type:'put',item:this.item}});
                });
        }
    }

    onDelete() {
        this.CalendarService.deleteItem('F', [this.item.calendarItemId])
            .then((response)=> {
                console.log('delete result=',response);
                this.onAnswer({response: {type:'delete',item:this.item}});
            });
    }
}

const CalendarItemActivityComponent: IComponentOptions = {
    bindings: {
        data: '=',
        mode: '@',
        onCancel: '&',
        onAnswer: '&'
    },
    transclude: true,
    controller: CalendarItemActivityCtrl,
    template: require('./calendar-item-activity.component.html') as string
};

export default CalendarItemActivityComponent;