import moment from 'moment/min/moment-with-locales.js';
export const stringToDate = () => (input: string, format: string = 'YYYY-MM-DD'): Date => {
    return new Date(moment(input, format));
};