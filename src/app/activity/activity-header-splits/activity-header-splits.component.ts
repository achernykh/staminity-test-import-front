import {IComponentController, IComponentOptions, IPromise} from "angular";
import {IActivityIntervalL} from "../../../../api/activity/activity.interface";
import "./activity-header-splits.component.scss";

class ActivityHeaderSplitsCtrl implements IComponentController {

    splits: IActivityIntervalL[];
    sport: string;
    onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor () {

    }

    $onInit () {

    }
}

const ActivityHeaderSplitsComponent: IComponentOptions = {
    bindings: {
        splits: "<",
        sport: "<",
    },
    require: {
        //component: '^component'
    },
    controller: ActivityHeaderSplitsCtrl,
    template: require("./activity-header-splits.component.html") as string,
};

export default ActivityHeaderSplitsComponent;
