import moment from 'moment/min/moment-with-locales.js';
import { Moment } from 'moment';
import { times } from '../../share/util.js';
import { TrainingSeason } from "../training-season/training-season.datamodel";
import { IMicrocycle } from "../../../../api/seasonPlanning/seasonPlanning.interface";
import { ICalendarItem } from "../../../../api/calendar/calendar.interface";
import { Microcycle } from "../training-season/training-season-microcycle.datamodel";

export class TrainingSeasonData {

    grid: Array<Microcycle>;
    competitions: Array<ICalendarItem>;

    constructor (
        public season: TrainingSeason,
        private microcycles: Array<IMicrocycle>) {
        this.prepare();
    }

    setCompetitions (items: Array<ICalendarItem>): void {
        this.competitions = items;
        this.grid.map(m => m._competition = null);
        this.competitions.map(item => this.grid.filter(m =>
            moment(item.dateStart).isAfter(m._dateStart) &&
            moment(item.dateStart).isBefore(m._dateEnd))[0]._competition = item);
        this.grid.map(m => m.update());
    }

    private prepare (): void {
        let start: Moment = moment(this.season.dateStart).startOf('week');
        let end: Moment = moment(this.season.dateEnd).endOf('week');
        let gridLength = end.diff(start, 'weeks');

        if (!gridLength || gridLength === 0) { return; }

        this.grid = times(gridLength)
            .map(i => new Microcycle(Object.assign({
                weekNumber: moment(start).add(i,'week').format('YYYY.WW'),
                _dateStart: moment(start).add(i,'week'),
                _dateEnd: moment(start).add(i,'week').endOf('week'),
                mesocycle: {
                    id: null
                },
                _competition: null,
                durationMeasure: this.season.durationMeasure,
                durationValue: null
            }, this.microcycles.filter(m => m.weekNumber === moment(start).add(i,'week').format('YYYY.WW'))[0])));
    }

}