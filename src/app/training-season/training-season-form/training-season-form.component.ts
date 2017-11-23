import './training-season-form.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';

class TrainingSeasonFormCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

export const TrainingSeasonFormComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingSeasonFormCtrl,
    template: require('./training-season-form.component.html') as string
};