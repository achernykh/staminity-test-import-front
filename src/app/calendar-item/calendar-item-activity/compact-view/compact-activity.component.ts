import './compact-activity.component.scss';
import { IComponentOptions, IComponentController } from 'angular';
import { CalendarItemActivityCtrl } from '../calendar-item-activity.component';

export const ActivityCompactComponent: IComponentOptions = {
    bindings: {
        view: '<',
        disableActions: '<',
        selected: '<',
        data: '<',
        id: '<',
        options: '<',
        onCancel: '&',
        onAnswer: '&'
    },
    controller: CalendarItemActivityCtrl,
    template: require('./compact-activity.component.html') as string
};