
import {IReportPeriod} from "../../../../api/statistics/statistics.interface";

export const PeriodOptions = (options: Array<string> = ['thisYear','thisMonth','thisWeek','customPeriod']):
    Array<IReportPeriodOptions> => {
    return options.map(o => ({
        name: o,
        period: {
            startDate: null,
            endDate: null
        }
    }));
};

export interface IAnalyticsChartFilterParam<T> {
    type: 'date' | 'text' | 'select' | 'checkbox' | 'radio';
    area: 'params' | 'series' | 'measures';
    ind?: number; // индекс в массиве series/measures
    name: string;
    model: any;
    options: Array<T>;
    protected?: boolean;
}

export interface IAnalyticsChartFilter {
    enabled: boolean;
    params?: Array<IAnalyticsChartFilterParam<any>>;
}

export interface IReportPeriodOptions {
    name: string;
    period: IReportPeriod;
}

export interface IReportRadioOptions {
    name: string;
    value: boolean;
}