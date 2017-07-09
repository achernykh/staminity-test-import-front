import './calendar-item-athlete-selector.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {IUserProfile} from "../../../../api/user/user.interface";

class CalendarItemAthleteSelectorCtrl implements IComponentController {

    public coach: any; //IUserProfile
    private athletes: Array<{profile: IUserProfile, active: boolean}> = [];
    public onSelect: (response: {result: Array<{profile: IUserProfile, active: boolean}>}) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {
    }

    onBack() {
        this.onSelect({result: this.athletes});
    }
}

const CalendarItemAthleteSelectorComponent:IComponentOptions = {
    bindings: {
        coach: '<',
        athletes: '<',
        onSelect: '&'
    },
    require: {
        //component: '^component'
    },
    controller: CalendarItemAthleteSelectorCtrl,
    template: require('./calendar-item-athlete-selector.component.html') as string
};

export default CalendarItemAthleteSelectorComponent;