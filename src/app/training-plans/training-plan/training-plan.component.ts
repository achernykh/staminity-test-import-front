import './training-plan.component.scss';
import {IComponentOptions, IComponentController, element} from 'angular';
import MessageService from "@app/core/message.service";
import { TrainingPlan } from "../training-plan/training-plan.datamodel";
import { TrainingPlansService } from "../training-plans.service";
import { TrainingPlanConfig } from "./training-plan.config";
import { IChart } from "../../../../api/statistics/statistics.interface";
import { IUserProfile } from "../../../../api/user/user.interface";

class TrainingPlanCtrl implements IComponentController {

    planId: number;
    currentUser: IUserProfile;
    public onEvent: (response: Object) => Promise<void>;

    // private
    private plan: TrainingPlan;
    private dataLoading: boolean = false;
    private toolbar: JQuery;
    private durationChart: IChart;

    static $inject = ['$mdSidenav', '$document', 'TrainingPlansService', 'trainingPlanConfig', 'message'];

    constructor(
        private $mdSidenav,
        private $document,
        private trainingPlanService: TrainingPlansService,
        private trainingPlanConfig: TrainingPlanConfig,
        private message: MessageService) {

    }

    $onInit() {
        this.getPlanDetails();
    }

    private getPlanDetails (): void {
        this.trainingPlanService.getStoreItem(this.planId, this.currentUser && this.currentUser.hasOwnProperty('userId'))
            .then(result => this.plan = new TrainingPlan(result, this.trainingPlanConfig), error => this.errorHandler(error))
            .then(() => this.dataLoading = true)
            .then(() => this.subscribeOnScroll())
            .then(() => this.prepareChart());
    }

    prepareChart () {
        if (!this.plan) { return; }
        this.durationChart = this.plan.durationChart;
    }

    subscribeOnScroll(): void {
        setTimeout(() => {
            this.toolbar = element(this.$document[0].querySelector('#toolbar'));
            window.addEventListener('scroll', () => {
                console.debug('scroll top', window.scrollY, window.innerHeight, window.outerHeight);
                this.toolbar.addClass(window.scrollY > window.innerHeight * 0.50 ? 'solid md-whiteframe-z3' : 'background');
                this.toolbar.removeClass(window.scrollY <= window.innerHeight * 0.50 ? 'solid md-whiteframe-z3' : 'background');
            });
        }, 500);
    }

    errorHandler (error: string): void {
        this.message.toastError(error);
    }

    toggleSlide(component) {
        this.$mdSidenav(component).toggle().then(_ => {});
    }

}

const TrainingPlanComponent:IComponentOptions = {
    bindings: {
        planId: '<',
        currentUser: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlanCtrl,
    template: require('./training-plan.component.html') as string
};

export default TrainingPlanComponent;