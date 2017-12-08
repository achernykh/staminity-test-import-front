import { IMicrocycle, IMesocycle } from "../../../../api/seasonPlanning/seasonPlanning.interface";
import { ICalcMeasures } from "../../../../api/activity/activity.interface";
import { Moment } from 'moment';
import moment from 'moment/min/moment-with-locales.js';
import { ICalendarItem } from "../../../../api/calendar/calendar.interface";
import { IRevisionResponse } from "../../../../api/core/core";

export class Microcycle implements IMicrocycle {

    id: number;
    revision: number;
    weekNumber: string; // дата начала недели в формате YYYY.WW
    description: string; // заметка тренеру к микроциклу
    mesocycle: IMesocycle;
    durationMeasure: string;
    durationValue: number;
    calcMeasures: ICalcMeasures;
    planMeasures: ICalcMeasures;

    _dateStart: Moment;
    _dateEnd: Moment;
    _competition: ICalendarItem;

    private keys: Array<string> = ['keys', '_dateStart', '_dateEnd', '_competition'];

    constructor (data?: IMicrocycle | any) {
        Object.assign(this, data);
        this.prepareDefaultData();
    }

    get title(): string {
        let next: Moment = moment(this._dateStart).add(1, 'week');

        return moment(next).startOf('month').diff(moment(this._dateStart).startOf('month'), 'months') > 0 ?
            `${this._dateStart.format('DD')}-${this._dateEnd.format('MMM DD')}` :
            `${this._dateStart.format('DD')}-${this._dateEnd.format('DD')}`;
    }

    applyRevision (revision: IRevisionResponse): Microcycle {
        this.id = revision.value.id;
        this.revision = revision.value.revision;
        return this;
    }

    prepare (keys: Array<string> = this.keys): IMicrocycle {
        let cycle: IMicrocycle = Object.assign({}, this);

        cycle.mesocycle = { id: Number(this.mesocycle.id) };
        cycle.durationValue = Number(this.durationValue);
        if (!cycle.mesocycle.id) {
            cycle.mesocycle = null;
        }

        keys.map(p => delete cycle[p]);
        return cycle;
    }

    private prepareDefaultData (): void {

    }
}