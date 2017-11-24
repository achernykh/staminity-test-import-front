import {U2DChart} from './U2DChart.js';
import {MMargin} from '../MMargin.js';
import {Util} from '../Util.js';
import {Formatter} from '../Formatter.js';
import {XTicks} from '../ticks/XTicks.js';
import {YTicks} from '../ticks/YTicks.js';
import * as d3 from 'd3';


/**
 * @public
 * @class
 */
class U2DVerticalChart extends U2DChart {
    /**
     * @public
     * @constructor
     * @param {Object} options
     * @param {Object} originalOptions
     */
    constructor(options, originalOptions) {

        super(options, originalOptions);

        this._mManager = new MMargin({
            left: 0,
            top: 0,
            right: 0,
            bottom: 20
        });

        this._labelsMap = {};
        this._marginMap = {
            left: [],
            right: []
        }
    }


    /**
     * @public
     * @override
     * @param {container} d3.selection
     */
    renderTo(container) {

        super.renderTo(container);

        this._xAxisContainer = this._canvas.append('g')
            .attr('class', 'axis series-axis');

        this._xAxisLabel = this._canvas.append('text')
            .attr('class', 'axis-label x-axis-label')
            .text(this.getConfig().get('series.0.scaleLabel', ''));

        this._mManager.addBottom(this._xAxisLabel.node().getBoundingClientRect().height);

        this._yAxisContainer = this._canvas.selectAll('g.y-axis')
            .data(this.getMeasureAxesData(true))
            .enter()
            .append('g')
            .attr('class', function(d, i) {
                if (i > 1) {
                    return 'axis measure-axis ' + d.measureName + '-measure-axis outer-axis';
                } else {
                    return 'axis measure-axis ' + d.measureName + '-measure-axis inner-axis';
                }
            });

        var self = this;
        var labelsData = this.getMeasureAxesData().filter(m => ! Util.isEmpty(m.scaleLabel));

        this._canvas.selectAll('text.y-axis-label')
            .data(labelsData)
            .enter()
            .append('text')
            .attr('class', 'axis-label y-axis-label')
            .attr('transform', 'rotate(90)')
            .text(d => d.scaleLabel)
            .each(function(d) {
                self._labelsMap[d.measureName] = this;
            });

        this.getViews().forEach(function(view) {
            view.render()
                .renderMeanLine();
        }, this);

        this.resize();

        return this;
    }


    /**
     * @public
     * @override
     */
    resize() {

        super.resize();

        var margin = this._getMargin();
        this._margin = JSON.parse(JSON.stringify(margin))

        this._marginMap.left = [];
        this._marginMap.right = [];

        var self = this;
        var measureScales = this.getMeasureScales();

        this._yAxisContainer
            .each(function(measureConfig, i) {
                d3.select(this).call(
                    self._getD3Axis(i, measureScales[measureConfig.measureName])
                    .tickFormat(function(value, i) {
                        return Formatter.format(value, measureConfig);
                }));
            }).attr('transform', function(measureConfig, i) {
                return 'translate(' + self._getMeasureAxisOffset(i, measureConfig, this) + ')';
            });

        var left = [];
        var right = [this.getInnerWidth() + this._margin.left];

        for (var i = 0; i < this._marginMap.left.length; i ++) {
            left.push(margin.left + d3.sum(this._marginMap.left) - d3.sum(this._marginMap.left.slice(0, i)));
        }

        for (i = 1; i < this._marginMap.right.length; i ++) {
            right.push(this.getInnerWidth() + this._margin.left + d3.sum(this._marginMap.right.slice(0, i)));
        }

        this._yAxisContainer.attr('transform', function(d, i) {
                return 'translate(' + self._getYAxisOffset(i, left, right) + ')';
            }.bind(this))
            .each(function(measureConfig, i) {
                /*
                 * Раскрашиваем значения на шкале.
                 */
                d3.select(this)
                    .selectAll('text')
                    .attr('fill', measureConfig.markerColor || '#000');
                /*
                 * Перемещаем подписи к осям в нужное место.
                 */
                if (measureConfig.measureName in self._labelsMap) {

                    var width = this.getBoundingClientRect().width;
                    var y = self._getYAxisOffset(i, left, right)[0];

                    if (i % 2 == 1) {
                        y += width + 5;
                    } else {
                        y -= width + 5;
                    }

                    d3.select(self._labelsMap[measureConfig.measureName])
                        .attr('x', self.getInnerHeight() / (i % 2 == 1 ? 2 : -2))
                        .attr('y', (i % 2 == 1 ? -y : y))
                        .attr('transform', 'rotate(' + (i % 2 == 1 ? 90 : 270) + ')')
                        .style('fill', measureConfig.markerColor);
                }
            });

        this._xAxis = d3.axisBottom(this.getSeriesScale());
        this._xAxisContainer
            .attr('transform', 'translate(' + this._getXAxisOffset() + ')')
            .call(this._xAxis.tickFormat(function(value, i) {
                return Formatter.format(value, self.getSeries(0));
            }));

        var xLabelOffset = [
            this.getInnerWidth() / 2 + this._margin.left,
            this.getInnerHeight() + this._xAxisContainer.node().getBoundingClientRect().height + this._xAxisLabel.node().getBoundingClientRect().height - 3
        ];

        this._xAxisLabel
            .attr('transform', 'translate(' + xLabelOffset + ')');

        this._canvas
            .attr('transform', 'translate(0, ' + this._margin.top + ')');

        new XTicks(this._xAxis, this._xAxisContainer, this, this.getConfig().get('series.0'))
            .rarefy();

        this._yAxisContainer.each(function(measureConfig) {
            var axis = self._getD3Axis(i, measureScales[measureConfig.measureName]);
            new YTicks(axis, d3.select(this), self, measureConfig)
                .rarefy();
        });

        this._viewsContainer
            .attr('transform', 'translate(' + this._margin.left + ', 0)')

        this._views.forEach(function(view) {
            view.resize();
        });

        this._legend.resize();
    }


    _getYAxisOffset(i, left, right) {

        if (i % 2 == 1) {
            return [right[Math.floor(i / 2)], 0];
        } else {
            return [left[Math.floor(i / 2)], 0];
        }
    }


    _getXAxisOffset() {

        if (this._isAligned()) {
            return [this._margin.left, this._getMeasureScale()(0)];
        } else {
            return [this._margin.left, this.getInnerHeight()];
        }
    }


    /**
     * @private
     * @param {Integer} index
     * @param {Object} measureConfig
     * @param {HTMLElement} axisContainer
     * @returns {Number[]}
     */
    _getMeasureAxisOffset(index, measureConfig, axisContainer) {

        var width = axisContainer.getBoundingClientRect().width;

        if (measureConfig.measureName in this._labelsMap) {
            width += this._labelsMap[measureConfig.measureName].getBoundingClientRect().width;
        }

        if (index % 2 == 1) {
            this._marginMap.right.push(width);
            this._margin.right += width;
            return [this.getInnerWidth() + this._margin.left, 0];
        } else {
            this._marginMap.left.push(width);
            this._margin.left += width;
            return [this._margin.left, 0];
        }
    }


    /**
     * @private
     * @param {Integer} index
     * @param {d3.scale} scale
     * @returns {d3.axis}
     */
    _getD3Axis(index, scale) {

        if (index % 2 == 1) {
            return d3.axisRight(scale);
        } else {
            return d3.axisLeft(scale);
        }

    }


    getMeasureScales() {

        var axes = {};

        this.getMeasureAxesData().forEach(function(measure, i) {

            var domain = d3.extent(this._getMeasureDomain(measure.measureName));
            if (! Util.isEmpty(measure.minValue)) {
                domain[0] = measure.minValue;
            } else {
                domain[0] += domain[0] > 0 ? domain[0] / -100 : domain[0] / 100;
                domain[1] += domain[1] > 0 ? domain[1] / 100 : domain[1] / -100;
            }

            if (measure.reverse) {
                domain.reverse();
            }

            axes[measure.measureName] = d3.scaleLinear()
                .domain(domain)
                .range([this.getInnerHeight(), 0]);
        }, this);

        return axes;
    }


    /**
     * @public
     * @returns {Mixed[]}
     */
    getSeriesRange() {

        return [0, this.getInnerWidth()];
    }
}


module.exports.U2DVerticalChart = U2DVerticalChart;