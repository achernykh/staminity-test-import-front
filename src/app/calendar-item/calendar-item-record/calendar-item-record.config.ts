import { IRepeatTerms } from "../../../../api/calendar/calendar.interface";
export interface ICalendarItemRecordConfig {
    types: string[];
    defaultType: string;
    periods: string[];
    endTypes: string[];
    defaultRepeat: IRepeatTerms;
}

export const CalendarItemRecordConfig: ICalendarItemRecordConfig = {
    types: ["restDay", "sickness", "travel", "note", "diet", "bar", "warning", "female", "vitamins", "video"],
    defaultType: "restDay",
    periods: ["D", "W", "M", "Y"],
    endTypes: ["D", "C"],
    defaultRepeat: {
        period: "D",
        every: 1,
        days: [0, 1, 2, 3, 4],
        position: null,
        endType: "D",
        endOnDate: null,
        endOnCount: null,
    },
};
