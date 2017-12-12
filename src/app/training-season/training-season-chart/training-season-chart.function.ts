import moment from 'moment/min/moment-with-locales.js';
import { IChart } from "@api/statistics/statistics.interface";
import { Microcycle } from "../training-season/training-season-microcycle.datamodel";
import { hexToRgbA } from "../../share/utility";

const feature: string = '#E0E0E0';
const past: string = '#BDBDBD';

export const preparePeriodizationDurationChart = (template: IChart, data: Array<Microcycle> = []): Array<IChart> => {
    return [ Object.assign({}, template, {
        options: {
            palette: data.map(c => moment(c._dateStart).isAfter(moment()) ? hexToRgbA(feature, 1) : hexToRgbA(past, 1) || null)
                .filter((p,i,array) => array.indexOf(p) === i)
        },
        metrics: data.map(c => [
            moment(c._dateStart).format('MM-DD-YYYY'),
            moment(c._dateStart).isAfter(moment()) ? 'feature' : 'past',
            c.durationValue || null,
            c.calcMeasures && c.calcMeasures.hasOwnProperty(c.durationMeasure) && c.calcMeasures[c.durationMeasure].sum / 1000 || null
        ])
    })];
};

export const preparePeriodizationMesocyclesChart = (template: IChart, data: Array<Microcycle> = []): Array<IChart> => {
    return [ Object.assign({}, template, {
        options: {
            palette: data.map(c => c.mesocycle && c.mesocycle.hasOwnProperty('color') && hexToRgbA(c.mesocycle.color, 1) || null)
                .filter((p,i,array) => array.indexOf(p) === i)
        },
        metrics: data.map(c => [
            moment(c._dateStart).format('MM-DD-YYYY'),
            c.mesocycle && c.mesocycle.code || '',
            c.mesocycle && c.mesocycle.code ? 10 : 0
        ])
    })];
};
