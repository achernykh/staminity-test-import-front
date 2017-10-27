import './training-plan-form.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {TrainingPlan} from "../training-plan/training-plan.datamodel";
import {TrainingPlansService} from "../training-plans.service";
import {IMessageService} from "../../core/message.service";

class TrainingPlanFormCtrl implements IComponentController {

    public plan: TrainingPlan;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = ['TrainingPlansService', 'message'];

    constructor(private trainingPlanService: TrainingPlansService, private message: IMessageService) {

    }

    $onInit() {
    }

    save() {
        this.trainingPlanService
            .post(this.plan.clear())
            .then((response) => {debugger;}, error => this.message.toastInfo(error));
    }
}

const TrainingPlanFormComponent:IComponentOptions = {
    bindings: {
        plan: '<',
        mode: '<',
        onCancel: '&',
        onAnswer: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlanFormCtrl,
    template: require('./training-plan-form.component.html') as string
};

export default TrainingPlanFormComponent;