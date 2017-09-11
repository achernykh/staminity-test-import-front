import './activity-interval-overview.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';

class ActivityIntervalOverviewCtrl implements IComponentController {

    public data: any;
    public onBack: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

const ActivityIntervalOverviewComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onBack: '&'
    },
    require: {
        item: '^calendarItemActivity'
    },
    controller: ActivityIntervalOverviewCtrl,
    template: require('./activity-interval-overview.component.html') as string
};

export default ActivityIntervalOverviewComponent;