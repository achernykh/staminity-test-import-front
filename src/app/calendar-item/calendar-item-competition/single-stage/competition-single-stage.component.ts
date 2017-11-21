import './competition-single-stage.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import { Activity } from "../../../activity/activity-datamodel/activity.datamodel";

class CompetitionSingleStageCtrl implements IComponentController {

    // bind
    activity: Activity;
    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

export const CompetitionSingleStageComponent:IComponentOptions = {
    bindings: {
        activity: '<',
        onChange: '&'
    },
    require: {
        //component: '^component'
    },
    controller: CompetitionSingleStageCtrl,
    template: require('./competition-single-stage.component.html') as string
};