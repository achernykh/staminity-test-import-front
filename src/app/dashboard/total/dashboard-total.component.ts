import './dashboard-total.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';

class DashboardTotalCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

const DashboardTotalComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: DashboardTotalCtrl,
    template: require('./dashboard-total.component.html') as string
};

export default DashboardTotalComponent;