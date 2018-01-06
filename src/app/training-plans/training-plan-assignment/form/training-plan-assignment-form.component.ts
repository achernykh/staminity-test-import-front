import './training-plan-assignment-form.component.scss';
import moment from 'moment/min/moment-with-locales.js';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import { IUserProfile } from "@api/user";
import { ITrainingPlanAssignmentRequest } from "@api/trainingPlans";
import { TrainingPlansService } from "@app/training-plans/training-plans.service";
import { TrainingPlan } from "@app/training-plans/training-plan/training-plan.datamodel";

class TrainingPlanAssignmentFormCtrl implements IComponentController {

    plan: TrainingPlan;
    data: ITrainingPlanAssignmentRequest;
    athletes: Array<IUserProfile>;
    onBack: () => Promise<any>;
    onCancel: () => Promise<any>;

    // private
    private readonly applyModeTypes: Array<string> = ['P', 'I'];
    private readonly applyDateTypes: Array<string> = ['F', 'E'];
    private applyFromDate: Date;
    private applyToDate: Date;

    static $inject = ['TrainingPlansService'];

    constructor(private trainingPlansService: TrainingPlansService) {

    }

    $onInit() {

        if (!this.data) {
            this.data = Object.assign({ applyMode: 'P', applyDateMode: 'F' });
        }

        if ( this.plan.isFixedCalendarDates && !this.data.firstItemDate ) {
            this.applyFromDate = new Date(moment(this.plan.startDate).format('YYYY-MM-DD'));
        }

    }

    athleteSelectorText(): string {
        return this.data && this.data.hasOwnProperty('userId') && this.data.userId &&
            this.data.userId.map(u =>
                `${this.athletes.filter(a => a.userId === Number(u))[0].public.firstName} ` +
                `${this.athletes.filter(a => a.userId === Number(u))[0].public.lastName}`).join(', ') || null;
    }

    save (): void {
        this.trainingPlansService.assignment(this.plan.id, {
            mode: 'I',
            id: null,
            userId: this.data.userId,
            applyMode: this.data.applyMode,
            applyDateMode: this.data.applyDateMode,
            firstItemDate: this.fistItemDate,
            enabledSync: null
        }).then(response => {debugger;}, error => {debugger;});
    }

    get fistItemDate (): string {

        // Вариант 1. Тип Даты = План & Дата = с начала
        if ( this.data.applyMode === 'P' && this.data.applyDateMode === 'F' ) {
            return moment(this.applyFromDate).add(this.plan.firstItemCalendarShift, 'days').format('YYYY-MM-DD');
        }
        // Вариант 2. Тип Даты = План & Дата = с конца
        else if ( this.data.applyMode === 'P' && this.data.applyDateMode === 'T' ) {
            return moment(this.applyToDate).subtract(this.plan.firstItemCalendarShift, 'days').format('YYYY-MM-DD');
        }
        // Вариант 3.
        else if ( this.data.applyDateMode === 'F' ) {
            return moment(this.applyFromDate).format('YYYY-MM-DD');
        }
        // Вариант 4.
        else if ( this.data.applyDateMode === 'T' ) {
            return moment(this.applyToDate).format('YYYY-MM-DD');
        }
    }
}

export const TrainingPlanAssignmentFormComponent:IComponentOptions = {
    bindings: {
        plan: '<',
        data: '<',
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