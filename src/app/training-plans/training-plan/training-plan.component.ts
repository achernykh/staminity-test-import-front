import './training-plan.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import { IUserProfile } from "@api/user";

class TrainingPlanCtrl implements IComponentController {

    public user: IUserProfile;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = ['$mdMedia'];

    constructor (private $mdMedia: any) {

    }

    $onInit () {

    }
}

const TrainingPlanComponent:IComponentOptions = {
    bindings: {
        user: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlanCtrl,
    template: require('./training-plan.component.html') as string
};

export default TrainingPlanComponent;