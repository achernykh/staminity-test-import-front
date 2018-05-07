import moment from 'moment/min/moment-with-locales.js';
import { SessionService } from "../../core/session/session.service";
import {measurementUnitDisplay, measurementUnit, _measurement_calculate,
    isDuration, isPace, _measurement_system_calculate} from './measure.constants';

export const measureSaveFilter = () => (session: SessionService) => {
    return (measure, value, sport) => {
        const unit = measurementUnitDisplay(sport, measure);

        if (isDuration(unit)) {
            return moment(value, ["ss", "mm:ss", "hh:mm:ss"]).diff(moment().startOf("day"), "seconds");
        } else {
            if (isPace(unit)) {
                value = moment(value, ["ss", "mm:ss"]).diff(moment().startOf("day"), "seconds");
            }
            // обратный пересчет по системе мер
            if (session.getUser().display.units !== "metric") {
                value = value / _measurement_system_calculate[unit].multiplier;
            }
            // пересчет от единиц представления в еденицы обмена данными
            if (unit !== measurementUnit(measure)) {
                value = _measurement_calculate[unit][measurementUnit(measure)](value);
            }

            return value;
        }
    };
};