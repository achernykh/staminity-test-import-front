import {Formatter} from './Formatter.js';
import {Util} from './Util.js';
import * as d3 from 'd3';


/**
 * @private
 * @abstract
 * @class
 */
class Ticks {
    /**
     * @public
     * @constructor
     * @param {d3.axis} axis
     * @param {d3.selection} container
     * @param {UChart} uChart
     */
    constructor(axis, container, uChart, axisConfig) {

        this._axis = axis;
        this._container = container;
        this._axisConfig = axisConfig;
        this._TICKS_MIN_DISTANCE = uChart.getConfig().get('options.ticksMinDistance', 10);
        this._tickValues = [];
    }


    /**
     * @public
     * @abstract
     */
    rarefy() {

        this._rarefyLabels();
        this._rarefyTicks();
    }


    /**
     * @private
     */
    _rarefyLabels() {

        for (var i = 2; this._isOverlaping(); i ++) {

            var ticksSelection = this._container.selectAll('text');
            this._tickValues = ticksSelection.data()
                .map(function(d, j) {
                    if (j % i == 0) {
                        return d;
                    } else {
                        return null;
                    }
                });

            this._container.call(this._axis.tickFormat(function(d, i) {
                if (this._tickValues[i] == null) {
                    return '';
                } else {
                    return Formatter.format(d, this._axisConfig);
                }
            }.bind(this)));
        }
    }


    /**
     * @private
     */
    _rarefyTicks() {

        var self = this;

        var ticks = this._container.selectAll('g.tick')
            .filter((d, i) => i < 2)
            .nodes()
            .map(d => d3.select(d).attr('transform'))
            .map(d => Util.getTranslate(d)[this._getIndex()]);

        var step1 = Math.abs(ticks[1] - ticks[0]);

        var labeledTicks = this._container.selectAll('g.tick')
            .filter((d, i) => self._tickValues[i] != null)
            .filter((d, i) => i < 2)
            .nodes()
            .map(d => d3.select(d).attr('transform'))
            .map(d => Util.getTranslate(d)[this._getIndex()]);

        var step2 = Math.abs(labeledTicks[1] - labeledTicks[0]);

        var index2;
        for (var i = 1; i < self._tickValues.length; i ++) {
            if (self._tickValues[i] != null) {
                index2 = i;
                break;
            }
        }

        var ticksMinDistance = Math.min(this._TICKS_MIN_DISTANCE, step2);
        var index1 = Math.ceil(ticksMinDistance / step1);

        // var keepIndex = Math.min(this._getCommonMinDistance(index1, index2), index2);
        var keepIndex = index2;

        if (step1 < ticksMinDistance && this._axisConfig.dataType == 'date') {

            var ticksToRemove = Math.ceil(ticksMinDistance / step1) - 1;

            this._container.selectAll('g').nodes().forEach(function(node, i) {
                if (i % keepIndex != 0) {
                    d3.select(node).select('line').style('opacity', 0.2);
                } else {
                    d3.select(node).select('line').style('opacity', 1);
                }
            })
        }
    }


    /**
     * @private
     * @param {Integer} min
     * @param {Integer} max
     * @returns {Integer}
     */
    _getCommonMinDistance(min, max) {

        if (min >= max) {
            return max;
        }

        while (max % min != 0 && min <= max) {
            min ++;
        }

        return min;
    }


    /**
     * Check if x axis tiks's labels overlaps.
     * @private
     * @returns {Boolean}
     */
    _isOverlaping() {

        var dimensions = this._container.selectAll('text').nodes()
            .filter(function(node) {
                return node.innerHTML.length > 0;
            }).map(function(node) {
                return node.getBoundingClientRect();
            });

        for (var i = 1; i < dimensions.length; i ++) {
            if (this._compare(dimensions[i - 1], dimensions[i])) {
                return true;
            }
        }

        return false;
    }


    /**
     * @protected
     * @abstract
     * @param {Object} tick1
     * @param {Object} tick2
     * @returns {Boolean}
     */
    _compare(tick1, tick2) {

        throw new Error('Method _compare() not implemented in ' + this.constructor.name);
    }
}


module.exports.Ticks = Ticks;