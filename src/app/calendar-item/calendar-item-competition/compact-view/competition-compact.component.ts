import './competition-compact.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import { CalendarItemCompetitionCtrl } from "../calendar-item-competition.component";

const CompetitionCompactComponent:IComponentOptions = {
    bindings: {
        item: '<',
        options: '<',
        view: '@',
        onAnswer: '&',
        onCancel: '&'
    },
    controller: CalendarItemCompetitionCtrl,
    template: require('./competition-compact.component.html') as string
};

export default CompetitionCompactComponent;