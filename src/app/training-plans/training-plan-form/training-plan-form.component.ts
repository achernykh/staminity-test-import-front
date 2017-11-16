import './training-plan-form.component.scss';
import { IComponentOptions, IComponentController, IPromise } from 'angular';
import MessageService from "@app/core/message.service";
import { FormMode } from "../../application.interface";
import { IRevisionResponse } from "@api/core";
import { TrainingPlan } from "../training-plan/training-plan.datamodel";
import { TrainingPlansService } from "../training-plans.service";
import { TrainingPlanConfig } from "../training-plan/training-plan.config";

class TrainingPlanFormCtrl implements IComponentController {

    // bind
    plan: TrainingPlan;
    mode: FormMode;
    onSave: (response: { mode: FormMode, plan: TrainingPlan }) => IPromise<void>;

    //inject
    static $inject = [ 'TrainingPlansService', 'trainingPlanConfig', 'message' ];

    constructor (private trainingPlanService: TrainingPlansService,
                 private config: TrainingPlanConfig,
                 private message: MessageService) {

    }

    $onInit () {
        this.plan = new TrainingPlan(this.plan); //Object.assign({}, this.plan);//deepCopy(this.plan);
    }

    save () {
        if (this.mode === FormMode.Post) {
            this.trainingPlanService
                .post(this.plan.clear())
                .then((response: IRevisionResponse) => this.onSave({
                        mode: this.mode,
                        plan: this.plan.applyRevision(response)
                    }),
                    (error) => this.message.toastInfo(error));
        }

        if (this.mode === FormMode.Put) {
            this.trainingPlanService
                .put(this.plan.clear())
                .then((response: IRevisionResponse) => this.onSave({
                        mode: this.mode,
                        plan: this.plan.applyRevision(response)
                    }),
                    (error) => this.message.toastInfo(error));
        }
    }

    get isViewMode (): boolean {
        return this.mode === FormMode.View;
    }

    setChangeMode (): void {
        this.mode = FormMode.Put;
    }

    private toggle (item, list): void {
        let idx = list.indexOf(item);
        if (idx > -1) {
            list.splice(idx, 1);
        }
        else {
            list.push(item);
        }
    }

    private exists (item, list): boolean {
        return list.indexOf(item) > -1;
    }
}

const TrainingPlanFormComponent: IComponentOptions = {
    bindings: {
        plan: '<',
        mode: '<',
        onCancel: '&',
        onSave: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlanFormCtrl,
    template: require('./training-plan-form.component.html') as string
};

export default TrainingPlanFormComponent;