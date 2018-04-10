import './training-plan-assignment-list.component.scss';
import {IComponentOptions, IComponentController} from 'angular';
import {StateService} from 'angular-ui-router';
import { TrainingPlan } from "../../training-plan/training-plan.datamodel";
import { TrainingPlansService } from "../../training-plans.service";
import { ITrainingPlanAssignment } from "@api/trainingPlans/training-plans.interface";
import MessageService from "../../../core/message.service";

class TrainingPlanAssignmentListCtrl implements IComponentController {

    plan: TrainingPlan;
    onForm: () => Promise<any>;
    public onEvent: (response: Object) => Promise<void>;
    static $inject = ['$state', 'TrainingPlansService', 'dialogs', 'message'];

    constructor(
        private $state: StateService,
        private trainingPlansService: TrainingPlansService,
        private dialogs: any,
        private message: MessageService) {

    }

    $onInit() {

    }

    delete (assign: ITrainingPlanAssignment): void {

        this.dialogs.confirm({ text: 'dialogs.deleteSelectedAssignment' })
            .then(() => this.trainingPlansService.modifyAssignment(this.plan.id, { mode: 'D', id: assign.id }), () => { throw null;})
            .then(
                () => {
                    this.message.toastInfo('assignmentDeleted');
                    this.splice(assign.id);
                },
                error => error && this.errorHandler(error));
    }

    splice (id: number): void {
        this.plan.assignmentList.splice(this.plan.assignmentList.findIndex(a => a.id === id),1);
    }

    /**
     * Обработчик ответа с ошибкой
     * Выводим тост и реджектим цепочку прописов
     * @param error
     */
    private errorHandler (error: string): Promise<any> {
        this.message.toastError(error);
        throw new Error();
    }
}

export const TrainingPlanAssignmentListComponent:IComponentOptions = {
    bindings: {
        plan: '<',
        onForm: '&',
        onCancel: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlanAssignmentListCtrl,
    template: require('./training-plan-assignment-list.component.html') as string
};