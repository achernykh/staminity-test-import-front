import './activity.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';

class ActivityCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

const ActivityComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: ActivityCtrl,
    template: require('./activity.component.html') as string
};

export default ActivityComponent;