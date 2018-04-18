import './record-compact.component.scss';
import {IComponentOptions, IComponentController} from 'angular';
import { CalendarItemRecordCtrl } from "../calendar-item-record.component";

export const RecordCompactComponent:IComponentOptions = {
    bindings: {
        item: '<',
        disableActions: '<',
        options: '<',
        view: '<',
        onAnswer: '&',
        onCancel: '&'
    },
    controller: CalendarItemRecordCtrl,
    template: require('./record-compact.component.html') as string
};