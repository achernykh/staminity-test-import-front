import {IComponentController, IComponentOptions, IPromise} from "angular";
import {IUserProfile} from "../../../../api/user/user.interface";
import "./calendar-item-athlete-selector.component.scss";

class CalendarItemAthleteSelectorCtrl implements IComponentController {

    public coach: any; //IUserProfile
    private athletes: Array<{profile: IUserProfile, active: boolean}> = [];
    private recalculateMode: boolean;
    public onSelect: (response: {result: Array<{profile: IUserProfile, active: boolean}>, recalculate: boolean}) => IPromise<void>;
    public static $inject = [];

    constructor() {

    }

    public $onInit() {
    }

    public onBack() {
        this.onSelect({result: this.athletes, recalculate: this.recalculateMode});
    }
}

const CalendarItemAthleteSelectorComponent: IComponentOptions = {
    bindings: {
        coach: "<",
        athletes: "<",
        recalculateMode: "<",
        onSelect: "&",
    },
    require: {
        //component: '^component'
    },
    controller: CalendarItemAthleteSelectorCtrl,
    template: require("./calendar-item-athlete-selector.component.html") as string,
};

export default CalendarItemAthleteSelectorComponent;
