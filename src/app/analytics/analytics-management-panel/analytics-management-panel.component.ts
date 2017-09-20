import './analytics-management-panel.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';

class AnalyticsManagementPanelCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

const AnalyticsManagementPanelComponent:IComponentOptions = {
    bindings: {
        charts: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: AnalyticsManagementPanelCtrl,
    template: require('./analytics-management-panel.component.html') as string
};

export default AnalyticsManagementPanelComponent;