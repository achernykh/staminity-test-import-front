import {View2D} from './View2D.js';
import {Util} from '../Util.js';
import * as d3 from 'd3';


/**
 * @public
 * @class
 */
class BarView extends View2D {


    setSequenceNumber(number) {

        this._sequenceNumber = number;
    }


    /**
     * @override
     */
    render() {

        super.render();
    }


    /**
     * Apply common options to all bars.
     * @param {d3.selection} bars
     * @private
     */
    _customize(bars) {

        bars
            .style('fill', function(d, i) {
                return this._getColor(d);
            }.bind(this))
            .style('stroke', function(d, i) {
                return this.getScope().getMeasureConfig(this, i).lineColor;
            }.bind(this))
            .style('stroke-width', 1)
            .style('stroke-dasharray', function(d, i) {
                return Util.getStrokeDashArray(this.getScope().getMeasureConfig(this, i).lineStyle);
            }.bind(this));

        var self = this;
        var tooltip = this.getTooltip();

        if (! tooltip.isCombined()) {
          bars.on('mouseover', function(d, i, nodes) {
                  tooltip
                      .setOffset([0, 5])
                      .setContent(tooltip.getContent(this, d, i, nodes))
                      .setXY(self._getTooltipXY(this, d, i, nodes))
                      .show();
              }).on('mouseout', function() {
                  tooltip.hide();
              });
        }
    }


    /**
     * @override
     */
    _getTooltipXY(node, data, index, nodeList) {

        var dimension = node.getBoundingClientRect();

        var x = dimension.left + dimension.width / 2;
        var y = dimension.top;

        return [x, y];
    }


    /**
     * Is chart grouped?
     * @private
     * @static
     * @returns {Boolean}
     */
    static _isGrouped(uChart) {

        return _.uniq(uChart.getSeries().map(s => s.idx)).length > 1;
    }


    /**
     * @public
     * @param {Mixed} xValue0
     * @returns {Object[]}
     */
    getDataAt(xValue0) {

        return this.getData().filter(d => d.x0 == xValue0);
    }


    /**
     * Get groups list.
     * @public
     * @returns {String[]}
     */
    getGroups() {

        return _.uniq(this._uChart.getMetric(1));
    }
}


module.exports.BarView = BarView;