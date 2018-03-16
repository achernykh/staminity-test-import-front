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

class TrainingPlansStoreItemsCtrl implements IComponentController {

    public searchParams: ITrainingPlanSearchRequest;
    public onEvent: (response: Object) => Promise<void>;

    // private
    private plans: TrainingPlansList;
    private isLoadingData: boolean = false;

    static $inject = ['$scope', '$location', 'TrainingPlansService', 'TrainingPlanDialogService' , 'message'];

    constructor(
        private $scope: IScope,
        private $location: ILocationService,
        private trainingPlansService: TrainingPlansService,
        private trainginPlanDialogs: TrainingPlanDialogService,
        private message: MessageService) {

    }

    $onChanges (changes): void {

    }

    $onInit() {
        //Object.assign(this.searchParams, {...this.$location.search()});
        this.prepareData();
    }

    prepareData () {
        this.isLoadingData = true;
        this.trainingPlansService.store(this.searchParams)
            .then(result => this.prepareList(result), error => {debugger;})
            .then(_ => this.plans && this.message.toastInfo('trainingPlansSearchResult', {total: this.plans.list.length}))
            .then(_ => this.isLoadingData = false);

    }

    prepareList(result: ITrainingPlanSearchResult) {
        this.plans = new TrainingPlansList(result.items);
    }

    open (e: Event, item: TrainingPlan): void {
        window.open(`${window.location.protocol}//${window.location.host}/training-plan/?planId=${item.id}`);
        //this.trainginPlanDialogs.store(e, item).then(_ => {},);
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
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlansStoreItemsCtrl,
    template: require('./training-plans-store-items.component.html') as string
};