import './training-plan-form.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {TrainingPlan} from "../training-plan/training-plan.datamodel";
import {TrainingPlansService} from "../training-plans.service";
import {IMessageService} from "../../core/message.service";
import { IRevisionResponse } from "@api/core";
import { FormMode } from "../../application.interface";
import { deepCopy } from "../../share/data/data.finctions";

class TrainingPlanFormCtrl implements IComponentController {

    plan: TrainingPlan;
    mode: FormMode;
    onSave: (response: Object) => IPromise<void>;

    static $inject = ['TrainingPlansService', 'message'];

    constructor(private trainingPlanService: TrainingPlansService, private message: IMessageService) {

    }

    $onInit() {
        this.plan = new TrainingPlan(this.plan); //Object.assign({}, this.plan);//deepCopy(this.plan);
    }

    save () {
        if (this.mode === FormMode.Post) {
            this.trainingPlanService
                .post(this.plan.clear())
                .then((response: IRevisionResponse) => this.onSave({plan: this.plan.applyRevision(response)}),
                    (error) => this.message.toastInfo(error));
        }

        if (this.mode === FormMode.Put) {
            this.trainingPlanService
                .put(this.plan.clear())
                .then((response: IRevisionResponse) => this.onSave({plan: this.plan.applyRevision(response)}),
                    (error) => this.message.toastInfo(error));
        }
    }

    get isViewMode (): boolean {
        return this.mode === FormMode.View;
    }

    setChangeMode (): void {
        this.mode = FormMode.Put;
    }
}

const TrainingPlanFormComponent:IComponentOptions = {
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