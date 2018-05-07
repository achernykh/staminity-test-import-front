import * as moment from "moment-timezone/index.js";
import { memorize } from "../utility/memorize";
const _GMT: string = "Europe/London";
const _format: string = "YYYY-MM-DD hh:mm";

export const getTimeZones = () => {
    return moment.tz.names().map((z) => ({
        title: `(GMT${moment.tz(z).format('Z')}) ${z}`,
        name: z,
        offset: moment.tz(z).offset
    }));
};

export const calcTimezoneTime = () => (date: Date | string, trgTimezone: string = _GMT, format: string = _format): Date => {
    return moment(typeof date === "string" ? date + "Z" : date.toISOString()).tz(trgTimezone).format();
};

export const getLocalTimeUTC = (date: Date | string): Date => {
    return new Date();
};

export const parseUtc = memorize(date => moment.utc(date));

export const parseYYYYMMDD = memorize(date => moment(date, 'YYYY-MM-DD'));

export const fromNow = () => (date) => moment.utc(date).fromNow(true);

export const utcStartOfDay = (date: string): string =>  moment().utc().add(moment().utcOffset(),'minutes').startOf('day').format('YYYY-MM-DDTHH:mm:ss');