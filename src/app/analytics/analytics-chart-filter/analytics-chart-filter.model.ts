
import {IReportPeriod} from "../../../../api/statistics/statistics.interface";

const periodByType = (type: string): IReportPeriod => {
    switch (type) {
        case 'thisYear': {
            return {
                startDate: '01.01.2017',
                endDate: '31.12.2017'
            };
        }
        case 'thisMonth': {
            return {
                startDate: '01.09.2017',
                endDate: '30.09.2017'
            };
        }
        case 'thisWeek': {
            return {
                startDate: '18.09.2017',
                endDate: '24.09.2017'
            };
        }
        case 'customPeriod': {
            return {
                startDate: null,
                endDate: '30.09.2017'
            };
        }
    }
};

export const PeriodOptions = (options: Array<string> = ['thisYear','thisMonth','thisWeek','customPeriod']):
    Array<IReportPeriodOptions> => {
    return options.map(o => ({
        name: o,
        period: periodByType(o)
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