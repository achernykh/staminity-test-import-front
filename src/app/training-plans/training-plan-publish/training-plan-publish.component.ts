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
    private dataLoading: boolean = false;
    private rules = ['profile', 'version', 'icon', 'background', 'items' ];
    static $inject = ['TrainingPlansService', 'message'];

    constructor(
        private trainingPlansService: TrainingPlansService,
        private message: MessageService) {

    }

    $onInit() {
        this.getPlanDetails();
    }

    get profile (): boolean {
        return true;
    }

    get version (): boolean {
        return !this.plan.storeRevision || (this.plan.storeRevision < this.plan.revision);
    }

    get icon (): boolean {
        return !!this.plan.icon;
    }

    get background (): boolean {
        return !!this.plan.background;
    }

    get items (): boolean {
        return this.plan.calendarItems.length > 10;
    }

    publish () {
        this.trainingPlansService.publish(this.plan.id, null)
            .then(response => {
                this.message.toastInfo('trainingPlanPublishSuccess');
                this.onCancel();
            }, error => this.message.toastInfo(error));
    }

    unpublish (): void {
        this.trainingPlansService.unpublish(this.plan.id)
            .then(_ => this.message.toastInfo('trainingPlanUnpublishSuccess'), e => this.message.toastInfo(e))
            .then(_ => this.onCancel());
    }

    private getPlanDetails (): void {
        this.trainingPlansService.get(this.plan.id)
            .then(result => this.plan = new TrainingPlan(result), error => this.errorHandler(error))
            .then(() => this.dataLoading = true);
    }

    errorHandler (error: string): void {
        this.message.toastError(error);
        this.onCancel();
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