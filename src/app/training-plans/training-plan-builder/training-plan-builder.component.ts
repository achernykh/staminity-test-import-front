import './training-plan-builder.component.scss';
import moment from 'moment/min/moment-with-locales.js';
import {IComponentOptions, IComponentController, IPromise,IScope,IAnchorScrollService} from 'angular';
import { Calendar } from "../../calendar/calendar.datamodel";
import { CalendarService } from "../../calendar/calendar.service";
import { SessionService } from "../../core";
import { IUserProfile } from "../../../../api/user/user.interface";
import { TrainingPlan } from "../training-plan/training-plan.datamodel";
import { FormMode } from "../../application.interface";
import { ICalendarItem } from "../../../../api/calendar/calendar.interface";
import { getItemById } from "../../calendar/calendar.functions";

class TrainingPlanBuilderCtrl implements IComponentController {

    plan: TrainingPlan;
    onEvent: (response: Object) => IPromise<void>;
    currentUser: IUserProfile;

    // private
    private dynamicDates: boolean;
    private weekdayNames: Array<number> = [];
    private calendar: Calendar;
    static $inject = ['$scope', '$anchorScroll', 'CalendarService', 'SessionService'];

    constructor(
        private $scope: IScope,
        private $anchorScroll: IAnchorScrollService,
        private calendarService: CalendarService,
        private session: SessionService
    ) {

    }

    $onInit() {
        this.weekdayNames = moment.weekdays(true);
        this.currentUser = this.session.getUser();
        this.calendar = new Calendar(this.$scope, this.$anchorScroll, this.calendarService, this.currentUser, this.plan.calendarItems);
        this.dynamicDates = !this.plan.isFixedCalendarDates;
        this.calendar.toDate(this.dynamicDates ? new Date() : this.plan.startDate);
    }

    /**
     * Обновление записей календаря по событий пользователя
     * @param formMode
     * @param item
     */
    saveItem (formMode: FormMode, item: ICalendarItem): void {
        debugger;
        switch (formMode) {
            case FormMode.Post: {
                this.calendar.post(item);
                break;
            }
            case FormMode.Put: {
                this.calendar.delete(getItemById(this.calendar.weeks, item.calendarItemId));
                this.calendar.post(item);
                break;
            }
            case FormMode.Delete: {
                this.calendar.delete(getItemById(this.calendar.weeks, item.calendarItemId));
                break;
            }
        }
    }
}

const TrainingPlanBuilderComponent:IComponentOptions = {
    bindings: {
        plan: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlanBuilderCtrl,
    template: require('./training-plan-builder.component.html') as string
};

export default TrainingPlanBuilderComponent;