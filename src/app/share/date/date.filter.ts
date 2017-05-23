import * as moment from 'moment-timezone/index.js';
const _GMT: string = 'Europe/London';
const _format: string = 'YYYY-MM-DD hh:mm';

export const calcTimezoneTime = () => (date: Date, trgTimezone: string = _GMT, format: string = _format):Date => {
    //debugger;
    //return moment.tz(date.toISOString(),srcTimezone).clone().tz(trgTimezone).format(format);
    return moment(date.toISOString()).tz(trgTimezone).format(format);
};

export const changeTimezoneToGMT = (date: Date, srcTimezone: string, trgTimezone: string = _GMT):Date => {
    return new Date();//changeTimezone(date, srcTimezone, trgTimezone);
};