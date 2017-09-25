
import {IReportPeriod} from "../../../../api/statistics/statistics.interface";

const periodByType = (type: string): IReportPeriod => {
    switch (type) {
        case 'thisYear': {
            return {
                startDate: '20170101',
                endDate: '20171231'
            };
        }
        case 'thisMonth': {
            return {
                startDate: '20170901',
                endDate: '20170930'
            };
        }
        case 'thisWeek': {
            return {
                startDate: '20170918',
                endDate: '20170924'
            };
        }
        case 'customPeriod': {
            return {
                startDate: null,
                endDate: '20170924'
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