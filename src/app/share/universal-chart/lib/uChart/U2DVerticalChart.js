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

        this._topMargin = 10;
        this._bottomMargin = 20;
        this._rightMargin = 5;
        this._margin = {
            left: 0,
            top: this._topMargin,
            right: this._rightMargin,
            bottom: this._bottomMargin
        };

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

        this._yAxisContainer = this._canvas.selectAll('g.y-axis')
            .data(this.getMeasureAxesData())
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

        this._margin.left = margin.left;
        this._margin.top = this._topMargin + margin.top;
        this._margin.right = this._rightMargin + margin.right;
        this._margin.bottom = this._bottomMargin + margin.bottom;

        this._marginMap.left = [];
        this._marginMap.right = [];

        var self = this;
        var axes = this.getMeasureScales();

        this._yAxisContainer
            .each(function(config, i) {

                var axis = self._getD3Axis(i, axes[config.measureName]);

                d3.select(this).call(axis.tickFormat(function(value, i) {
                    return Formatter.format(value, config);
                }));
            }).attr('transform', function(d, i) {
                return 'translate(' + self._getMeasureAxisOffset(i, this) + ')';
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
                if (i % 2 == 1) {
                    return 'translate(' + right[Math.floor(i / 2)] + ', 0)';
                } else {
                    return 'translate(' + left[Math.floor(i / 2)] + ', 0)';
                }
            }.bind(this))
            .each(function(config) {
                d3.select(this)
                    .selectAll('text')
                    .style('fill', config.markerColor);
            });

        this._xAxis = d3.axisBottom(this.getSeriesScale());
        this._xAxisContainer
            .attr('transform', 'translate(' + this._getXAxisOffset() + ')')
            .call(this._xAxis.tickFormat(function(value, i) {
                return Formatter.format(value, self.getSeries(0));
            }));

        this._canvas
            .attr('transform', 'translate(0, ' + this._margin.top + ')');

        new XTicks(this._xAxis, this._xAxisContainer, this)
            .rarefy();

        this._viewsContainer
            .attr('transform', 'translate(' + this._margin.left + ', 0)')

        this._views.forEach(function(view) {
            view.resize();
        });

        this._legend.resize();
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
     * @param {HTMLElement} axisContainer
     * @returns {Number[]}
     */
    _getMeasureAxisOffset(index, axisContainer) {

        const width = axisContainer.getBoundingClientRect().width;

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
                .range([this.getInnerHeight(), 0]);
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

        return [0, this.getInnerWidth()];
    }
}
