import './training-plan-assignment-form.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import { IUserProfile } from "@api/user";
import { ITrainingPlanAssignmentRequest } from "@api/trainingPlans";

class TrainingPlanAssignmentFormCtrl implements IComponentController {

    data: ITrainingPlanAssignmentRequest;
    athletes: Array<IUserProfile>;
    onBack: () => Promise<any>;
    onEvent: (response: Object) => IPromise<void>;

    // private
    private readonly applyModeTypes: Array<string> = ['P', 'I'];
    private readonly applyDateTypes: Array<string> = ['F', 'E'];

    static $inject = [];

    constructor() {

    }

    $onInit() {

    }

    athleteSelectorText(): string {
        return this.data.hasOwnProperty('userId') && this.data.userId &&
            this.data.userId.map(u =>
                `${this.athletes.filter(a => a.userId === Number(u))[0].public.firstName} ` +
                `${this.athletes.filter(a => a.userId === Number(u))[0].public.lastName}`).join(', ') || null;
    }
}

export const TrainingPlanAssignmentFormComponent:IComponentOptions = {
    bindings: {
        data: '<',
        athletes: '<',
        onBack: '&',
        onCancel: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlanAssignmentFormCtrl,
    template: require('./training-plan-assignment-form.component.html') as string
};