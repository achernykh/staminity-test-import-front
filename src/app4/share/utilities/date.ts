import moment from 'moment/min/moment-with-locales.js';
import { memorize } from './common';

export let toDay = (date):Date => {
    let result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
};

export const parseUtc = memorize(date => moment.utc(date));

export const parseYYYYMMDD = memorize(date => moment(date, 'YYYY-MM-DD'));

export const fromNow = () => (date) => moment.utc(date).fromNow(true);