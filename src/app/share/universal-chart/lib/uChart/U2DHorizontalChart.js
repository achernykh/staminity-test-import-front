import {U2DChart} from './U2DChart.js';
import {MMargin} from '../MMargin.js';
import {Util} from '../Util.js';
import {Formatter} from '../Formatter.js';
import {YTicks} from '../ticks/YTicks.js';
import {XTicks} from '../ticks/XTicks.js';
import * as d3 from 'd3';


/**
 * @public
 * @class
 */
class U2DHorizontalChart extends U2DChart {
    /**
     * @public
     * @constructor
     * @param {Object} options
     */
    constructor(options) {

        super(options);

        this._mManager = new MMargin({
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        });

        this._labelsMap = {};
        this._marginMap = {
            top: [],
            bottom: []
        }
    }


    /**
     * @public
     * @override
     * @param {container} d3.selection
     */
    renderTo(container) {

        super.renderTo(container);

        this._yAxisContainer = this._canvas.append('g')
            .attr('class', 'axis series-axis');

        this._xAxisContainer = this._canvas.selectAll('g.y-axis')
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

      this._canvas.selectAll('text.x-axis-label')
          .data(labelsData)
          .enter()
          .append('text')
          .attr('class', 'axis-label x-axis-label')
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

        this._marginMap.top = [];
        this._marginMap.bottom = [];

        this._yAxis = d3.axisLeft(this.getSeriesScale());
        this._yAxisContainer
            .call(this._yAxis.tickFormat(function(value, i) {
                return Formatter.format(value, this.getSeries(0));
            }.bind(this)));

        var xAxisBox = this._yAxisContainer.node().getBoundingClientRect();
        if (! this._isAligned()) {
            this._margin.left = margin.left + xAxisBox.width;
        } else if (this._getMeasureScale()(0) < xAxisBox.width) {
            this._margin.left = margin.left + xAxisBox.width - this._getMeasureScale()(0);
        } else {
            this._margin.left = margin.left;
        }

        var self = this;
        var measureScales = this.getMeasureScales();

        this._xAxisContainer
            .each(function(measureConfig, i) {
                d3.select(this).call(
                    self._getD3Axis(i, measureScales[measureConfig.measureName])
                    .tickFormat(function(value, i) {
                        return Formatter.format(value, measureConfig);
                }));
            }).attr('transform', function(measureConfig, i) {
                return 'translate(' + self._getMeasureAxisOffset(i, measureConfig, this) + ')';
            });

        var top = [this._margin.top];
        var bottom = [this.getInnerHeight() + this._margin.top];

        for (var i = 1; i < this._marginMap.top.length; i ++) {
            top.push(d3.sum(this._marginMap.top) - d3.sum(this._marginMap.top.slice(0, i)) + margin.top);
        }

        for (var i = 1; i < this._marginMap.bottom.length; i ++) {
            bottom.push(this.getInnerHeight() + this._margin.top + d3.sum(this._marginMap.bottom.slice(0, i)));
        }

        this._xAxisContainer
            .attr('transform', function(d, i) {
                return 'translate(' + self._getXAxisOffset(i, top, bottom) + ')'
            }).each(function(measureConfig, i) {
                /*
                 * Раскрашиваем значения на шкале.
                 */
                d3.select(this)
                    .selectAll('text')
                    .style('fill', measureConfig.markerColor || '#000');
                /*
                 * Перемещаем подписи к осям в нужное место.
                 */
                if (measureConfig.measureName in self._labelsMap) {

                    var height = this.getBoundingClientRect().height;
                    var y = self._getXAxisOffset(i, top, bottom)[1];

                    if (i % 2 == 1) {
                        y -= height + 3;
                    } else {
                        y += height + 10;
                    }

                    d3.select(self._labelsMap[measureConfig.measureName])
                        .attr('x', self.getInnerWidth() / 2)
                        .attr('y', y)
                        .style('fill', measureConfig.markerColor);
                }
            });

        this._yAxis = d3.axisLeft(this.getSeriesScale());
        this._yAxisContainer
            .attr('transform', 'translate(' + this._getYAxisOffset() + ')')
            .call(this._yAxis.tickFormat(function(value, i) {
                return Formatter.format(value, this.getSeries(0));
            }.bind(this)));

        new YTicks(this._yAxis, this._yAxisContainer, this, this.getConfig().get('series.0'))
            .rarefy();

        this._xAxisContainer.each(function(measureConfig, i) {
            var axis = self._getD3Axis(i, measureScales[measureConfig.measureName]);
            new XTicks(axis, d3.select(this), self, measureConfig)
                .rarefy();
        });

        this._viewsContainer
            .attr('transform', 'translate(0, ' + this._margin.top + ')')

        this._views.forEach(function(view) {
            view.resize();
        });

        this._canvas
            .attr('transform', 'translate(' + this._margin.left + ', 0)');

        this._legend.resize();
    }


    _getXAxisOffset(i, top, bottom) {

        if (i % 2 == 1) {
            return [0, top[Math.floor(i / 2)]];
        } else {
            return [0, bottom[Math.floor(i / 2)]];
        }
    }


    _getYAxisOffset() {

        if (this._isAligned()) {
            return [this._getMeasureScale()(0), this._margin.top];
        } else {
            return [0, this._margin.top];
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

        var height = axisContainer.getBoundingClientRect().height;

        if (measureConfig.measureName in this._labelsMap) {
            height += this._labelsMap[measureConfig.measureName].getBoundingClientRect().height;
        }

        if (index % 2 == 0) {
            this._marginMap.bottom.push(height);
            this._margin.bottom += height;
            return [0, this.getInnerHeight() + this._margin.top];
        } else {
            this._marginMap.top.push(height);
            this._margin.top += height;
            return [0, this._margin.top];
        }
    }


    /**
     * @private
     * @param {Integer} index
     * @param {d3.scale} scale
     * @returns {d3.axis}
     */
    _getD3Axis(index, scale) {

        if (index % 2 == 0) {
            return d3.axisBottom(scale);
        } else {
            return d3.axisTop(scale);
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
                .range([0, this.getInnerWidth()]);
        }, this);

        return axes;
    }


    /**
     * @public
     * @returns {Mixed[]}
     */
    getSeriesRange() {

        return [this.getInnerHeight(), 0];
    }
}


module.exports.U2DHorizontalChart = U2DHorizontalChart;