import {UChart} from './UChart.js';
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
    constructor(axis, container, uChart) {

        this._axis = axis;
        this._container = container;
        this._uChart = uChart;
        this._TICKS_MIN_DISTANCE = 10;
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

        var series = this._uChart.getSeries(0);

        for (var i = 2; this._isOverlaping(); i ++) {

            var ticksSelection = this._container.selectAll('text');
            var values = ticksSelection.data();

            values = values.map(function(d, j) {
                if (j % i == 0) {
                    return d;
                } else {
                    return null;
                }
            });

            this._container.call(this._axis.tickFormat(function(d, i) {
                if (values[i] == null) {
                    return '';
                } else {
                    return Formatter.format(d, series);
                }
            }));
        }
    }


    /**
     * @private
     */
    _rarefyTicks() {

        var ticks = this._container.selectAll('g.tick')
            .filter((d, i) => i < 2)
            .nodes()
            .map(d => d3.select(d).attr('transform'))
            .map(d => Util.getTranslate(d)[this._getIndex()]);

        var step = Math.abs(ticks[1] - ticks[0]);

        if (step < this._TICKS_MIN_DISTANCE && this._uChart.getSeries(0).dataType == 'date') {

            var ticksToRemove = Math.ceil(this._TICKS_MIN_DISTANCE / step) - 1;

            this._container.selectAll('g').nodes().forEach(function(node, i) {
                if (i % ticksToRemove != 0) {
                    d3.select(node).select('line').style('visibility', 'hidden');
                } else {
                    d3.select(node).select('line').style('visibility', 'visible');
                }
            })
        }
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