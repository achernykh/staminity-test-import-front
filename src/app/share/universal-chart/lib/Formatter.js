import {Util} from './Util.js';
import * as d3 from 'd3';


/**
 * @public
 * @class
 */
class Formatter {
    /**
     * Format value occording with config.
     * @public
     * @param {Mixed} value
     * @param {Object} config
     * @returns {Mixed}
     */
    static format(value, config) {

        if (config.dataType == 'date') {
            return Formatter.formatDate(value, config.dateFormat);
        } if (config.dataType == 'time') {
            return Formatter.formatTime(value, config.dateFormat);
        } else if (Util.isNumeric(value)) {
            return Util.round(value, 2);
        } else {
            return value;
        }
    }


    /**
     * Format seconds amount to time string.
     * @public
     * @param {Integer} value
     * @param {String} [formatString=mm:ss]
     * @returns {Mixed}
     */
    static formatTime(value, formatString = 'mm:ss') {

        return moment(new Date(0, 0, 0, 0, 0, value)).format(formatString);
    }


    /**
     * Format date.
     * @public
     * @param {String} date
     * @param {String} [formatString=MM-DD-YYYY]
     * @returns {Mixed}
     */
    static formatDate(date, formatString = 'MM-DD-YYYY') {

        return moment(date, 'MM-DD-YYYY').format(formatString);
    }
}


module.exports.Formatter = Formatter;