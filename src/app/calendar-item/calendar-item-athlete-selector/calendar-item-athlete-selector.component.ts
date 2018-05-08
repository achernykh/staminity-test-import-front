import './calendar-item-athlete-selector.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {IUserProfile} from "../../../../api/user/user.interface";

class CalendarItemAthleteSelectorCtrl implements IComponentController {

    public coach: any; //IUserProfile
    private list: Array<{profile: IUserProfile, active: boolean}> = [];
    private mode: boolean;
    public onSelect: (response: {list: Array<{profile: IUserProfile, active: boolean}>, mode: boolean}) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {
    }

    onBack() {
        this.onSelect({list: this.list, mode: this.mode});
    }
}

const CalendarItemAthleteSelectorComponent:IComponentOptions = {
    bindings: {
        coach: '<',
        list: '<',
        mode: '<',
        onSelect: '&'
    },
    require: {
        //component: '^component'
    },
    controller: CalendarItemAthleteSelectorCtrl,
    template: require('./calendar-item-athlete-selector.component.html') as string
};

export default CalendarItemAthleteSelectorComponent;