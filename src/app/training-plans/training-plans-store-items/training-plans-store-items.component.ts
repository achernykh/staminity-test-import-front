import './training-plans-store-items.component.scss';
import {IComponentOptions, IComponentController, IScope, ILocationService} from 'angular';
import {
    ITrainingPlanSearchRequest,
    ITrainingPlanSearchResult,
} from "../../../../api/trainingPlans/training-plans.interface";
import { TrainingPlansList } from "../training-plans-list/training-plans-list.datamodel";
import { TrainingPlansService } from "../training-plans.service";
import MessageService from "../../core/message.service";
import { TrainingPlanDialogService } from "../training-plan-dialog.service";
import { TrainingPlan } from "../training-plan/training-plan.datamodel";
import { StateService} from "angular-ui-router";

export class TrainingPlansStoreItemsCtrl implements IComponentController {

    searchParams: ITrainingPlanSearchRequest;
    cardView: boolean;
    update: number;
    limit: number;
    excludeOwner: number;
    onEvent: (response: Object) => Promise<void>;

    // private
    private plans: TrainingPlansList;
    private isLoadingData: boolean = false;

    static $inject = ['$scope', '$mdMedia', '$state', '$location', 'TrainingPlansService', 'TrainingPlanDialogService' , 'message'];

    constructor(
        private $scope: IScope,
        private $mdMedia,
        private $state: StateService,
        private $location: ILocationService,
        private trainingPlansService: TrainingPlansService,
        private trainingPlanDialogs: TrainingPlanDialogService,
        private message: MessageService) {

    }

    $onInit() {
        //Object.assign(this.searchParams, {...this.$location.search()});
        //this.prepareData();
    }

    $onChanges (changes): void {
        if (this.searchParams && changes.hasOwnProperty('update') && !changes['update'].isFirstChanges) {
            this.prepareSearchParams();
            this.prepareData();
        }
    }

    prepareSearchParams () {
        if (this.searchParams.type === 'all') { this.searchParams.type = null; }
        if (this.searchParams.distanceType === 'all') { this.searchParams.distanceType = null; }
        if (this.searchParams.weekCountFrom) { this.searchParams.weekCountFrom = Number(this.searchParams.weekCountFrom); }
        if (this.searchParams.weekCountTo) { this.searchParams.weekCountTo = Number(this.searchParams.weekCountTo); }
    }

    prepareData () {
        this.isLoadingData = true;
        this.trainingPlansService.store(this.searchParams)
            .then(result => this.prepareList(result), error => {debugger;})
            //.then(_ => this.plans && this.message.toastInfo('trainingPlansSearchResult', {total: this.plans.list.length}))
            .then(_ => this.isLoadingData = false)
            .then(_ => this.$scope.$applyAsync());

    }

    prepareList(result: ITrainingPlanSearchResult) {
        this.plans = new TrainingPlansList(result.items);
        if (this.limit) {
            this.plans.list = this.plans.list.splice(0,this.limit);
        }
        if (this.excludeOwner) {
            this.plans.list = this.plans.list.filter(p => p.authorProfile.userId !== this.excludeOwner);
        }
    }

    open (e: Event, item: TrainingPlan): void {
        if (this.$mdMedia('gt-sm')) {
            window.open(`${window.location.protocol}//${window.location.host}/plan/?planId=${item.id}`);
        } else {
            this.$state.go('plan', {planId: item.id});
        }
    }

    order (e: Event, item: TrainingPlan): void {
        this.trainingPlanDialogs.order(e, item)
            .then(_ => {debugger; return this.trainingPlansService.purchase(item.id);}, e => {debugger; throw e;})
            .then(_ => this.trainingPlanDialogs.orderSuccess(e), e => e && this.message.toastError(e))
            .then(_ => this.trainingPlansService.store(this.searchParams))
            .then(r => this.prepareList(r), error => {debugger;})
            .then(_ => this.$scope.$applyAsync());
    }

    get isLoadingState (): boolean {
        return this.isLoadingData;
    }

    get isEmptyState (): boolean {
        return !this.isLoadingData && (!this.plans || this.plans.list.length === 0);
    }

    get isDataState (): boolean {
        return !this.isLoadingState && !this.isEmptyState;
    }
}

export const TrainingPlansStoreItemsComponent:IComponentOptions = {
    bindings: {
        searchParams: '<',
        cardView: '<',
        update: '<',
        limit: '<',
        excludeOwner: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlansStoreItemsCtrl,
    template: require('./training-plans-store-items.component.html') as string
};