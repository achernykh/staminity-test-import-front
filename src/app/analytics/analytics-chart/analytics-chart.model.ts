import {IAnalyticsChartFilter} from "../analytics-chart-filter/analytics-chart-filter.model";
import {IChartMeasure, IChartParams, IChart} from "../../../../api/statistics/statistics.interface";
import moment from 'moment/src/moment.js';

export class AnalyticsChartLayout {


    fullScreen: boolean = false;

    constructor(public gridColumnEnd: number,
                public gridRowEnd: number){

    }

    get style(): any {
        return {
            'grid-column-end': `span ${this.gridColumnEnd}`,
            'grid-row-end':`span ${this.gridRowEnd}`
        };
    }

}

export interface IAnalyticsChart {
    order: number;
    active: boolean;
    icon?: string;
    title: string;
    description?: string;
    filter: IAnalyticsChartFilter;
    layout: AnalyticsChartLayout;
    charts: Array<IChart>;
}

export class AnalyticsChart implements IAnalyticsChart{

    order: number;
    active: boolean;
    icon?: string;
    title: string;
    description?: string;
    filter: IAnalyticsChartFilter;
    layout: AnalyticsChartLayout;
    charts: Array<IChart>;

    constructor(params?: IAnalyticsChart) {
        Object.assign(this, params);
    }

    hasMetrics(): boolean {
        return this.charts.some(c => c.hasOwnProperty('metrics'));
    }

    prepareMetrics(ind: number, metrics: Array<Array<any>>): void {
        this.charts[ind].metrics = [];
        metrics.map(m => {
            let metric: Array<any> = [];
            m.map((value,i) => {
                let params: IChartMeasure = this.charts[ind].series.filter(s => s.idx === i)[0] ||
                    this.charts[ind].measures.filter(s => s.idx === i)[0];

                if(params) {
                    if(params.dataType === 'date') {
                        metric.push(moment(value).format('MM-DD-YYYY'));
                    } else if(params.measureName === 'duration' ) {
                        metric.push(value / 60 / 60);
                    } else if(params.measureName === 'distance') {
                        metric.push(value / 1000);
                    } else if (params.measureName === 'speed' && params.dataType === 'time') {
                        metric.push(!!value ? (60 * 60) / (value * 3.6) : null);
                    } else {
                        metric.push(value);
                    }

               }
            });
            this.charts[ind].metrics.push(metric);
        });
    }

}