import './calendar-item-template-selector.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {IActivityTemplate} from "../../../../api/reference/reference.interface";
import ReferenceService from "../../reference/reference.service";

class CalendarItemTemplateSelectorCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    private templatesByOwner: { [owner: string]: Array<IActivityTemplate> };

    static $inject = ['$scope','ReferenceService'];

    constructor(
        private $scope,
        private ReferenceService: ReferenceService) {

    }

    $onInit(): void {
    }

    $onDestroy(): void {
    }

}

const CalendarItemTemplateSelectorComponent:IComponentOptions = {
    bindings: {
        templatesByOwner: '<',
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