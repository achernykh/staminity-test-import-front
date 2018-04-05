import './training-plan-publish.component.scss';
import {IComponentOptions, IComponentController, IScope} from 'angular';
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
    static $inject = ['$scope', 'TrainingPlansService', 'message','dialogs'];

    constructor(
        private $scope: IScope,
        private trainingPlansService: TrainingPlansService,
        private message: MessageService,
        private dialogs) {

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
        Promise.resolve()
            .then(_ => this.onCancel())
            .then(_ => this.$scope.$applyAsync())
            .then(_ => this.dialogs.confirm({ text: 'dialogs.unpublishTrainingPlan' }))
            .then(_ => this.trainingPlansService.unpublish(this.plan.id))
            .then(_ => this.message.toastInfo('trainingPlanUnpublishSuccess'), e => e && this.message.toastInfo(e));
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