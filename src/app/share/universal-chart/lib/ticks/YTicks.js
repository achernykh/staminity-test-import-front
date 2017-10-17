import {Ticks} from '../Ticks.js';


/**
 * @public
 * @class
 */
class YTicks extends Ticks {
    /**
     * @protected
     * @override
     * @returns {Integer}
     */
    _getIndex() {

        return 1;
    }


    /**
     * @protected
     * @override
     * @param {Object} tick1
     * @param {Object} tick2
     * @returns {Boolean}
     */
    _compare(tick1, tick2) {

        return tick1.top < tick2.bottom;
    }
}


module.exports.YTicks = YTicks;