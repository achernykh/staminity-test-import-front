import './dashboard-athlete.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {IUserProfile} from "../../../../api/user/user.interface";

class DashboardAthleteCtrl implements IComponentController {

    public profile: IUserProfile;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

const DashboardAthleteComponent:IComponentOptions = {
    bindings: {
        profile: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: DashboardAthleteCtrl,
    template: require('./dashboard-athlete.component.html') as string
};

export default DashboardAthleteComponent;