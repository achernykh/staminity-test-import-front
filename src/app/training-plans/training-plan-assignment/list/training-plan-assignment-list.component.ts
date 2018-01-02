import './training-plan-assignment-list.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';

class TrainingPlanAssignmentListCtrl implements IComponentController {

    public data: any;
    onForm: () => Promise<any>;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

export const TrainingPlanAssignmentListComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onForm: '&',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlanAssignmentListCtrl,
    template: require('./training-plan-assignment-list.component.html') as string
};