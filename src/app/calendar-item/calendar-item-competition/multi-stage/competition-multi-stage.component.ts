import './competition-multi-stage.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';

class CompetitionMultiStageCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor () {

    }

    $onInit () {

    }
}

export const CompetitionMultiStageComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: CompetitionMultiStageCtrl,
    template: require('./competition-multi-stage.component.html') as string
};