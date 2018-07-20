import './calendar-item-route.component.scss';
import {IComponentOptions, IComponentController} from 'angular';

class CalendarItemRouteCtrl implements IComponentController {

    // bind
    data: any;
    onEvent: (response: Object) => Promise<void>;

    // private

    // inject
    static $inject = [];

    constructor() {

    }

    $onInit(): void {

    }
}

export const CalendarItemRouteComponent:IComponentOptions = {
    bindings: {
        data: '<',
        select: '<',
        onBack: '&'
    },
    controller: CalendarItemRouteCtrl,
    template: require('./calendar-item-route.component.html') as string
};