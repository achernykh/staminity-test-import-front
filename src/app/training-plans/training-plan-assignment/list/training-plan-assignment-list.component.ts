import './training-plan-assignment-list.component.scss';
import {IComponentOptions, IComponentController} from 'angular';
import { TrainingPlan } from "../../training-plan/training-plan.datamodel";
import { TrainingPlansService } from "../../training-plans.service";
import { ITrainingPlanAssignment } from "@api/trainingPlans/training-plans.interface";

class TrainingPlanAssignmentListCtrl implements IComponentController {

    plan: TrainingPlan;
    onForm: () => Promise<any>;
    public onEvent: (response: Object) => Promise<void>;
    static $inject = ['TrainingPlansService'];

    constructor(private trainingPlansService: TrainingPlansService) {

    }

    $onInit() {

    }

    delete (assign: ITrainingPlanAssignment): void {
        this.trainingPlansService.modifyAssignment(this.plan.id, {
            mode: 'D',
            id: assign.id
        }).then(response => {debugger;}, error => {debugger;});
    }

    splice (id: number): void {
        this.plan.assignmentList.splice(this.plan.assignmentList.findIndex(a => a.id === id),1);
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