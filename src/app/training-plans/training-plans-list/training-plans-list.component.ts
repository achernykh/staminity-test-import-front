import { ITrainingPlanSearchRequest, ITrainingPlanSearchResult } from "@api/trainingPlans";
import { TrainingPlanDialogService } from "@app/training-plans/training-plan-dialog.service";
import { TrainingPlansService } from "@app/training-plans/training-plans.service";
import { IComponentController, IComponentOptions, IPromise, IScope } from "angular";
import { FormMode } from "../../application.interface";
import { TrainingPlan } from "../training-plan/training-plan.datamodel";
import "./training-plans-list.component.scss";
import { TrainingPlansList } from "./training-plans-list.datamodel";

class TrainingPlansListCtrl implements IComponentController {

    // bind
    plans: TrainingPlansList;
    filter: ITrainingPlanSearchRequest;
    onEvent: (response: Object) => IPromise<void>;

    // private

    // inject
    static $inject = ["$scope", "TrainingPlansService", "TrainingPlanDialogService"];

    constructor (private $scope: any,
                 private trainingPlansService: TrainingPlansService,
                 private trainingPlanDialogService: TrainingPlanDialogService) {

    }

    $onInit () {

    }

    $onChanges (changes): void {
        if (this.filter && !changes[ "filter" ].isFirstChanges) {
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

    delete (planId: number) {
        this.trainingPlansService.delete(planId)
            .then(() => this.plans.delete(planId), (error) => {debugger;})
            .then(() => this.update());
    }

    private updateList (list: ITrainingPlanSearchResult): void {
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
            .then((plan) => this.update());
    }

    private update (): void {
        this.$scope.$applyAsync();
    }

}

const TrainingPlansListComponent: IComponentOptions = {
    bindings: {
        plans: "<",
        filter: "<",
        onEvent: "&",
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlansListCtrl,
    template: require("./training-plans-list.component.html") as string,
};

export default TrainingPlansListComponent;