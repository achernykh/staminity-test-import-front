import './activity-header-splits.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {IActivityIntervalL} from "../../../../api/activity/activity.interface";

export class ActivityHeaderSplitsCtrl implements IComponentController {

    public splits: Array<IActivityIntervalL>;
    public sport: string;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

const ActivityHeaderSplitsComponent:IComponentOptions = {
    bindings: {
        splits: '<',
        sport: '<'
    },
    require: {
        //component: '^component'
    },
    controller: ActivityHeaderSplitsCtrl,
    template: require('./activity-header-splits.component.html') as string
};

export default ActivityHeaderSplitsComponent;
