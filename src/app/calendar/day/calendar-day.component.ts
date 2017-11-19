import './calendar-day.component.scss';
import moment from 'moment/src/moment.js';
import * as angular from 'angular';
import {IMessageService} from "../../core/message.service";
import ActivityService from "../../activity/activity.service";
import {CalendarService} from "../calendar.service";
import { IComponentOptions, IComponentController, IFormController,IPromise, IScope, merge, copy} from 'angular';
import { CalendarCtrl } from "../calendar.component";
import { ICalendarDayData } from "../calendar.interface";
import {ICalendarItem} from "../../../../api/calendar/calendar.interface";
import {isSpecifiedActivity, isCompletedActivity, clearActualDataActivity} from "../../activity/activity.function";
import { IUserProfile } from "@api/user";
import { getCalendarItem } from "../../calendar-item/calendar-item.function";
import { ICalendarItemDialogOptions } from "../../calendar-item/calendar-item-dialog.interface";
import { CalendarItemDialogService } from "../../calendar-item/calendar-item-dialog.service";
import { FormMode } from "../../application.interface";

class CalendarDayCtrl {

    // bind
    today: any;
    data: ICalendarDayData;
    owner: IUserProfile;
    currentUser: IUserProfile;
    selected: boolean;
    dynamicDates: boolean;
    trainingPlan: boolean;

    static $inject = ['$mdDialog','message','ActivityService','CalendarService','$scope','dialogs', 'CalendarItemDialogService'];

    constructor(
        private $mdDialog: any,
        private message: IMessageService,
        private ActivityService: ActivityService,
        private CalendarService: CalendarService,
        private $scope: IScope,
        private dialogs: any, private calendarItemDialog: CalendarItemDialogService){

    }

    isSpecified(item: ICalendarItem):boolean {
        return isSpecifiedActivity(item);
    }


    $onInit(){
	    let diff = moment().diff(moment(this.data.date),'days',true);
        this.today = diff >= 0 && diff < 1;
    }

    onSelect() {
        this.selected = !this.selected;
    }

    onDelete(){
        //this.dialogs.confirm({ text: 'deletePlanActivity' })
         //   .then(()=>this.calendar.onDelete(this.data.calendarItems));
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
                clickOutsideToClose: false,
                escapeToClose: true,
                fullscreen: true

            }).then(response => {}, ()=> {});
        }
        if(type === 'event'){
            this.$mdDialog.show({
                controller: DialogController,
                controllerAs: '$ctrl',
                template: `<md-dialog id="events" aria-label="Events">
                        <calendar-item-events 
                                flex layout="column" class="calendar-item-events"
                                data="$ctrl.data"
                                mode="put"
                                user="$ctrl.user"
                                on-cancel="cancel()" on-answer="answer(response)">
                        </calendar-item-events>
                   </md-dialog>`,
                parent: angular.element(document.body),
                targetEvent: $event,
                locals: {
                    data: data,
                    user: this.owner
                },
                bindToController: true,
                clickOutsideToClose: false,
                escapeToClose: true,
                fullscreen: true

            }).then(response => {}, ()=> {});
        }
        if(type === 'record'){
            this.$mdDialog.show({
                controller: DialogController,
                controllerAs: '$ctrl',
                template: `<md-dialog id="calendar-item-record" aria-label="Record">
                        <calendar-item-record 
                                data="$ctrl.data"
                                calendar-range="$ctrl.calendarRange"
                                mode="view"
                                on-cancel="cancel()">
                        </calendar-item-record>
                   </md-dialog>`,
                parent: angular.element(document.body),
                targetEvent: $event,
                locals: {
                    data: data,
                    calendarRange: [null, null]//this.calendar.calendarRange
                },
                bindToController: true,
                clickOutsideToClose: false,
                escapeToClose: true,
                fullscreen: true

            }).then(response => {}, ()=> {});
        }
    }

    postActivity (e: Event, data: ICalendarDayData): void {
        let options: ICalendarItemDialogOptions = {
            dateStart: data.date,
            currentUser: this.currentUser,
            owner: this.owner,
            popupMode: true,
            formMode: FormMode.Post,
            trainingPlanMode: this.trainingPlan
        };

        this.calendarItemDialog.activity(e, FormMode.Post, options)
            .then(() => {}, () => {});

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
                                user="$ctrl.user" popup="true"
                                on-cancel="cancel()" on-answer="answer(response)">
                        </calendar-item-activity>
                   </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: $event,
            locals: {
                date: data.date,//new Date(data.date), // дата дня в формате ГГГГ-ММ-ДД Date.UTC(data.date) + Date().getTimezoneOffset() * 60 * 1000, //
                user: this.owner
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
                data: {
                    date: data.date
                },
                user: this.owner
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: true,
            fullscreen: true
        }).then(response => {}, ()=> {});
    }

    newEvent($event, data) {
        this.$mdDialog.show({
            controller: DialogController,
            controllerAs: '$ctrl',
            template: `<md-dialog id="events" aria-label="Events">
                        <calendar-item-events 
                                flex layout="column" class="calendar-item-events"
                                data="$ctrl.data"
                                mode="post"
                                user="$ctrl.user"
                                on-cancel="cancel()" on-answer="answer(response)">
                        </calendar-item-events>
                   </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: $event,
            locals: {
                data: {
                    date: data.date
                },
                user: this.owner
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: true,
            fullscreen: true

        }).then(response => {}, () => {});
    }

    postRecord($event, data) {
        this.$mdDialog.show({
            controller: DialogController,
            controllerAs: '$ctrl',
            template: `<md-dialog id="calendar-item-record" aria-label="Record">
                        <calendar-item-record 
                                data="$ctrl.data"
                                calendar-range="$ctrl.calendarRange"
                                mode="post"
                                on-cancel="cancel()">
                        </calendar-item-record>
                   </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: $event,
            locals: {
                data: getCalendarItem('record', data.date, this.owner, this.currentUser ),
                calendarRange: [null,null]//this.calendar.calendarRange
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: true,
            fullscreen: true

        }).then(response => {}, () => {});
    }


    onDropActivity(srcItem: ICalendarItem, operation: string, srcIndex:number, trgDate:string, trgIndex: number) {

        let item: ICalendarItem = copy(srcItem);
        item.dateStart = moment(trgDate).utc().add(moment().utcOffset(),'minutes').format();//new Date(date);
        item.dateEnd = moment(trgDate).utc().add(moment().utcOffset(),'minutes').format();//new Date(date);

        switch (operation) {
            case 'move': {
                if(isCompletedActivity(item)){
                    this.dialogs.confirm({ text: 'dialogs.moveActualActivity' })
                    .then(() => this.CalendarService.postItem(clearActualDataActivity(item)))
                    .then(() => this.message.toastInfo('activityCopied'), error => error && this.message.toastError(error));
                } else {
                    this.CalendarService.putItem(item)
                    .then(() => this.message.toastInfo('activityMoved'))
                    .catch(error => this.message.toastError(error));
                }
                break;
            }
            case 'copy': {
                this.CalendarService.postItem(isCompletedActivity(item)? clearActualDataActivity(item) : item)
                    .then(() => this.message.toastInfo('activityCopied'))
                    .catch(error => this.message.toastError(error));
                break;
            }
        }
        return true;
    }

    onDropEvent(srcItem: ICalendarItem, operation: string, srcIndex:number, trgDate:string, trgIndex: number):boolean {
        let item: ICalendarItem = copy(srcItem);
        item.dateStart = moment(trgDate).utc().add(moment().utcOffset(),'minutes').format();//new Date(date);
        item.dateEnd = moment(trgDate).utc().add(moment().utcOffset(),'minutes').format();//new Date(date);

        switch (operation) {
            case 'move': {
                this.CalendarService.putItem(item)
                    .then(() => this.message.toastInfo('eventMoved'))
                    .catch(error => this.message.toastError(error));
                break;
            }
            case 'copy': {
                this.CalendarService.postItem(item)
                    .then(() => this.message.toastInfo('eventCopied'))
                    .catch(error => this.message.toastError(error));
                break;
            }
        }

        return true;
    }

    onDrag(event) {
        console.info('dnd drag event',event);
    }

    onCopied(item) {
        //debugger;
        //this.message.toastInfo('activityCopied');
        console.info('dnd copied event',item);

    }

    onMoved(item) {
        //debugger;
        console.info('dnd moved event', item);

    }

}

const CalendarDayComponent: IComponentOptions = {
    bindings: {
        data: '<',
        owner: '<',
        currentUser: '<',
        selected: '<',
        accent: '<',
        dynamicDates: '<',
        trainingPlan: '<',
        onSelect: '&'
    },
    require: {
        //calendar: '^calendar'
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