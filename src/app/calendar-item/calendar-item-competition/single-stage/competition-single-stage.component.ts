import './competition-single-stage.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import { Activity } from "../../../activity/activity-datamodel/activity.datamodel";
import { CompetitionItems } from "@app/calendar-item/calendar-item-competition/calendar-item-competition.datamodel";
import { CalendarItemDialogService } from "../../calendar-item-dialog.service";
import { ICalendarItemDialogOptions } from "../../calendar-item-dialog.interface";
import { ICompetitionConfig } from "../calendar-item-competition.config";

class CompetitionSingleStageCtrl implements IComponentController {

    // bind
    type: string;
    distanceType: string;
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

    static $inject = ['CompetitionConfig', 'CalendarItemDialogService'];

    constructor(private config: ICompetitionConfig,
                private calendarItemDialog: CalendarItemDialogService) {

    }

    $onInit() {

    }

    open (e: Event, item: Activity): void {
        this.calendarItemDialog.activity(e, this.options, item)
            .then(() => {}, () => {});
    }

    changeValue (stage: CompetitionItems, index: number): void {
        // обсчитываем данные по плану, заполяем значение durationValue
        stage.item.intervals.PW.durationValue = stage.item.intervals.PW[this.durationMeasure(stage.item, index)].durationValue;
        // процент выполнения
        if (stage.item.intervals.W.calcMeasures[this.durationMeasure(stage.item, index)].value) {
            stage.item.intervals.PW.calcMeasures.completePercent.value =
                stage.item.intervals.W.calcMeasures[this.durationMeasure(stage.item, index)].value / stage.item.intervals.PW.durationValue;
        }
        stage.dirty = true;
        this.onChange();
    }

    durationMeasure (item: Activity, index: number = 0): string {
        return this.config.distanceTypes
            .filter(t => t.type === this.type && t.code === this.distanceType)[0]
            .stages[index].durationMeasure;
    }

    oppositeMeasure (item: Activity, index: number,  t: 'value' | 'unit' = 'unit'): string {
        //console.warn('oppositeMeasure', index, t, this.durationMeasure(item, index));
        return this.opposite[t][this.durationMeasure(item, index)];
    }

    oppositeValue (item: Activity, index: number): number {
        //console.warn('oppositeValue', index, this.durationMeasure(item, index));
        return item.intervals.PW[this.oppositeMeasure(item, index, 'value')];
    }
}

export const CompetitionSingleStageComponent:IComponentOptions = {
    bindings: {
        type: '<',
        distanceType: '<',
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