import './competition-single-stage.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import { Activity } from "../../../activity/activity-datamodel/activity.datamodel";
import { CompetitionItems } from "@app/calendar-item/calendar-item-competition/calendar-item-competition.datamodel";

class CompetitionSingleStageCtrl implements IComponentController {

    // bind
    items: Array<CompetitionItems>;

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

    static $inject = [];

    constructor() {

    }

    $onInit() {

    }

    changeValue (item: Activity): void {
        // обсчитываем данные по плану, заполяем значение durationValue
        item.intervals.PW.durationValue = item.intervals.PW[this.durationMeasure(item)].durationValue;
        // процент выполнения
        if (item.intervals.W.calcMeasures[this.durationMeasure(item)].value) {
            item.intervals.W.calcMeasures.completePercent.value = item.intervals.PW.durationValue / item.intervals.W.calcMeasures[this.durationMeasure(item)].value;
        }
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
        onChange: '&'
    },
    require: {
        //component: '^component'
    },
    controller: CompetitionSingleStageCtrl,
    template: require('./competition-single-stage.component.html') as string
};