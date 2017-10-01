import './training-plans-search.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';

class TrainingPlansSearchCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

const TrainingPlansSearchComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlansSearchCtrl,
    template: require('./training-plans-search.component.html') as string
};

export default TrainingPlansSearchComponent;