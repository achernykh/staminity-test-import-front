import './training-plan-assignment-form.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';

class TrainingPlanAssignmentFormCtrl implements IComponentController {

    public data: any;
    onBack: () => Promise<any>;
    public onEvent: (response: Object) => IPromise<void>;

    // private
    private readonly applyModeTypes: Array<string> = ['plan', 'item'];
    private readonly applyDateTypes: Array<string> = ['F', 'T'];

    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

export const TrainingPlanAssignmentFormComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onBack: '&',
        onCancel: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlanAssignmentFormCtrl,
    template: require('./training-plan-assignment-form.component.html') as string
};