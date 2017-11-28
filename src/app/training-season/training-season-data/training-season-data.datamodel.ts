import moment from 'moment/min/moment-with-locales.js';
import { Moment } from 'moment';
import { times } from '../../share/util.js';
import { TrainingSeason } from "../training-season/training-season.datamodel";
import { IMicrocycle } from "../../../../api/seasonPlanning/seasonPlanning.interface";

export class TrainingSeasonData {

    grid: Array<any>;

    constructor (private season: TrainingSeason, microcycles: Array<IMicrocycle>) {
        this.prepare();
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
                mesocylce: {
                    code: 'Base'
                },
                durationMeasure: 'TSS',
                durationValue: null
            }))
            .map(c => Object.assign(c, {title: this.getTitle(c.dateStart, c.dateEnd)}));

    }

    private getTitle (start: Moment, end: Moment): string {
        let next: Moment = moment(start).add(1, 'week');

        return moment(next).startOf('month').diff(moment(start).startOf('month'), 'months') > 0 ?
            `${start.format('DD')}-${end.format('MMM DD')}` :
            `${start.format('DD')}-${end.format('DD')}`;
    }

}