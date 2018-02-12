import './training-plan-assignment.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import { TrainingPlan } from "../training-plan/training-plan.datamodel";
import { IUserProfile } from "@api/user";
import { TrainingPlansService } from "../training-plans.service";
import { ITrainingPlanAssignment } from "../../../../api/trainingPlans/training-plans.interface";
import MessageService from "../../core/message.service";

/**
 * Контроллер для формы присоведения тренировочных планов
 * В режиме просмотре показывает имеющиеся присвоения,
 * в режиме изменения позволяет отредактировать присвоения или ввести новое
 */
class TrainingPlanAssignmentCtrl implements IComponentController {

    plan: TrainingPlan;
    state: 'form' | 'list';
    athletes: Array<IUserProfile>;

    onCancel: () => Promise<void>;
    private dataExist: boolean = false;
    private assign: ITrainingPlanAssignment;

    static $inject = ['TrainingPlansService', 'message'];

    constructor(
        private trainingPlansService: TrainingPlansService,
        private messageService: MessageService) {

    }

    $onInit() {
        if ( !this.plan.hasOwnProperty('assignmentList') ) {
            this.getPlanDetails();
        } else {
            this.dataExist = true;
            if (!this.state) { this.isListState = true; }
        }
    }

    setFormData (assign: ITrainingPlanAssignment): void {
        this.assign = assign;
        this.isFormState = true;
    }

    get isFormState (): boolean { return this.state === 'form'; }
    set isFormState (value: boolean) { this.state = 'form'; }
    get isListState (): boolean { return this.state === 'list'; }
    set isListState (value: boolean) { this.state = 'list'; }

    private getPlanDetails (): void {

        this.trainingPlansService.get(this.plan.id)
            .then(result => this.plan = new TrainingPlan(result), error => this.errorHandler(error))
            .then(() => this.plan.calendarItems.length === 0 && this.closeHandler('planDontHaveItemsForAssignment'))
            .then(() => this.trainingPlansService.getAssignment(this.plan.id))
            .then(result => this.plan.assignmentList = [...result.arrayResult], error => this.errorHandler(error))
            .then(() => this.dataExist = true)
            .then(() => !this.state && (this.plan.assignmentList.length > 0 && (this.isListState = true) || (this.isFormState = true)));
    }

    closeHandler (message: string): void {
        this.onCancel();
        this.dialogs.info();
    }

    errorHandler (error: string): void {
        this.messageService.toastError(error);
        this.onCancel();
    }
}

export const TrainingPlanAssignmentComponent:IComponentOptions = {
    bindings: {
        plan: '<',
        state: '<',
        athletes: '<',
        onCancel: '&'
    },
    controller: TrainingPlanAssignmentCtrl,
    template: require('./training-plan-assignment.component.html') as string
};