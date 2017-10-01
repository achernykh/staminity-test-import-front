import {View1D} from './View1D.js';
import {Color} from '../Color.js';
import * as d3 from 'd3';


/**
 * @public
 * @class
 */
class PieView extends View1D {
    /**
     * @public
     * @override
     * @returns {Object[]}
     */
    getData() {

        var rawData = this._uChart.getMetrics();
        var pie = this._getPieGenerator();
        var pieData = pie(rawData);

        pieData = pieData.map(function(d, i, set) {

            d.x0 = d.data[0];
            d.x1 = undefined;
            d.y = d.data[1];
            d.color = Color.getColor(d.index, set.length, this._config, this.getScope())

            return d;
        }, this);

        return pieData;
    }


    /**
     * @private
     * @returns {d3.pie}
     */
    _getPieGenerator() {

        return d3.pie()
            .value(function(d) {
                return d[1];
            }).sort(function(a, b) {
                return null;
                // return b[1] - a[1];
            });
    }


    /**
     * @protected
     * @returns {d3.arc}
     */
    _getArcGenerator() {

        return d3.arc()
            .innerRadius(0)
            .outerRadius(this._getRadius());
    }


    /**
     * @protected
     * @returns {Number}
     */
    _getRadius() {

        // console.log(this._uChart.getInnerWidth(), this._uChart.getOuterWidth())
        return Math.min(this.getWidth(), this.getHeight()) / 2 * 0.95;
        // return Math.min(this._uChart.getOuterWidth(), this._uChart.getOuterHeight()) / 2 * 0.95;
    }


    /**
     * @public
     * @override
     * @returns {View}
     */
    render() {

        this._container = this.getViewsContainer().append('g')
            .attr('class', 'view pie-view');

        var pieData = this.getData();

        this._slices = this._container
            .selectAll('path')
            .data(pieData)
            .enter()
            .append('path')
            .attr('fill', function(d, i, set) {
                return d.color;
            });

        var self = this;
        var tooltip = this.getTooltip();

        if (! tooltip.isCombined()) {
            this._slices.on('mouseover', function(d, i, nodes) {
                tooltip
                    .setContent(tooltip.getContent(this, d, i, self))
                    .show()
                    .setXY(self._getTooltipXY(this, d))
                    .show(true);
            }).on('mouseout', function() {
                tooltip.hide();
            });
        }

        this.resize();

        return this;
    }


    _getTooltipXY(path, d) {

        return [
            this._getTooltipX(path, d),
            this._getTooltipY(path, d)
        ];
    }


    _getTooltipX(path, d) {

        var coordinates = this._getArcGenerator().centroid(d).map(function(d) {
            return d;
        });

        var svgBox = this.getSvg().node().getBoundingClientRect();
        var tipBox = this.getTooltip().getContainer().node().getBoundingClientRect();
        var margin = this._uChart.getMargin();

        var midAngle = this._toDegrees(this._getMidAngle(d));

        if (midAngle <= 180) {
            return svgBox.left + coordinates[0] + this.getWidth() / 2 + margin.left;
        } else {
            return svgBox.left + coordinates[0] + this.getWidth() / 2 + margin.left - tipBox.width;
        }
    };


    _getTooltipY(rect, d) {

        var coordinates = this._getArcGenerator().centroid(d).map(function(d) {
            return d;
        });

        var svgBox = this.getSvg().node().getBoundingClientRect();
        var tipBox = this.getTooltip().getContainer().node().getBoundingClientRect();
        var margin = this._uChart.getMargin();

        var midAngle = this._toDegrees(this._getMidAngle(d));

        if (midAngle > 90 && midAngle < 270) {
            return svgBox.top + coordinates[1] + this.getHeight() / 2 + margin.top;
        } else {
            return svgBox.top + coordinates[1] + this.getHeight() / 2 + margin.top - tipBox.height;
        }
    };


    /**
     * Convert radians to degrees.
     * @private
     * @param {Number} radians
     * @returns {Number}
     */
    _toDegrees(radians) {

        return radians * 180 / Math.PI;
    };


    /**
     * Get slice middle/average angle.
     * @param {Object} d
     * @returns {Number}
     */
    _getMidAngle(d) {

        return d.startAngle + (d.endAngle - d.startAngle) / 2;
    };


    /**
     * @public
     * @override
     */
    resize() {

        var margin = this._uChart.getMargin();

        // var width = this._uChart.getOuterWidth();
        // var height = this._uChart.getOuterHeight();
        var width = this.getWidth();
        var height = this.getHeight();

        var xOffset = width / 2;
        var yOffset = height / 2;

        this._container
            .attr('transform', 'translate(' + [xOffset, yOffset] + ')')

        this._slices
            .attr('d', this._getArcGenerator());

        var self = this;
    }
}


module.exports.PieView = PieView;