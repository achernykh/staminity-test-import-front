import './training-plan-builder.component.scss';
import moment from 'moment/min/moment-with-locales.js';
import {IComponentOptions, IComponentController, IPromise,IScope,IAnchorScrollService} from 'angular';
import { Calendar } from "../../calendar/calendar.datamodel";
import { CalendarService } from "../../calendar/calendar.service";
import { SessionService } from "../../core";
import { IUserProfile } from "../../../../api/user/user.interface";

class TrainingPlanBuilderCtrl implements IComponentController {

    data: any;
    onEvent: (response: Object) => IPromise<void>;
    currentUser: IUserProfile;

    // private
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
        this.calendar = new Calendar(this.$scope, this.$anchorScroll, this.calendarService, this.currentUser);
        this.calendar.toDate(new Date());
    }
}

const TrainingPlanBuilderComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlanBuilderCtrl,
    template: require('./training-plan-builder.component.html') as string
};

export default TrainingPlanBuilderComponent;