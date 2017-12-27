import './training-plan-form.component.scss';
import { IComponentOptions, IComponentController, IPromise, INgModelController, copy} from 'angular';
import MessageService from "@app/core/message.service";
import { FormMode } from "../../application.interface";
import { IRevisionResponse } from "@api/core";
import { TrainingPlan } from "../training-plan/training-plan.datamodel";
import { TrainingPlansService } from "../training-plans.service";
import { TrainingPlanConfig } from "../training-plan/training-plan.config";
import { IQuillConfig } from "../../share/quill/quill.config";
import { ICompetitionConfig } from "@app/calendar-item/calendar-item-competition/calendar-item-competition.config";

class TrainingPlanFormCtrl implements IComponentController {

    // bind
    data: TrainingPlan;
    mode: FormMode;
    onSave: (response: { mode: FormMode, plan: TrainingPlan }) => IPromise<void>;

    // private
    private plan: TrainingPlan;
    private planForm: INgModelController;

    //inject
    static $inject = [ 'TrainingPlansService', 'trainingPlanConfig', 'message', 'quillConfig', 'CompetitionConfig'];

    constructor (private trainingPlanService: TrainingPlansService,
                 private config: TrainingPlanConfig,
                 private message: MessageService,
                 private quillConf: IQuillConfig,
                 private competitionConfig: ICompetitionConfig) {

    }

    $onInit () {
        this.plan = new TrainingPlan(copy(this.data)); //Object.assign({}, this.plan);//deepCopy(this.plan);
        this.getPlanDetails();
    }

    save () {
        if (this.mode === FormMode.Post) {
            this.trainingPlanService
                .post(this.plan.clear())
                .then((response: IRevisionResponse) => this.onSave({
                        mode: this.mode,
                        plan: this.plan.applyRevision(response)
                    }),
                    (error) => this.message.toastInfo(error));
        }

        if (this.mode === FormMode.Put) {
            this.trainingPlanService
                .put(this.plan.clear())
                .then((response: IRevisionResponse) => this.onSave({
                        mode: this.mode,
                        plan: this.plan.applyRevision(response)
                    }),
                    (error) => this.message.toastInfo(error));
        }
    }

    get isViewMode (): boolean {
        return this.mode === FormMode.View;
    }

    setChangeMode (): void {
        this.mode = FormMode.Put;
    }

    private getPlanDetails (): void {
        if ( this.mode === FormMode.Post ) { return; }
        this.trainingPlanService.get(this.plan.id)
            .then(result => this.plan = new TrainingPlan(result), error => {debugger;});
    }

    private toggle (item, list): void {
        let idx = list.indexOf(item);
        if (idx > -1) {
            list.splice(idx, 1);
        }
        else {
            list.push(item);
        }
        this.planForm.$setDirty();
    }

    private exists (item, list): boolean {
        return list.indexOf(item) > -1;
    }
}

const TrainingPlanFormComponent: IComponentOptions = {
    bindings: {
        data: '<',
        mode: '<',
        onCancel: '&',
        onSave: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlanFormCtrl,
    template: require('./training-plan-form.component.html') as string
};

export default TrainingPlanFormComponent;