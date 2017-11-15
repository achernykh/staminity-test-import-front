import './training-plans-list.component.scss';
import { IComponentOptions, IComponentController, IPromise } from 'angular';
import { TrainingPlansList } from "./training-plans-list.datamodel";
import { TrainingPlan } from "../training-plan/training-plan.datamodel";
import { ITrainingPlanSearchRequest, ITrainingPlanSearchResult } from "@api/trainingPlans";
import { TrainingPlansService } from "@app/training-plans/training-plans.service";
import { TrainingPlanDialogService } from "@app/training-plans/training-plan-dialog.service";

class TrainingPlansListCtrl implements IComponentController {

    // bind
    plans: TrainingPlansList;
    filter: ITrainingPlanSearchRequest;
    onEvent: (response: Object) => IPromise<void>;

    // private

    // inject
    static $inject = ['TrainingPlansService', 'TrainingPlanDialogService'];

    constructor (
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

    private updateList (list: ITrainingPlanSearchResult): void {
        this.plans = new TrainingPlansList(list.items);
    }

    onView (plan: TrainingPlan, env: Event) {
        this.trainingPlanDialogService.view(plan, env);
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