import './competition-single-stage.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import { Activity } from "../../../activity/activity-datamodel/activity.datamodel";
import { CompetitionItems } from "@app/calendar-item/calendar-item-competition/calendar-item-competition.datamodel";
import { CalendarItemDialogService } from "../../calendar-item-dialog.service";
import { ICalendarItemDialogOptions } from "../../calendar-item-dialog.interface";

class CompetitionSingleStageCtrl implements IComponentController {

    // bind
    items: Array<CompetitionItems>;
    options: ICalendarItemDialogOptions;
    onChange: () => Promise<any>;

    // private
    private readonly opposite = {
        value: {
            movingDuration: 'distanceLength',
            distance: 'movingDurationLength'
        },
        unit: {
            movingDuration: 'distance',
            distance: 'movingDuration'
        }
    };

    static $inject = ['CalendarItemDialogService'];

    constructor(
        private calendarItemDialog: CalendarItemDialogService) {

    }

    $onInit() {

    }

    open (e: Event, item: Activity): void {
        this.calendarItemDialog.activity(e, this.options, item)
            .then(() => {}, () => {});
    }

    changeValue (stage: CompetitionItems): void {
        // обсчитываем данные по плану, заполяем значение durationValue
        stage.item.intervals.PW.durationValue = stage.item.intervals.PW[this.durationMeasure(stage.item)].durationValue;
        // процент выполнения
        if (stage.item.intervals.W.calcMeasures[this.durationMeasure(stage.item)].value) {
            stage.item.intervals.PW.calcMeasures.completePercent.value =
                stage.item.intervals.W.calcMeasures[this.durationMeasure(stage.item)].value / stage.item.intervals.PW.durationValue;
        }
        stage.dirty = true;
        this.onChange();
    }

    durationMeasure (item: Activity): string {
        return item.intervals.PW.durationMeasure;
    }

    oppositeMeasure (item: Activity, t: 'value' | 'unit' = 'unit'): string {
        return this.opposite[t][item.intervals.PW.durationMeasure];
    }

    oppositeValue (item: Activity): number {
        return item.intervals.PW[this.oppositeMeasure(item, 'value')];
    }
}

export const CompetitionSingleStageComponent:IComponentOptions = {
    bindings: {
        items: '<',
        options: '<',
        onChange: '&'
    },
    require: {
        //component: '^component'
    },
    controller: CompetitionSingleStageCtrl,
    template: require('./competition-single-stage.component.html') as string
};