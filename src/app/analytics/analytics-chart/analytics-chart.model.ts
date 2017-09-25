import {IAnalyticsChartFilter} from "../analytics-chart-filter/analytics-chart-filter.model";
import {IChartMeasure, IChartParams, IChart} from "../../../../api/statistics/statistics.interface";

export class AnalyticsChartLayout {


    constructor(private gridColumnStart: number,
                private gridColumnEnd: number,
                private gridRowStart: number,
                private gridRowEnd: number){

    }

    get style(): any {
        return {
            'grid-column-start': this.gridColumnStart,
            'grid-column-end': this.gridColumnEnd,
            'grid-row-start': this.gridRowStart,
            'grid-row-end': this.gridRowEnd
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

}