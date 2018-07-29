import './training-plan-assignment-form.component.scss';
import moment from 'moment/min/moment-with-locales.js';
import {IComponentOptions, IComponentController, IPromise, element} from 'angular';
import { IUserProfile } from "@api/user";
import { ITrainingPlanAssignmentRequest } from "@api/trainingPlans";
import { TrainingPlansService } from "@app/training-plans/training-plans.service";
import { TrainingPlan } from "@app/training-plans/training-plan/training-plan.datamodel";
import { ITrainingPlanAssignment } from "../../../../../api/trainingPlans/training-plans.interface";
import MessageService from "../../../core/message.service";
import { FormMode } from "../../../application.interface";

class TrainingPlanAssignmentFormCtrl implements IComponentController {

    plan: TrainingPlan;
    assign: ITrainingPlanAssignment;
    athletes: Array<IUserProfile>;
    onBack: () => Promise<any>;
    onCancel: () => Promise<any>;
    onSave: (response: {mode: FormMode, assign: ITrainingPlanAssignmentRequest}) => Promise<any>;

    // private
    private readonly applyModeTypes: Array<string> = ['P', 'I'];
    private readonly applyDateTypes: Array<string> = ['F', 'T'];
    private data: ITrainingPlanAssignmentRequest;
    private multiplyAthletes: boolean = false;

    static $inject = ['$scope', '$compile', 'TrainingPlansService', 'message'];

    constructor(private $scope: any, private  $compile, private trainingPlansService: TrainingPlansService, private message: MessageService) {
        $scope.onlyFirstPlanDaysPredicate = (date: Date) => this.onlyFirstPlanDaysPredicate(date);
    }

    $onInit() {
        if (!this.assign) {
            this.data = Object.assign({
                userId: this.athletes.length === 1 ? [this.athletes[0].userId] : [],
                applyMode: 'P',
                applyDateMode: 'F',
                enabledSync: this.plan.propagateMods || null,
                applyFromDate: this.plan.isFixedCalendarDates ?
                    moment(this.plan.startDate).diff(moment(), 'days') >= 0 && new Date(this.plan.startDate) || moment().add(1, 'week').startOf('week').toDate() :
                    moment().add(1, 'week').startOf('week').toDate(),
                applyToDate: null
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
                applyFromDate: this.assign.applyFromDate || null,
                applyToDate: this.assign.applyToDate || null
            };
        }

        if ( this.plan.isFixedCalendarDates && !this.data.firstItemDate ) {
            //this.data.applyFromDate = new Date(moment(this.plan.startDate).format('YYYY-MM-DD'));
        }

    }

    athleteSelectorText(): string {
        return this.data && this.data.hasOwnProperty('userId') && this.data.userId &&
            this.data.userId.map(u =>
                `${this.athletes.filter(a => a.userId === Number(u))[0].public.firstName} ` +
                `${this.athletes.filter(a => a.userId === Number(u))[0].public.lastName}`).join(', ') || null;
    }

    save (): void {
        let assign: ITrainingPlanAssignmentRequest = {
            mode: 'I',
            id: this.data.id,
            userId: this.data.userId && [...this.data.userId].map(id => Number(id)),
            applyMode: this.data.applyMode,
            applyDateMode: this.data.applyDateMode,
            firstItemDate: this.plan.fistItemAssignmentDate(this.data.applyMode, this.data.applyDateMode, this.data.applyFromDate, this.data.applyToDate),
            enabledSync: this.enabledSync,
            applyFromDate: this.data.applyFromDate && moment(this.data.applyFromDate).utc().add(moment().utcOffset(),'minutes').format('YYYY-MM-DDTHH:mm:ss') || null,
            applyToDate: this.data.applyToDate && moment(this.data.applyToDate).utc().add(moment().utcOffset(),'minutes').format('YYYY-MM-DDTHH:mm:ss') || null,
        };
        this.trainingPlansService.modifyAssignment(this.plan.id, assign)
            .then(response => this.onSave({mode: FormMode.Post, assign: assign}), e => e && this.message.toastError(e));
    }

    private onlyFirstPlanDaysPredicate (date: Date): boolean {
        console.debug('check calendar date', date, date.getDay(), this.plan.firstCalendarDate, this.plan.firstCalendarDate.getDay());
        return this.data.applyMode === 'I' || date.getDay() === this.plan.firstCalendarDate.getDay();
    };

    get enabledSync (): boolean {
        return this.plan.isEnablePropagateMods(this.data.applyDateMode === 'F' ?
                this.data.applyFromDate : this.data.applyToDate, this.data.applyDateMode) && this.data.enabledSync;
    }
}

export const TrainingPlanAssignmentFormComponent:IComponentOptions = {
    bindings: {
        plan: '<',
        assign: '<',
        athletes: '<',
        onBack: '&',
        onCancel: '&',
        onSave: '&',
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlanAssignmentFormCtrl,
    template: require('./training-plan-assignment-form.component.html') as string
};