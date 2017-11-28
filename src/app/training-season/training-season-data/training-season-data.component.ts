import './training-season-data.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import { TrainingSeasonData } from "./training-season-data.datamodel";

class TrainingSeasonDataCtrl implements IComponentController {

    public data: TrainingSeasonData;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

export const TrainingSeasonDataComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingSeasonDataCtrl,
    template: require('./training-season-data.component.html') as string
};
