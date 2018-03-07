import './training-plan-store-item.component.scss';
import {IComponentOptions, IComponentController} from 'angular';
import MessageService from "@app/core/message.service";
import { TrainingPlan } from "../training-plan/training-plan.datamodel";
import { TrainingPlansService } from "../training-plans.service";
import { TrainingPlanConfig } from "../training-plan/training-plan.config";

class TrainingPlanStoreItemCtrl implements IComponentController {

    // bind
    data: TrainingPlan;
    onSave: () => Promise<void>;
    onCancel: () => Promise<any>;

    // private
    private plan: TrainingPlan;
    private dataLoading: boolean = false;

    static $inject = ['TrainingPlansService', 'trainingPlanConfig', 'message'];

    constructor(
        private trainingPlanService: TrainingPlansService,
        private trainingPlanConfig: TrainingPlanConfig,
        private message: MessageService) {

    }

    $onInit() {
        this.getPlanDetails();
    }

    private getPlanDetails (): void {
        this.trainingPlanService.getStoreItem(this.data.id)
            .then(result => this.plan = new TrainingPlan(result, this.trainingPlanConfig), error => this.errorHandler(error))
            .then(() => this.dataLoading = true);
    }

    errorHandler (error: string): void {
        this.message.toastError(error);
        this.onCancel();
    }
}

export const TrainingPlanStoreItemComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onCancel: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlanStoreItemCtrl,
    template: require('./training-plan-store-item.component.html') as string
};
