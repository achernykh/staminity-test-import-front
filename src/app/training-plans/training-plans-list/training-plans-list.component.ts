import './training-plans-list.component.scss';
import { IComponentOptions, IComponentController, IPromise, IScope } from 'angular';
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

    // inject
    static $inject = ['$scope','TrainingPlansService', 'TrainingPlanDialogService'];

    constructor (
        private $scope: any,
        private trainingPlansService: TrainingPlansService,
        private trainingPlanDialogService: TrainingPlanDialogService) {

    }

    $onInit () {

    }

    $onChanges (changes): void {
        if (this.filter && !changes[ 'filter' ].isFirstChanges) {
            this.trainingPlansService.search(this.filter).then(this.updateList.bind(this));
        }
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

    private updateList (list: ITrainingPlanSearchResult): void {
        this.plans = new TrainingPlansList(list.items);
    }

    private open (env: Event, mode: FormMode, plan?: TrainingPlan): void {
        this.trainingPlanDialogService.open(env, mode, plan)
            .then(plan => this.update(mode, plan));
    }

    private update (mode: FormMode, plan: TrainingPlan): void {

        if (mode === FormMode.Post) { this.plans.push(plan); }
        if (mode === FormMode.Put) { this.plans.put(plan); }

        this.$scope.$applyAsync();
    }

}

const TrainingPlansListComponent: IComponentOptions = {
    bindings: {
        plans: '<',
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