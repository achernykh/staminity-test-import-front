import moment from 'moment/min/moment-with-locales.js';
import { IChart } from "@api/statistics/statistics.interface";
import { Microcycle } from "../training-season/training-season-microcycle.datamodel";

export const preparePeriodizationChart = (template: IChart, data: Array<Microcycle> = []): Array<IChart> => {
    let chart: Array<IChart> = [];

    /**data.map(c => {
        let iChart: IChart = Object.assign({}, template);
        iChart.metrics = [
            [
                moment(c._dateStart).format('MM-DD-YYYY'),
                c.durationValue,
                c.calcMeasures.hasOwnProperty(c.durationMeasure) && c.calcMeasures[c.durationMeasure].value || null
            ]
        ];
        chart.push(iChart);
    });

    return chart;**/

    return [ Object.assign({}, template, {
        options: {
            palette: data.map(c => c.mesocycle && c.mesocycle.hasOwnProperty('color') && c.mesocycle.color || null)
        },
        metrics: data.map(c => [
            moment(c._dateStart).format('MM-DD-YYYY'),
            c.durationValue,
            c.calcMeasures && c.calcMeasures.hasOwnProperty(c.durationMeasure) && c.calcMeasures[c.durationMeasure].sum / 1000 || null
        ])
    })];
};