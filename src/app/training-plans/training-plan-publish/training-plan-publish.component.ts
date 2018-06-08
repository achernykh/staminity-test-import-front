import './training-plan-publish.component.scss';
import {IComponentOptions, IComponentController, IScope} from 'angular';
import { TrainingPlan } from "../training-plan/training-plan.datamodel";
import { TrainingPlansService } from "../training-plans.service";
import MessageService from "@app/core/message.service";
import { IUserProfile } from "@api/user";
import { FormMode } from "../../application.interface";
import {AgentService} from "../../user/settings/agent.service";

class TrainingPlanPublishCtrl implements IComponentController {

    // public
    plan: TrainingPlan;
    user: IUserProfile;
    onHide: () => Promise<any>;
    onCancel: () => Promise<any>;
    onAnswer: (response: {mode: FormMode, plan: TrainingPlan }) => Promise<void>;

    // private
    private dataLoading: boolean = false;
    private isProfileComplete: boolean = null;
    private rules = ['profile', 'isNotDynamic', 'version', 'icon', 'background', 'items' ];
    static $inject = ['$scope', 'TrainingPlansService', 'message','dialogs', 'AgentService'];

    constructor(
        private $scope: IScope,
        private trainingPlansService: TrainingPlansService,
        private message: MessageService,
        private dialogs,
        private agentService: AgentService) {

    }

    $onInit() {
        this.getPlanDetails();
    }

    set profile (value: boolean) {
        this.isProfileComplete = value;
    }

    get profile (): boolean {
        return this.isProfileComplete;
    }

    get isNotDynamic (): boolean {
        return !this.plan.propagateMods;
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
        Promise.resolve()
            .then(_ => this.onHide())
            .then(_ => this.$scope.$applyAsync())
            .then(_ => this.dialogs.confirm({ text: 'dialogs.publishTrainingPlan' }))
            .then(_ => this.trainingPlansService.publish(this.plan.id, null))
            .then(r => Object.assign(this.plan, r))
            .then(_ => this.message.toastInfo('trainingPlanPublishSuccess'))
            .then(_ => this.onAnswer({mode: FormMode.Post, plan: this.plan }),e => this.message.toastInfo(e));
    }

    unpublish (): void {
        Promise.resolve()
            .then(_ => this.onHide())
            .then(_ => this.$scope.$applyAsync())
            .then(_ => this.dialogs.confirm({ text: 'dialogs.unpublishTrainingPlan' }))
            .then(_ => this.trainingPlansService.unpublish(this.plan.id))
            .then(r => Object.assign(this.plan, r))
            .then(_ => this.onAnswer({mode: FormMode.Delete, plan: this.plan }))
            .then(_ => this.message.toastInfo('trainingPlanUnpublishSuccess'), e => e && this.message.toastInfo(e));
    }

    private getPlanDetails (): void {
        this.trainingPlansService.get(this.plan.id)
            .then(result => this.plan = new TrainingPlan(result), error => this.errorHandler(error))
            .then(_ => this.agentService.getAgentProfile())
            .then(p => this.isProfileComplete = p.isCompleted && p.isActive)
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
        onHide: '&',
        onCancel: '&',
        onAnswer: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlanPublishCtrl,
    template: require('./training-plan-publish.component.html') as string
};