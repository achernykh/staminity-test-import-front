import './training-plan-publish.component.scss';
import {IComponentOptions, IComponentController} from 'angular';
import { TrainingPlan } from "../training-plan/training-plan.datamodel";
import { TrainingPlansService } from "../training-plans.service";
import MessageService from "@app/core/message.service";
import { IUserProfile } from "@api/user";

class TrainingPlanPublishCtrl implements IComponentController {

    // public
    plan: TrainingPlan;
    user: IUserProfile;
    onCancel: () => Promise<any>;
    onEvent: (response: Object) => Promise<void>;

    // private
    static $inject = ['TrainingPlansService', 'message'];

    constructor(
        private trainingPlansService: TrainingPlansService,
        private message: MessageService) {

    }

    $onInit() {

    }

    checkProfile (): boolean {
        return true;
    }

    checkVersion (): boolean {
        return true;
    }

    publish () {
        this.trainingPlansService.publish(this.plan.id, null)
            .then(response => {
                this.message.toastInfo('trainingPlanPublishSuccess');
                this.onCancel();
            }, error => this.message.toastInfo(error));
    }
}

export const TrainingPlanPublishComponent:IComponentOptions = {
    bindings: {
        plan: '<',
        user: '<',
        onCancel: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlanPublishCtrl,
    template: require('./training-plan-publish.component.html') as string
};