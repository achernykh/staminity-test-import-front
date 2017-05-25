import * as moment from 'moment-timezone/index.js';
const _GMT: string = 'Europe/London';
const _format: string = 'YYYY-MM-DD hh:mm';

export const calcTimezoneTime = () => (date: Date | string, trgTimezone: string = _GMT, format: string = _format):Date => {
    return moment(typeof date === 'string' ? date+'Z': date.toISOString()).tz(trgTimezone).format();
};

export const changeTimezoneToGMT = (date: Date, srcTimezone: string, trgTimezone: string = _GMT):Date => {
    return new Date();//changeTimezone(date, srcTimezone, trgTimezone);
};