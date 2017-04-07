import './dashboard-athlete.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';

class DashboardAthleteCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

const DashboardAthleteComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: DashboardAthleteCtrl,
    template: require('./dashboard-athlete.component.html') as string
};

export default DashboardAthleteComponent;