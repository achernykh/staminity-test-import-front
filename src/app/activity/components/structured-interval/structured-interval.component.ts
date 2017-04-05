import './structured-interval.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {IActivityIntervalP} from "../../../../../api/activity/activity.interface";

class StructuredIntervalCtrl implements IComponentController {

    public interval: IActivityIntervalP;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

const StructuredIntervalComponent:IComponentOptions = {
    bindings: {
        interval: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: StructuredIntervalCtrl,
    template: require('./structured-interval.component.html') as string
};

export default StructuredIntervalComponent;