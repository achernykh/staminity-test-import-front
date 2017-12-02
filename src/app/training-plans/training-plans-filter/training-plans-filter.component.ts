import { ITrainingPlanSearchRequest } from "@api/trainingPlans";
import { TrainingPlanDialogService } from "@app/training-plans/training-plan-dialog.service";
import { IComponentController, IComponentOptions, IPromise, IScope } from "angular";
import { TrainingPlan } from "../training-plan/training-plan.datamodel";
import "./training-plans-filter.component.scss";

class TrainingPlansFilterCtrl implements IComponentController {

    // bind
    public filter: ITrainingPlanSearchRequest;
    public onChangeFilter: (response: { filter: ITrainingPlanSearchRequest }) => IPromise<void>;

    // public
    // private
    private panel: "plans" | "events" | "hide" = "plans";

    // inject
    public static $inject = ["TrainingPlanDialogService"];

    constructor(
        private trainingPlanDialogService: TrainingPlanDialogService) {

    }

    public $onInit() {
        this.onChangeFilter({filter: this.filter});
    }

    public onPost(env: Event) {
        //this.trainingPlanDialogService.post(env);
    }

}

const TrainingPlansFilterComponent: IComponentOptions = {
    bindings: {
        filter: "<",
        onHide: "&",
        onChangeFilter: "&",
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlansFilterCtrl,
    template: require("./training-plans-filter.component.html") as string,
};

export default TrainingPlansFilterComponent;
