import './training-plan-assignment.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import { TrainingPlan } from "../training-plan/training-plan.datamodel";
import { IUserProfile } from "@api/user";
import { TrainingPlansService } from "../training-plans.service";

/**
 * Контроллер для формы присоведения тренировочных планов
 * В режиме просмотре показывает имеющиеся присвоения,
 * в режиме изменения позволяет отредактировать присвоения или ввести новое
 */
class TrainingPlanAssignmentCtrl implements IComponentController {

    plan: TrainingPlan;
    state: 'form' | 'list';
    athletes: Array<IUserProfile>;

    onEvent: (response: Object) => IPromise<void>;
    private dataExist: boolean = false;

    static $inject = ['TrainingPlansService'];

    constructor(private trainingPlansService: TrainingPlansService) {

    }

    $onInit() {
        if ( !this.plan.hasOwnProperty('assignmentList') ) {
            this.getPlanDetails();
        } else {
            this.dataExist = true;
        }
    }

    get isFormState (): boolean { return this.state === 'form'; }
    set isFormState (value: boolean) { this.state = 'form'; }
    get isListState (): boolean { return this.state === 'list'; }
    set isListState (value: boolean) { this.state = 'list'; }

    private getPlanDetails (): void {
        this.trainingPlansService.get(this.plan.id)
            .then(result => this.plan = new TrainingPlan(result), error => {debugger;})
            .then(() => this.dataExist = true);
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