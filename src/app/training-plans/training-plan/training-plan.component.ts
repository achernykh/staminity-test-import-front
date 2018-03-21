import './training-plan.component.scss';
import {IComponentOptions, IComponentController, element} from 'angular';
import MessageService from "@app/core/message.service";
import { TrainingPlan } from "../training-plan/training-plan.datamodel";
import { TrainingPlansService } from "../training-plans.service";
import { TrainingPlanConfig } from "./training-plan.config";
import { IChart } from "../../../../api/statistics/statistics.interface";
import { IUserProfile } from "../../../../api/user/user.interface";
import { TrainingPlanDialogService } from "@app/training-plans/training-plan-dialog.service";
import { ITrainingPlanSearchRequest } from "../../../../api/trainingPlans/training-plans.interface";
import { TrainingPlansList } from "../training-plans-list/training-plans-list.datamodel";

class TrainingPlanCtrl implements IComponentController {

    planId: number;
    store: boolean;
    currentUser: IUserProfile;
    public onEvent: (response: Object) => Promise<void>;

    // private
    private plan: TrainingPlan;
    private dataLoading: boolean = false;
    private toolbar: JQuery;
    private durationChart: IChart;
    private update: number = 0;
    private authorSearch: ITrainingPlanSearchRequest;
    private similarSearch: ITrainingPlanSearchRequest;

    static $inject = ['$mdSidenav', '$document', 'TrainingPlansService',
        'TrainingPlanDialogService', 'trainingPlanConfig', 'message'];

    constructor(
        private $mdSidenav,
        private $document,
        private trainingPlanService: TrainingPlansService,
        private trainingPlanDialog: TrainingPlanDialogService,
        private trainingPlanConfig: TrainingPlanConfig,
        private message: MessageService) {

    }

    $onInit() {
        this.getPlanDetails();
    }

    private getPlanDetails (): void {
        (this.store ?
            this.trainingPlanService.getStoreItem(this.planId, this.currentUser && this.currentUser.hasOwnProperty('userId')) :
            this.trainingPlanService.get(this.planId))
            .then(result => this.plan = new TrainingPlan(result, this.trainingPlanConfig), error => this.errorHandler(error))
            .then(() => this.dataLoading = true)
            .then(() => this.subscribeOnScroll())
            .then(() => this.prepareChart())
            .then(() => this.getRecommendedPlans());
        //this.trainingPlanService.getStoreItem(this.planId, this.currentUser && this.currentUser.hasOwnProperty('userId'))
    }

    private getRecommendedPlans (): void {
        this.authorSearch = {
            ownerId: this.plan.authorProfile.userId
        };
        this.similarSearch = {
            tags: [this.plan.level[0]] || [],
            type: this.plan.type,
            distanceType: this.plan.distanceType
        };
        this.update ++;

        /*this.trainingPlanService.store(authorSearch)
            .then(result => (this.authorPlans = new TrainingPlansList(result.items)), error => {debugger;});

        this.trainingPlanService.store(similarSearch)
            .then(result => (this.similarPlans = new TrainingPlansList(result.items)), error => {debugger;})
            .then(_ => this.similarPlans.list = this.similarPlans.list.filter(p => p.authorProfile.userId !== this.plan.authorProfile.userId));*/

    }

    order (e: Event): void {
        if (this.plan.price) {
            this.trainingPlanDialog.order(e, this.plan).then(_ => {});
        } else {
            this.trainingPlanService.getPlan(this.planId)
                .then(_ => this.message.toastInfo('trainingPlanGetSuccess'), e => this.message.toastError(e));
        }
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
                this.toolbar.addClass(window.scrollY > window.innerHeight * 0.60 ? 'solid md-whiteframe-z3' : 'background');
                this.toolbar.removeClass(window.scrollY <= window.innerHeight * 0.60 ? 'solid md-whiteframe-z3' : 'background');
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
        store: '<', // true - запрос по базе планов из стора, false - текущая база планов
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlanCtrl,
    template: require('./training-plan.component.html') as string
};

export default TrainingPlanComponent;