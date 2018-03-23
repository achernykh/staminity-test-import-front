import './training-plan-order-success.component.scss';
import {IComponentOptions, IComponentController} from 'angular';

class TrainingPlanOrderSuccessCtrl implements IComponentController {

    // bind
    data: any;
    onCancel: () => Promise<void>;
    onAnswer: () => Promise<void>;

    // private

    // inject
    static $inject = [];

    constructor() {

    }

    $onInit(): void {

    }
}

export const TrainingPlanOrderSuccessComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onAnswer: '&',
        onCancel: '&'
    },
    controller: TrainingPlanOrderSuccessCtrl,
    template: require('./training-plan-order-success.component.html') as string
};