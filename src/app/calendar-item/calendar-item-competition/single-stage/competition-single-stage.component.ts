import './competition-single-stage.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import { Activity } from "../../../activity/activity-datamodel/activity.datamodel";
import { CompetitionItems } from "@app/calendar-item/calendar-item-competition/calendar-item-competition.datamodel";

class CompetitionSingleStageCtrl implements IComponentController {

    // bind
    items: Array<CompetitionItems>;

    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

export const CompetitionSingleStageComponent:IComponentOptions = {
    bindings: {
        items: '<',
        onChange: '&'
    },
    require: {
        //component: '^component'
    },
    controller: CompetitionSingleStageCtrl,
    template: require('./competition-single-stage.component.html') as string
};