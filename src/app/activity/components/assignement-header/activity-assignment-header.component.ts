import './activity-assignment-header.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';

class ActivityAssignmentHeaderCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

const ActivityAssignmentHeaderComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: ActivityAssignmentHeaderCtrl,
    template: require('./activity-assignment-header.component.html') as string
};

export default ActivityAssignmentHeaderComponent;