import './training-plans-list.component.scss';
import { IComponentOptions, IComponentController, IPromise, IScope } from 'angular';
import { StateService } from 'angular-ui-router';
import { TrainingPlansList } from "./training-plans-list.datamodel";
import { TrainingPlan } from "../training-plan/training-plan.datamodel";
import { ITrainingPlanSearchRequest, ITrainingPlanSearchResult } from "@api/trainingPlans";
import { TrainingPlansService } from "@app/training-plans/training-plans.service";
import { TrainingPlanDialogService } from "@app/training-plans/training-plan-dialog.service";
import { FormMode } from "../../application.interface";

class TrainingPlansListCtrl implements IComponentController {

    // bind
    plans: TrainingPlansList;
    filter: ITrainingPlanSearchRequest;
    onEvent: (response: Object) => IPromise<void>;

    // private
    private totalFound: number = null;

    // inject
    static $inject = ['$scope', '$state', 'TrainingPlansService', 'TrainingPlanDialogService'];

    constructor (private $scope: any,
                 private $state: StateService,
                 private trainingPlansService: TrainingPlansService,
                 private trainingPlanDialogService: TrainingPlanDialogService) {

    }

    $onInit () {

    }

    $onChanges (changes): void {
        if (this.filter && changes.hasOwnProperty('filter') && !changes['filter'].isFirstChanges) {
            this.trainingPlansService.search(this.filter).then(this.updateList.bind(this));

        }
        if (this.filter && changes.hasOwnProperty('update') && !changes['update'].isFirstChanges) {
            let query = {
                name: this.filter['name'] || '',
                type: this.filter.type || '',
                distanceType: this.filter.distanceType || '',//,
                keywords: this.filter.keywords || [],
                tags: this.filter.tags || []
            };
        }
    }

    getTrainingPlanList(): Array<TrainingPlan> {
        return this.plans.list
            .filter(p =>
                (!this.filter['name'] || (this.filter['name'] && p.name.indexOf(this.filter['name']) !== -1)) &&
                (!this.filter.type || (this.filter.type && p.name.indexOf(this.filter.type) !== -1)) &&
                (!this.filter.tags || (this.filter.tags && this.filter.tags.every(t => p.tags.indexOf(t) !== -1))) &&
                (!this.filter.keywords || (this.filter.keywords && this.filter.keywords.every(t => p.keywords.indexOf(t) !== -1))));
    }

    post (env: Event) {
        this.open(env, FormMode.Post);
    }

    view (env: Event, plan: TrainingPlan) {
        this.open(env, FormMode.View, plan);
    }

    edit (env: Event, plan) {
        this.open(env, FormMode.Put, plan);
    }

    delete (planId: number) {
        this.trainingPlansService.delete(planId)
            .then(() => this.plans.delete(planId), error => {debugger;})
            .then(() => this.update());
    }

    calendar (planId: number) {
        this.$state.go('training-plan-builder-id', {planId: planId});
    }

    plan (planId: number) {
        this.$state.go('training-plan-id', {planId: planId});
    }

    private updateList (list: ITrainingPlanSearchResult): void {
        this.totalFound = list.totalFound;
        this.plans = new TrainingPlansList(list.items);
    }

    private open (env: Event, mode: FormMode, plan?: TrainingPlan): void {

        this.trainingPlanDialogService.open(env, mode, plan)
            .then((response: {mode: FormMode, plan: TrainingPlan}) => {
                if (response.mode === FormMode.Post) {
                    this.plans.push(response.plan.prepareObjects());
                } else if (response.mode === FormMode.Put) {
                    debugger;
                    this.plans.put(response.plan.prepareObjects()); //plan = response.plan;
                }
            })
            .then(plan => this.update());
    }

    private assignment (env: Event, plan: TrainingPlan, state: 'form' | 'list' = 'form'): void {
        this.trainingPlanDialogService.assignment(env, state, plan)
            .then(response => {debugger;}, error => {debugger;});
    }

    private update (): void {
        this.$scope.$applyAsync();
    }

}

const TrainingPlansListComponent: IComponentOptions = {
    bindings: {
        plans: '<',
        update: '<',
        filter: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlansListCtrl,
    template: require('./training-plans-list.component.html') as string
};

export default TrainingPlansListComponent;