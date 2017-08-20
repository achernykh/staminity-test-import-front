import './calendar-item-template-selector.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';

class CalendarItemTemplateSelectorCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

const CalendarItemTemplateSelectorComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onBack: '&',
        onSelect: '&'
    },
    require: {
        //component: '^component'
    },
    controller: CalendarItemTemplateSelectorCtrl,
    template: require('./calendar-item-template-selector.component.html') as string
};

export default CalendarItemTemplateSelectorComponent;