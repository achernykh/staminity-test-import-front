import moment from 'moment/src/moment.js';
import {IReportPeriod} from "../../../../api/statistics/statistics.interface";

export const periodByType = (type: string): Array<IReportPeriod> => {
    let format: string = 'YYYYMMDD';
    switch (type) {
        case 'thisYear': {
            return [{
                startDate: moment().startOf('year').format(format),
                endDate: moment().endOf('year').format(format)
            }];
        }
        case 'thisMonth': {
            return [{
                startDate: moment().startOf('month').format(format),
                endDate: moment().endOf('month').format(format)
            }];
        }
        case 'thisWeek': {
            return [{
                startDate: moment().startOf('week').format(format),
                endDate: moment().endOf('week').format(format)
            }];
        }
        case 'customPeriod': {
            return [{
                startDate: moment().startOf('year').format(format),
                endDate: moment().format(format)
            }];
        }
    }
};

export const PeriodOptions = (options: Array<string> = ['thisYear','thisMonth','thisWeek','customPeriod']):
    Array<IReportPeriodOptions> => {
    return options.map(o => ({
        name: o,
        period: null//periodByType(o)
    }));
};

export interface IAnalyticsChartFilterParam<T> {
    type: 'date' | 'text' | 'select' | 'checkbox' | 'radio';
    area: 'params' | 'series' | 'measures';
    ind?: Array<number>; // индекс в массиве chart
    idx?: Array<number>; // индекс в массиве series/measures
    name: string;
    text: string; // название показателя для вывода на экран analytics.params... | translate
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