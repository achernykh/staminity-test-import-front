import * as d3 from 'd3';


/**
 * @private
 * @abstract
 * @class
 */
class LineState {
    /**
     * @public
     * @param {LineView} view
     */
    constructor(view) {

        this._view = view;
    }


    /**
     * @public
     * @abstract
     * @returns {d3.line}
     */
    getLineGenerator() {

        throw new Error('Method getLineGenerator() not implemented in ' + this.constructor.name);
    }


    /**
     * @public
     * @abstract
     * @returns {Number[]}
     */
    getTransform() {

        throw new Error('Method getTransform() not implemented in ' + this.constructor.name);
    }


    /**
     * @public
     * @abstract
     * @returns {Object}
     */
    getMeanLineData() {

        throw new Error('Method getMeanLineData() not implemented in ' + this.constructor.name);
    }


    /**
     * @public
     * @abstract
     * @returns {Object}
     */
    getClipPathData() {

        throw new Error('Method getClipPathData() not implemented in ' + this.constructor.name);
    }


    /**
     * @public
     * @abstract
     * @param {Object} point
     * @returns {Number}
     */
    getX(point) {

        throw new Error('Method getX() not implemented in ' + this.constructor.name);
    }


    /**
     * @public
     * @abstract
     * @returns {d3.scale}
     */
    getXScale() {

        throw new Error('Method getXScale() not implemented in ' + this.constructor.name);
    }


    /**
     * @public
     * @abstract
     * @param {Object} point
     * @returns {Number}
     */
    getY(point) {

        throw new Error('Method getY() not implemented in ' + this.constructor.name);
    }


    /**
     * @public
     * @abstract
     * @param {Object} point
     * @returns {d3.scale}
     */
    getYScale() {

        throw new Error('Method getYScale() not implemented in ' + this.constructor.name);
    }
}


module.exports.LineState = LineState;