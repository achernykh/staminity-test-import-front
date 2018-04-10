import './training-plan-form.component.scss';
import moment from 'moment/min/moment-with-locales.js';
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
    onCancel: () => Promise<any>;

    // private
    private plan: TrainingPlan;
    private planForm: INgModelController;
    private dataLoading: boolean = false;

    //inject
    static $inject = [ '$scope', 'TrainingPlansService', 'trainingPlanConfig', 'message', 'quillConfig',
        'CompetitionConfig', 'dialogs'];

    constructor (private $scope,
                 private trainingPlanService: TrainingPlansService,
                 private config: TrainingPlanConfig,
                 private message: MessageService,
                 private quillConf: IQuillConfig,
                 private competitionConfig: ICompetitionConfig,
                 private dialogs) {

        $scope.onlyFirstPlanDaysPredicate = (date: Date) => this.onlyFirstPlanDaysPredicate(date);

    }

    $onInit () {

        if (this.mode === FormMode.Post) {
            this.plan = new TrainingPlan();
            this.dataLoading = true;
        } else {
            this.getPlanDetails();
        }
    }

    save (): void {
        if (this.mode === FormMode.Post) {
            this.trainingPlanService
                .post(this.plan.apiObject())
                .then((response: IRevisionResponse) => this.onSave({
                        mode: this.mode,
                        plan: this.plan.applyRevision(response)
                    }),
                    (error) => this.message.toastInfo(error));
        }

        if (this.mode === FormMode.Put) {
            this.trainingPlanService
                .put(this.plan.apiObject())
                .then((response: IRevisionResponse) => this.onSave({
                        mode: this.mode,
                        plan: this.plan.applyRevision(response)
                    }),
                    (error) => this.message.toastInfo(error));
        }
    }

    publish (): void {
        this.trainingPlanService.publish(this.plan.id, null)
            .then(response => {
                this.message.toastInfo('');
            }, error => this.message.toastInfo(error));
    }

    setAvatar (): void {
        this.dialogs.uploadPicture()
            .then();
    }

    setBackground (): void {
        this.dialogs.uploadPicture()
            .then();
    }

    get distanceType () : any {
        return this.plan && this.competitionConfig.distanceTypes.find((t) => t.type === this.plan.type && t.code === this.plan.distanceType);
    }

    set distanceType (distanceType: any) {
        this.plan.distanceType = distanceType.code;
    }

    setChangeMode (): void {
        this.mode = FormMode.Put;
    }

    private onlyFirstPlanDaysPredicate (date: Date): boolean {
        return date.getDay() === moment().startOf('week').toDate().getDay();
    };

    private getPlanDetails (): void {
        //if ( this.mode === FormMode.Post /**|| this.plan.hasOwnProperty('calendarItems')**/ ) { return; }
        this.trainingPlanService.get(this.data.id)
            .then(result => this.plan = new TrainingPlan(result), error => this.errorHandler(error))
            .then(() => this.trainingPlanService.getAssignment(this.plan.id))
            .then(result => this.plan.assignmentList = [...result.arrayResult], error => this.errorHandler(error))
            .then(() => this.dataLoading = true);
    }

    errorHandler (error: string): void {
        this.message.toastError(error);
        this.onCancel();
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

    get isPostMode (): boolean {
        return this.mode === FormMode.Post;
    }

    get isViewMode (): boolean {
        return this.mode === FormMode.View;
    }

    get isPutMode (): boolean {
        return this.mode === FormMode.Put;
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