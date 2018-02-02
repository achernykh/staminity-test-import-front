import './training-plan-assignment-form.component.scss';
import moment from 'moment/min/moment-with-locales.js';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import { IUserProfile } from "@api/user";
import { ITrainingPlanAssignmentRequest } from "@api/trainingPlans";
import { TrainingPlansService } from "@app/training-plans/training-plans.service";
import { TrainingPlan } from "@app/training-plans/training-plan/training-plan.datamodel";
import { ITrainingPlanAssignment } from "../../../../../api/trainingPlans/training-plans.interface";
import MessageService from "../../../core/message.service";

class TrainingPlanAssignmentFormCtrl implements IComponentController {

    plan: TrainingPlan;
    assign: ITrainingPlanAssignment;
    athletes: Array<IUserProfile>;
    onBack: () => Promise<any>;
    onCancel: () => Promise<any>;

    // private
    private readonly applyModeTypes: Array<string> = ['P', 'I'];
    private readonly applyDateTypes: Array<string> = ['F', 'T'];
    private data: ITrainingPlanAssignmentRequest;

    static $inject = ['$scope', 'TrainingPlansService', 'message'];

    constructor(private $scope: any, private trainingPlansService: TrainingPlansService, private message: MessageService) {
        $scope.onlyFirstPlanDaysPredicate = (date: Date) => this.onlyFirstPlanDaysPredicate(date);
    }

    $onInit() {
        if (!this.assign) {
            this.data = Object.assign({
                applyMode: 'P',
                applyDateMode: 'F',
                enabledSync: this.plan.propagateMods || null
            });
        } else {
            this.data = {
                mode: 'U',
                id: this.assign.id,
                userId: [this.assign.user.userId],
                applyMode: this.assign.applyMode,
                applyDateMode: this.assign.applyDateMode,
                firstItemDate: this.assign.firstItemDate,
                enabledSync: this.assign.enabledSync,
                applyFromDate: this.data.applyFromDate,
                applyToDate: this.data.applyToDate
            };
        }

        if ( this.plan.isFixedCalendarDates && !this.data.firstItemDate ) {
            this.data.applyFromDate = new Date(moment(this.plan.startDate).format('YYYY-MM-DD'));
        }

    }

    isStartDate (date: Date): boolean {
        return this.data.applyDateMode === 'F' && moment(this.plan.startDate).isSameOrAfter(moment(date), 'day');
    }

    athleteSelectorText(): string {
        return this.data && this.data.hasOwnProperty('userId') && this.data.userId &&
            this.data.userId.map(u =>
                `${this.athletes.filter(a => a.userId === Number(u))[0].public.firstName} ` +
                `${this.athletes.filter(a => a.userId === Number(u))[0].public.lastName}`).join(', ') || null;
    }

    save (): void {
        this.trainingPlansService.modifyAssignment(this.plan.id, {
            mode: 'I',
            id: this.data.id,
            userId: this.data.userId && [...this.data.userId].map(id => Number(id)),
            applyMode: this.data.applyMode,
            applyDateMode: this.data.applyDateMode,
            firstItemDate: this.fistItemDate,
            enabledSync: this.data.enabledSync,
            applyFromDate: this.data.applyFromDate,
            applyToDate: this.data.applyToDate
        }).then(response => this.onCancel(), error => this.message.toastError(error));
    }

    private onlyFirstPlanDaysPredicate (date: Date): boolean {
        //console.debug('check calendar date', date.getDay(), new Date(this.plan.startDate).getDay());
        return date.getDay() === new Date(this.plan.startDate).getDay();
    };

    get fistItemDate (): string {
        // Вариант 1. Тип Даты = План & Дата = с начала
        if ( this.data.applyMode === 'P' && this.data.applyDateMode === 'F' ) {
            return moment(this.data.applyFromDate).add(this.plan.firstItemCalendarShift, 'days').format('YYYY-MM-DD');
        }
        // Вариант 2. Тип Даты = План & Дата = с конца
        else if ( this.data.applyMode === 'P' && this.data.applyDateMode === 'T' ) {
            return moment(this.data.applyToDate).subtract(this.plan.lastItemCalendarShift, 'days').format('YYYY-MM-DD');
        }
        // Вариант 3.
        else if ( this.data.applyDateMode === 'F' ) {
            return moment(this.data.applyFromDate).format('YYYY-MM-DD');
        }
        // Вариант 4.
        else if ( this.data.applyDateMode === 'T' ) {
            return moment(this.data.applyToDate).format('YYYY-MM-DD');
        }
    }
}

export const TrainingPlanAssignmentFormComponent:IComponentOptions = {
    bindings: {
        plan: '<',
        assign: '<',
        athletes: '<',
        onBack: '&',
        onCancel: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlanAssignmentFormCtrl,
    template: require('./training-plan-assignment-form.component.html') as string
};