import {LineView} from '../LineView.js';
import {LineVerticalState} from './LineVerticalState.js';
import {LineHorizontalState} from './LineHorizontalState.js';
import {AreaView} from '../AreaView.js';
import {AreaVerticalState} from '../area/AreaVerticalState.js';
import {AreaHorizontalState} from '../area/AreaHorizontalState.js';
import {DotView} from '../DotView.js';
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
     * @static
     * @param {LineView} view
     * @returns {LineState}
     */
    static getInstance(view) {

        if (view.constructor.name == 'LineView') {
            if (view._orientation.isVertical()) {
                return new LineVerticalState(view);
            } else {
                return new LineHorizontalState(view);
            }
        } else if (view.constructor.name == 'AreaView') {
            if (view._orientation.isVertical()) {
                return new AreaVerticalState(view);
            } else {
                return new AreaHorizontalState(view);
            }
        } else if (view.constructor.name == 'DotView') {
            if (view._orientation.isVertical()) {
                return new LineVerticalState(view);
            } else {
                return new LineHorizontalState(view);
            }
        } else {
            throw new Error('Unexpected view class [' + view.constructor.name + ']');
        }
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