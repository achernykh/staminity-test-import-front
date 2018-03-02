import './training-plan-store-item.component.scss';
import {IComponentOptions, IComponentController} from 'angular';
import MessageService from "@app/core/message.service";
import { TrainingPlan } from "../training-plan/training-plan.datamodel";
import { TrainingPlansService } from "../training-plans.service";

class TrainingPlanStoreItemCtrl implements IComponentController {

    // bind
    data: TrainingPlan;
    onSave: () => Promise<void>;
    onCancel: () => Promise<any>;

    // private
    private plan: TrainingPlan;
    private dataLoading: boolean = false;

    static $inject = ['TrainingPlansService', 'message'];

    constructor(private trainingPlanService: TrainingPlansService, private message: MessageService) {

    }

    $onInit() {
        this.getPlanDetails();
    }

    private getPlanDetails (): void {
        //if ( this.mode === FormMode.Post /**|| this.plan.hasOwnProperty('calendarItems')**/ ) { return; }
        this.trainingPlanService.get(this.data.id)
            .then(result => this.plan = new TrainingPlan(result), error => this.errorHandler(error))
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
