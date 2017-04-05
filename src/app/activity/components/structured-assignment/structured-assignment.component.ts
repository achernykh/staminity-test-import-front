import './structured-assignment.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {IActivityIntervalP} from "../../../../../api/activity/activity.interface";

class StructuredAssignmentCtrl implements IComponentController {

    public plan: Array<IActivityIntervalP>;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

const StructuredAssignmentComponent:IComponentOptions = {
    bindings: {
        plan: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: StructuredAssignmentCtrl,
    template: require('./structured-assignment.component.html') as string
};

export default StructuredAssignmentComponent;