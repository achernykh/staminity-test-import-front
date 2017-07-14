import {LineState} from './LineState.js';
import {Util} from '../../Util.js';
import * as d3 from 'd3';


/**
 * @private
 * @class
 */
class LineVerticalState extends LineState {
    /**
     * @public
     * @override
     * @returns {d3.line}
     */
    getLineGenerator() {

        var xScale = this._view.getSeriesScale();
        var yScale = this._view.getMeasureScale();
        var curveName = this._view.getConfig().get('smoothSettings', 'curveLinear');

        if (! (curveName in d3) || Util.isEmpty(curveName)) {
            console.warn('Unexpected "smoothSettings" option value "' + curveName + '". Set "curveLinear" as default');
            curveName = 'curveLinear';
        }

        return d3.line()
            .x(function(d) {
                return xScale(d.x0);
            }).y(function(d) {
                return yScale(d.y);
            }).curve(d3[curveName]);
    }


    /**
     * @public
     * @override
     * @returns {Number[]}
     */
    getTransform() {

        return [this._view.getSeriesScale().bandwidth() / 2, 0];
    }


    /**
     * @public
     * @override
     * @returns {Object}
     */
    getMeanLineData() {

        var scale = this._view.getMeasureScale();
        var mean = scale(d3.mean(this._view.getY()));

        return {
            x1: 0,
            y1: mean,
            x2: this._view.getWidth(),
            y2: mean
        }
    }


    /**
     * @public
     * @override
     * @returns {Object}
     */
    getClipPathData() {

        var seriesScale = this._view.getSeriesScale();
        var extra = seriesScale.bandwidth();

        return {
            x: function(d) {
                return seriesScale(d[0]) - extra / 2;
            },
            y: 0,
            width: function(d) {
                return seriesScale(d[1]) + extra;
            },
            height: this._view.getHeight()
        }
    }


    /**
     * @public
     * @override
     * @returns {d3.scale}
     */
    getXScale() {

        return this._view.getSeriesScale();
    }


    getX(d) {

        return d.x0;
    }


    /**
     * @public
     * @override
     * @param {Object} point
     * @returns {d3.scale}
     */
    getYScale() {

        return this._view.getMeasureScale();
    }


    getY(d) {

        return d.y;
    }
}


module.exports.LineVerticalState = LineVerticalState;