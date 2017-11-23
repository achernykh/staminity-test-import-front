import './training-season-list.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';

class TrainingSeasonListCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

export const TrainingSeasonListComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingSeasonListCtrl,
    template: require('./training-season-list.component.html') as string
};