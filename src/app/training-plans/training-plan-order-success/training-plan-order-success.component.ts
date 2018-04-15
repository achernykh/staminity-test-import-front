import './training-plan-order-success.component.scss';
import {IComponentOptions, IComponentController} from 'angular';
import {StateService} from 'angular-ui-router';

class TrainingPlanOrderSuccessCtrl implements IComponentController {

    // bind
    data: any;
    onCancel: () => Promise<void>;
    onAnswer: () => Promise<void>;

    // private

    // inject
    static $inject = ['$state'];

    constructor(private $state: StateService) {}

    $onInit(): void {}
}

export const TrainingPlanOrderSuccessComponent:IComponentOptions = {
    bindings: {
        auth: '<',
        onAnswer: '&',
        onCancel: '&'
    },
    controller: TrainingPlanOrderSuccessCtrl,
    template: require('./training-plan-order-success.component.html') as string
};