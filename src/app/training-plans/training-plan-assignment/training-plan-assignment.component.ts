import './training-plan-assignment.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import { TrainingPlan } from "@app/training-plans/training-plan/training-plan.datamodel";
import { FormMode } from "@app/application.interface";

/**
 * Контроллер для формы присоведения тренировочных планов
 * В режиме просмотре показывает имеющиеся присвоения,
 * в режиме изменения позволяет отредактировать присвоения или ввести новое
 */
class TrainingPlanAssignmentCtrl implements IComponentController {

    plan: TrainingPlan;
    state: 'form' | 'list';

    onEvent: (response: Object) => IPromise<void>;

    static $inject = [];

    constructor() {

    }

    $onInit() {

    }

    get isFormState (): boolean { return this.state === 'form'; }
    set isFormState (value: boolean) { this.state = 'form'; }
    get isListState (): boolean { return this.state === 'list'; }
    set isListState (value: boolean) { this.state = 'list'; }
}

export const TrainingPlanAssignmentComponent:IComponentOptions = {
    bindings: {
        plan: '<',
        state: '<',
        onEvent: '&'
    },
    controller: TrainingPlanAssignmentCtrl,
    template: require('./training-plan-assignment.component.html') as string
};