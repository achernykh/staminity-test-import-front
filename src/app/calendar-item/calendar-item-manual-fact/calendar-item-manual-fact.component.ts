import './calendar-item-manual-fact.component.scss';
import {IComponentOptions, IComponentController} from 'angular';
import {ICalcMeasures, IActivityIntervalPW, IActivityIntervalW} from "../../../../api/activity/activity.interface";
import { CalendarItemActivityCtrl } from "../calendar-item-activity/calendar-item-activity.component";
import { ActivityConfigConstants } from "../../activity/activity.constants";
import { deepCopy } from "../../share/data/data.finctions";

class CalendarItemManualFactCtrl implements IComponentController {
    
    // bind
    item: CalendarItemActivityCtrl;
    data: any;
    onEvent: (response: Object) => Promise<void>;
     
    // private
    private sport: string;
    private plan: IActivityIntervalPW;
    private actual: IActivityIntervalW;
    private durationTypes: [string];
   
    // inject
    static $inject = ['activityConfig'];

    constructor(private activityConfig: ActivityConfigConstants) {}

    $onInit(): void {
        this.prepareData();
    }

    private changeValue (): void {
        this.actual.actualDataIsCorrected = true;
        //this.plan.calcMeasures.completePercent.value = null;//this.calculateCompletePercent(); // расчет итогового процента по тренировке
    }

    private prepareData (): void {
        //this.plan = this.plan || this.item.activity.intervals.PW;
        //this.actual = this.actual || deepCopy(this.item.activity.intervals.W);
        //this.sport = this.sport || this.item.activity.header.sportBasic;
        this.durationTypes = [this.plan.durationMeasure === 'movingDuration' ? 'movingDuration' : 'duration','distance'];
    }

    measures (sport): string[] {
        return [...this.durationTypes,
            ...this.activityConfig.intensityBySport[this.activityConfig.intensityBySport[sport] ? sport : 'default']];
    }

    get isIonic (): boolean {
        return window.hasOwnProperty('ionic');
    }
}

export const CalendarItemManualFactComponent:IComponentOptions = {
    bindings: {
        plan: '=',
        actual: '<',
        sport: '=',
        disabled: '=',
        onBack: '&',
        onSave: '&'
    },
    controller: CalendarItemManualFactCtrl,
    template: require('./calendar-item-manual-fact.component.html') as string
};