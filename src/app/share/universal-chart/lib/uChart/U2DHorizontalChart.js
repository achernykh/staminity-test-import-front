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

        this._marginTop = 5;
        this._marginRight = 5;
        this._margin = {
            left: 0,
            top: this._marginTop,
            right: this._marginRight,
            bottom: 0
        };

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
            .data(this.getViews().map(v => v.getConfig().getOptions()))
            .enter()
            .append('g')
            .attr('class', function(d, i) {
                if (i > 1) {
                    return 'axis measure-axis ' + d.measureName + '-measure-axis outer-axis';
                } else {
                    return 'axis measure-axis ' + d.measureName + '-measure-axis inner-axis';
                }
            });

        this._views.forEach(function(view) {
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

        this._margin.top = this._marginTop + margin.top;
        this._margin.bottom = margin.bottom;

        this._marginMap.top = [];
        this._marginMap.bottom = [];

        this._yAxis = d3.axisLeft(this.getSeriesScale());
        this._yAxisContainer
            .call(d3.axisLeft(this.getSeriesScale()))
            .call(this._yAxis.tickFormat(function(value, i) {
                return Formatter.format(value, this.getSeries(0));
            }.bind(this)));

        this._margin.right = this._marginRight + margin.right;
        var xAxisBox = this._yAxisContainer.node().getBoundingClientRect();
        if (! this._isAligned()) {
            this._margin.left = margin.left + xAxisBox.width;
        } else if (this._getMeasureScale()(0) < xAxisBox.width) {
            this._margin.left = margin.left + xAxisBox.width - this._getMeasureScale()(0);
        } else {
            this._margin.left = margin.left;
        }

        var self = this;
        var axes = this.getMeasureScales();

        this._xAxisContainer
            .each(function(config, i) {

                var axis = self._getD3Axis(i, axes[config.measureName]);

                d3.select(this).call(axis.tickFormat(function(value, i) {
                    return Formatter.format(value, config);
                }));
            }).attr('transform', function(d, i) {
                return 'translate(' + self._getMeasureAxisOffset(i, this) + ')';
            });

        var top = [this._margin.top];
        var bottom = [this.getInnerHeight() + this._margin.top];

        for (var i = 0; i < this._marginMap.top.length; i ++) {
            top.push(d3.sum(this._marginMap.top) - d3.sum(this._marginMap.top.slice(0, i)) + this._marginTop);
        }

        for (i = 1; i < this._marginMap.bottom.length; i ++) {
            bottom.push(this.getInnerHeight() + this._margin.top + d3.sum(this._marginMap.bottom.slice(0, i)));
        }

        this._xAxisContainer
            .attr('transform', function(d, i) {
                if (i % 2 == 1) {
                    return 'translate(0, ' + top[Math.floor(i / 2)] + ')';
                } else {
                    return 'translate(0, ' + bottom[Math.floor(i / 2)] + ')';
                }
            }).each(function(config) {
                d3.select(this)
                    .selectAll('text')
                    .style('fill', config.markerColor);
            });

        this._yAxis = d3.axisLeft(this.getSeriesScale());
        this._yAxisContainer
            .attr('transform', 'translate(' + this._getYAxisOffset() + ')')
            .call(this._yAxis.tickFormat(function(value, i) {
                return Formatter.format(value, this.getSeries(0));
            }.bind(this)));

        new YTicks(this._yAxis, this._yAxisContainer, this)
            .rarefy();

        this._viewsContainer
            .attr('transform', 'translate(0, ' + this._margin.top + ')')

        this._views.forEach(function(view) {
            view.resize();
        });

        this._canvas
            .attr('transform', 'translate(' + this._margin.left + ', 0)');

        this._legend.resize();
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
     * @param {HTMLElement} axisContainer
     * @returns {Number[]}
     */
    _getMeasureAxisOffset(index, axisContainer) {

        const height = axisContainer.getBoundingClientRect().height;

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
                domain[0] = Util.isEmpty(measure.minValue);
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


    _getMeasureDomain(measureName) {

        return _.uniq(this._getViewsByMeasureName(measureName).reduce(function(domain, view) {
            return domain.concat(view.getY())
        }, []));
    }


    /**
     * @public
     * @returns {Mixed[]}
     */
    getSeriesRange() {

        return [this.getInnerHeight(), 0];
    }
}
