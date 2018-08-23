import moment from "moment/src/moment.js";
import { IReportPeriod } from "../../../../api/statistics/statistics.interface";

export const comparePeriodType = (type: string): string => {
    switch (type) {
        case 'thisYear': return 'previewYear';
        case 'thisMonth': return 'previewMonth';
        case 'thisWeek': return 'previewWeek';
        case 'customPeriod': return 'customPeriod';
    }
};

export const comparePeriodTransform = (type: string, value: string): string => {
    debugger;
    switch (type) {
        case 'thisYear': return moment(value).add(1, 'year').format("MM-DD-YYYY");
        case 'thisMonth': return moment(value).add(1, 'month').format("MM-DD-YYYY");
        case 'thisWeek': return moment(value).add(1, 'week').format("MM-DD-YYYY");
    }
};

export const periodByType = (type: string): IReportPeriod[] => {
    const format: string = "YYYYMMDD";
    switch (type) {
        case "last12months": {
            return [{
                startDate: moment().add(-12,'month').startOf("month").format(format),
                endDate: moment().endOf("month").format(format),
            }];
        }
        case "thisYear": {
            return [{
                startDate: moment().startOf("year").format(format),
                endDate: moment().endOf("year").format(format),
            }];
        }
        case "currentYear": {
            return [{
                startDate: moment().startOf("year").format(format),
                endDate: moment().format(format),
            }];
        }
        case "previewYear": {
            return [{
                startDate: moment().add(-1, 'year').startOf("year").format(format),
                endDate: moment().add(-1, 'year').endOf("year").format(format),
            }];
        }
        case "thisMonth": {
            return [{
                startDate: moment().startOf("month").format(format),
                endDate: moment().endOf("month").format(format),
            }];
        }
        case "previewMonth": {
            return [{
                startDate: moment().add(-1, 'month').startOf("month").format(format),
                endDate: moment().add(-1, 'month').endOf("month").format(format),
            }];
        }
        case "thisWeek": {
            return [{
                startDate: moment().startOf("week").format(format),
                endDate: moment().endOf("week").format(format),
            }];
        }
        case "previewWeek": {
            return [{
                startDate: moment().add(-1, 'week').startOf("week").format(format),
                endDate: moment().add(-1, 'week').endOf("week").format(format),
            }];
        }
        case "customPeriod": {
            return [{
                startDate: moment().startOf("year").format(format),
                endDate: moment().format(format),
            }];
        }
    }
};