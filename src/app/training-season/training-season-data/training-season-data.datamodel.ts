import moment from 'moment/min/moment-with-locales.js';
import { Moment } from 'moment';
import { times } from '../../share/util.js';
import { TrainingSeason } from "../training-season/training-season.datamodel";
import { IMicrocycle } from "../../../../api/seasonPlanning/seasonPlanning.interface";
import { ICalendarItem } from "../../../../api/calendar/calendar.interface";

export class TrainingSeasonData {

    grid: Array<any>;

    constructor (
        private season: TrainingSeason,
        private microcycles: Array<IMicrocycle>) {
        this.prepare();
    }

    setCompetitions (items: Array<ICalendarItem>): void {
        items.map(item =>
            this.grid.filter(m =>
            moment(item.dateStart).isAfter(m.dateStart) &&
            moment(item.dateStart).isBefore(m.dateEnd))[0].competition = item);
    }

    private prepare (): void {
        let start: Moment = moment(this.season.dateStart).startOf('week');
        let end: Moment = moment(this.season.dateEnd).endOf('week');
        let gridLength = end.diff(start, 'weeks');

        if (!gridLength || gridLength === 0) { return; }

        this.grid = times(gridLength)
            .map(i => ({
                dateStart: moment(start).add(i,'week'),
                dateEnd: moment(start).add(i,'week').endOf('week'),
                mesocylce: null,
                competition: null,
                durationMeasure: 'TSS',
                durationValue: null
            }))
            .map(c => Object.assign(c, {title: TrainingSeasonData.getTitle(c.dateStart, c.dateEnd)}));

    }

    static getTitle (start: Moment, end: Moment): string {
        let next: Moment = moment(start).add(1, 'week');

        return moment(next).startOf('month').diff(moment(start).startOf('month'), 'months') > 0 ?
            `${start.format('DD')}-${end.format('MMM DD')}` :
            `${start.format('DD')}-${end.format('DD')}`;
    }

}