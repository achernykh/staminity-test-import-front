import './training-plans-filter.component.scss';
import { IComponentOptions, IComponentController, IPromise, IScope } from 'angular';
import { TrainingPlan } from "../training-plan/training-plan.datamodel";
import { ITrainingPlanSearchRequest } from "@api/trainingPlans";
import { TrainingPlanDialogService } from "@app/training-plans/training-plan-dialog.service";
import { TrainingPlanConfig } from "@app/training-plans/training-plan/training-plan.config";

class TrainingPlansFilterCtrl implements IComponentController {

    // bind
    filter: ITrainingPlanSearchRequest;
    onChangeFilter: (response: { filter: ITrainingPlanSearchRequest }) => IPromise<void>;

    // public
    // private
    private panel: 'plans' | 'events' | 'hide' = 'plans';

    // inject
    static $inject = ['TrainingPlanDialogService', 'trainingPlanConfig'];

    constructor (
        private trainingPlanDialogService: TrainingPlanDialogService,
        private config: TrainingPlanConfig) {

    }

    $onInit () {
        this.filter.keywords = [];
        this.filter.tags = [];
        this.onChangeFilter({filter: this.filter});
    }

    onPost (env: Event) {
        //this.trainingPlanDialogService.post(env);
    }

    private change (): void {
        this.onChangeFilter({filter: this.filter});
    }

    private toggle (item, list): void {
        let idx = list.indexOf(item);
        if (idx > -1) {
            list.splice(idx, 1);
        }
        else {
            list.push(item);
        }
    }

    private exists (item, list): boolean {
        return list.indexOf(item) > -1;
    }

}

const TrainingPlansFilterComponent: IComponentOptions = {
    bindings: {
        filter: '<',
        onHide: '&',
        onChangeFilter: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlansFilterCtrl,
    template: require('./training-plans-filter.component.html') as string
};

export default TrainingPlansFilterComponent;