import './training-plans-store-items.component.scss';
import {IComponentOptions, IComponentController, IScope, ILocationService, copy} from 'angular';
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
import {gtmFindPlan} from "../../share/google/google-analitics.functions";

export class TrainingPlansStoreItemsCtrl implements IComponentController {

    // bind
    searchParams: ITrainingPlanSearchRequest;
    cardView: boolean;
    update: number;
    limit: number;
    excludeOwner: number;
    onResult: (response: {list, length}) => Promise<void>;

    // private
    private plans: TrainingPlansList;
    private isLoadingData: boolean = false;
    private params: ITrainingPlanSearchRequest;

    static $inject = ['$scope', '$mdMedia', '$state', '$location', 'TrainingPlansService',
        'TrainingPlanDialogService' , 'message'];

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
        this.params = copy(this.searchParams);
        if ((this.params.lng && this.params.lng.length === 0) || !this.params.lng) { delete this.params.lng; }
        if ((this.params.keywords && this.params.keywords.length === 0) || !this.params.keywords) { delete this.params.keywords; }
        if ((this.params.tags && this.params.tags.length === 0) || !this.params.tags) { delete this.params.tags; }
        if (this.params.type === 'all') { this.params.type = null; }
        if (this.params.distanceType === 'all') { this.params.distanceType = null; }
        if (this.params.weekCountFrom) { this.params.weekCountFrom = Number(this.params.weekCountFrom); }
        if (this.params.weekCountTo) { this.params.weekCountTo = Number(this.params.weekCountTo); }
    }

    prepareData () {
        this.isLoadingData = true;
        this.trainingPlansService.store(this.params)
            .then(result => this.prepareList(result), e => this.errorHandler(e))
            //.then(_ => this.plans && this.message.toastInfo('trainingPlansSearchResult', {total: this.plans.list.length}))
            .then(_ => this.isLoadingData = false)
            .then(_ => this.onResult({list: this.plans.list, length: this.plans.list.length}))
            .then(_ => this.$scope.$applyAsync());

    }

    errorHandler (e) {
        e ? this.message.toastError(e) : this.message.toastError('trainingPlansStoreGetError');
        this.prepareList({items: [], totalFound: null});
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
            window.open(`${window.location.protocol}//${window.location.host}/plan/${item.id}`);
        } else {
            this.$state.go('plan', {planId: item.id});
        }
    }

    order (e: Event, item: TrainingPlan): void {
        this.trainingPlanDialogs.order(e, item)
            .then(_ => {debugger; return this.trainingPlansService.purchase(item.id);}, e => {debugger; throw e;})
            .then(_ => this.trainingPlanDialogs.orderSuccess(e), e => e && this.message.toastError(e))
            .then(_ => this.trainingPlansService.store(this.params))
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
        searchParams: '=',
        cardView: '<',
        update: '<',
        limit: '<',
        view: '=',
        excludeOwner: '<',
        onResult: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlansStoreItemsCtrl,
    template: require('./training-plans-store-items.component.html') as string
};