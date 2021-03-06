import {Config} from '../Config.js';


/**
 * @public
 * @abstract
 * @class
 */
class Orientation {
    /**
     * @public
     * @constructor
     * @param {Object} config
     * @param {UChart} uChart
     */
    constructor(config, uChart) {

        this._config = config;
        this._uChart = uChart;
    }


    /**
     * @public
     * @abstract
     * @returns {Boolean}
     */
    isVertical() {

        throw new Error('Method isVertical() not implemented in ' + this.constructor.name);
    }


    /**
     * @public
     * @static
     * @param {Object} options
     * @returns {Boolean}
     */
    static isVertical(options) {

        var config = new Config(options[0]);
        return config.get('series.0.xAxis', true);
    }


    /**
     * @public
     * @abstract
     * @returns {Integer[][]}
     */
    getGradientDirection() {

        throw new Error('Method getGradientDirection() not implemented in ' + this.constructor.name);
    }


    /**
     * @public
     * @abstract
     * @returns {Number}
     */
    getWidth() {

        return this._uChart.getInnerWidth();
    }


    /**
     * @public
     * @abstract
     * @returns {Number}
     */
    getHeight() {

        return this._uChart.getInnerHeight();
    }


    /**
     * @public
     * @abstract
     * @param {Number} position
     */
    moveLinePointer(position) {

        throw new Error('Method moveLinePointer() not implemented in ' + this.constructor.name);
    }


    /**
     * @public
     * @abstract
     * @param {Number} position
     * @returns {Object}
     */
    getPointerConfig(position) {

        throw new Error('Method getPointerConfig() not implemented in ' + this.constructor.name);
    }


    /**
     * @public
     * @abstract
     * @param {Number[]} position
     * @param {Number[]} offset
     * @param {Element} tip
     * @returns {Number}
     */
    adjustTooltipPosition(position, offset, tip) {

        throw new Error('Method adjustTooltipPosition() not implemented in ' + this.constructor.name);
    }


    /**
     * @public
     * @abstract
     * @param {Mixed[]} domain
     * @returns {Mixed[]}
     */
    reverseSeriesDomain(domain) {

        throw new Error('Method reverseSeriesDomain() not implemented in ' + this.constructor.name);
    }


    /**
     * @public
     * @abstract
     * @param {Number[]} domain
     * @returns {Number[]}
     */
    reversePosition(poistion) {

        throw new Error('Method reversePosition() not implemented in ' + this.constructor.name);
    }


    /**
     * @public
     * @abstract
     * @param {Object} margin
     * @returns {Number}
     */
    getPositionLineOffset(margin) {

        throw new Error('Method getPositionLineOffset() not implemented in ' + this.constructor.name);
    }
}


module.exports.Orientation = Orientation;