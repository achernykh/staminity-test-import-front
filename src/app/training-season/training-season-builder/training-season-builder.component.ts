import './training-season-builder.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import { TrainingSeason } from "../training-season/training-season.datamodel";
import { IUserProfile } from "../../../../api/user/user.interface";

class TrainingSeasonBuilderCtrl implements IComponentController {

    // bind
    season: TrainingSeason;
    currentUser: IUserProfile;
    owner: IUserProfile;

    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

const TrainingSeasonBuilderComponent:IComponentOptions = {
    bindings: {
        season: '<',
        currentUser: '<',
        owner: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingSeasonBuilderCtrl,
    template: require('./training-season-builder.component.html') as string
};

export default TrainingSeasonBuilderComponent;