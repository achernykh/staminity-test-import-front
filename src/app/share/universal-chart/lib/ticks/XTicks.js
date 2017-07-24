import {Ticks} from '../Ticks.js';


/**
 * @public
 * @class
 */
class XTicks extends Ticks {
    /**
     * @public
     * @constructor
     * @param {d3.axis} axis
     * @param {d3.selection} container
     * @param {UChart} uChart
     */
    constructor(axis, container, uChart, axisConfig) {

        super(axis, container, uChart, axisConfig);
        this._DISTANCE = 10;
    }

    /**
     * @protected
     * @override
     * @returns {Integer}
     */
    _getIndex() {

        return 0;
    }


    /**
     * @protected
     * @override
     * @param {Object} tick1
     * @param {Object} tick2
     * @returns {Boolean}
     */
    _compare(tick1, tick2) {

        return tick1.right + this._DISTANCE > tick2.left;
    }
}


module.exports.XTicks = XTicks;