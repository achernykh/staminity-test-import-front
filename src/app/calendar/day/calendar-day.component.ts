import './calendar-day.component.scss';
import moment from 'moment/src/moment.js';
import * as angular from 'angular';
import {IMessageService} from "../../core/message.service";
import ActivityService from "../../activity/activity.service";
import {CalendarService} from "../calendar.service";
import { IComponentOptions, IComponentController, IFormController,IPromise, IScope, merge} from 'angular';
import {CalendarCtrl, ICalendarDayData} from "../calendar.component";

class CalendarDayCtrl {

    today: any;
    data: ICalendarDayData;
    selected: boolean;
    calendar: CalendarCtrl;

    static $inject = ['$mdDialog','message','ActivityService','CalendarService','$scope','dialogs'];

    constructor(
        private $mdDialog: any,
        private message: IMessageService,
        private ActivityService: ActivityService,
        private CalendarService: CalendarService,
        private $scope: IScope,
        private dialogs: any){

    }

    $onInit(){
	    let diff = moment().diff(moment(this.data.date),'days',true);
        this.today = diff >= 0 && diff < 1;
    }

    onSelect() {
        this.selected = !this.selected;
    }

    onDelete(){
        //this.dialogs.confirm('deletePlanActivity')
         //   .then(()=>this.calendar.onDelete(this.data.calendarItems),()=>{});
    }
    onPaste(){
        //this.calendar.onPasteDay(this.data.date)
    }
    onCopy(){
        //this.calendar.onCopyItem(this.data.calendarItems)
    }

    onOpen($event, type, data) {

        if(type === 'measurement'){
            this.$mdDialog.show({
                controller: DialogController,
                controllerAs: '$ctrl',
                template:
                    `<md-dialog id="measurement" aria-label="Measurement">
                        <calendar-item-measurement
                                flex layout="column" class="calendar-item-measurement"
                                data="$ctrl.data" mode="put"
                                on-cancel="cancel()" on-answer="answer(response)">
                        </calendar-item-measurement>
                   </md-dialog>`,
                parent: angular.element(document.body),
                targetEvent: $event,
                locals: {
                    data: data
                },
                bindToController: true,
                clickOutsideToClose: true,
                escapeToClose: true,
                fullscreen: true

            }).then(response => {}, ()=> {});
        }
    }

    newActivity($event, data){
        this.$mdDialog.show({
            controller: DialogController,
            controllerAs: '$ctrl',
            template:
                `<md-dialog id="post-activity" aria-label="Activity">
                        <calendar-item-activity
                                layout="row" class="calendar-item-activity"
                                date="$ctrl.date"
                                mode="'post'"
                                user="$ctrl.user"
                                on-cancel="cancel()" on-answer="answer(response)">
                        </calendar-item-activity>
                   </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: $event,
            locals: {
                date: data.date,//new Date(data.date), // дата дня в формате ГГГГ-ММ-ДД Date.UTC(data.date) + Date().getTimezoneOffset() * 60 * 1000, //
                user: this.calendar.user
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: false,
            fullscreen: true
        }).then(response => {}, ()=>{});
    }

    newMeasurement($event, data){
        this.$mdDialog.show({
            controller: DialogController,
            controllerAs: '$ctrl',
            template: `<calendar-item-measurement
                            class="calendar-item-measurement"
                            data="$ctrl.data"
                            mode="post"
                            user="$ctrl.user"
                            on-cancel="cancel()" on-answer="answer(response)">
                      </calendar-item-measurement>`,
            parent: angular.element(document.body),
            targetEvent: $event,
            locals: {
                data: data,
                user: this.calendar.user
            },
            bindToController: true,
            clickOutsideToClose: true,
            escapeToClose: true,
            fullscreen: true
        }).then(response => {}, ()=> {});
    }

    newWeekend($event, data) {
        this.$mdDialog.show({
            controller: DialogController,
            controllerAs: '$ctrl',
            template: `<md-dialog id="events" aria-label="Events">
                        <calendar-item-events
                                flex layout="column" class="calendar-item-events"
                                data="$ctrl.data" mode="put"
                                on-cancel="cancel()" on-answer="answer(response)">
                        </calendar-item-events>
                   </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: $event,
            locals: {
                data: data
            },
            bindToController: true,
            clickOutsideToClose: true,
            escapeToClose: true,
            fullscreen: true

        }).then(response => {}, () => {});
    }


    onDrop(date,index,item, type) {
        console.info('dnd drop event',date,index,item,type);
        item.dateStart = new Date(date);
        item.dateEnd = new Date(date);
        this.CalendarService.postItem(item)
            .then(() => {}, error => this.message.toastError(error));
        return item;
    }

    onDrag(event) {
        console.info('dnd drag event',event);
    }

    onCopied(item) {
        this.message.toastInfo('activityCopied');
        console.info('dnd copied event',item);
    }

    onMoved(item) {
        console.info('dnd moved event', item);
        this.message.toastInfo('activityMoved');
        this.CalendarService.deleteItem('F',[item.calendarItemId])
            .then(() => {}, error => this.message.toastError(error));
    }

}

const CalendarDayComponent: IComponentOptions = {
    bindings: {
        data: '<',
        selected: '<',
        accent: '<',
        onSelect: '&'
    },
    require: {
        calendar: '^calendar'
    },
    controller: CalendarDayCtrl,
    template: require('./calendar-day.component.html') as string
};

export default CalendarDayComponent;

function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        console.log('cancel');
        $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
}
DialogController.$inject = ['$scope','$mdDialog'];