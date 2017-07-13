/**
 * @public
 * @abstract
 * @class
 */
class USvgChart extends UChart {
    /**
     * @public
     * @constructor
     * @param {Object} options
     */
    constructor(options) {

        super(options);

        this._orientation = Orientation.getInstance(options, this);
        this._tooltip = new Tooltip(this);
        this._legend = Legend.getInstance(this._config.get('options.legend', {}), this);
        this._margin = {
            left: 45,
            top: 20,
            right: 45,
            bottom: 35
        };
    }


    /**
     * @public
     * @returns {d3.selection}
     */
    getCanvas() {

        return this._canvas;
    }


    /**
     * @public
     * @returns {Orientation}
     */
    getOrientation() {

        return this._orientation;
    }


    /**
     * Remove chart.
     * @public
     */
    remove() {

        super.remove();
        this._tooltip.remove();
    }


    /**
     * @public
     * @returns {Tooltip}
     */
    getTooltip() {

        return this._tooltip;
    }


    /**
     * @public
     * @returns {Object}
     */
    _getMargin() {

        return this._legend.getMargin();
    }


    /**
     * Get tooltip config.
     * @returns {Object[]}
     */
    getTooltipData() {

        var config = [];

        this.getSeries().forEach(function(series, i) {
            if (series.tooltipType != undefined && series.tooltipType != 'none') {
                var data = _.extend({}, series);
                data.source = 'series';
                config.push(data);
            }
        });

        this.getViews()
            .forEach(function(view, i) {
                var tooltipType = view.getConfig().get('tooltipType');
                if (tooltipType != undefined && tooltipType != 'none') {
                    config.push(view);
                }
            });

        return config;
    }


    /**
     * @public
     * @param {String|HTMLElement} selector
     * @returns {UChart}
     */
    renderTo(selector) {

        super.renderTo(selector);

        var dimension = this.getDimension();

        this._svg = this._container.append('svg')
            .attr('class', 'universal-chart')
            .attr('height', dimension.height || 400);

        this._defs = this._svg.append('defs');

        this._canvas = this._svg.append('g')
            .attr('class', 'canvas');

        this._viewsContainer = this._canvas.append('g')
            .attr('class', 'views');

        this._renderGradients();

        return this;
    }


    getSvg() {

        return this._svg;
    }


    getViewsContainer() {

        return this._viewsContainer;
    }


    getDefs() {

        return this._defs;
    }


    /**
     * Render gradients.
     */
    _renderGradients() {

        var gradientSet = [];
        var direction = this._orientation.getGradientDirection();

        var views = this.getViews()
            .filter(v => v.getConfig().is('fillType', 'gradient'));

        views = views.concat(this.getScopes()
            .filter(s => s.isReplicated())
            .map(s => s.getViews()[0])
            .filter(v => v.getConfig().is('fillType', 'gradient'))
            .reduce(function(views, view) {
                return views.concat(view.getReplics())
            }, []));

        this._defs.selectAll('linearGradient')
            .data(views)
            .enter()
            .append('linearGradient')
            .attr('id', function(view, i) {
                return view.getGradientId(i);
            }.bind(this))
            .attr('x1', direction[0][0])
            .attr('y1', direction[0][1])
            .attr('x2', direction[1][0])
            .attr('y2', direction[1][1])
            .selectAll('stop')
            .data(function(view, i) {
                return view.getConfig().get('gradient').map(function(gradient) {
                    gradient =  _.extend({}, gradient);
                    gradient.color = d3.color(gradient.color);
                    gradient.color.opacity = Color.getOpacity(0, view.getGroups().length, gradient.color.opacity)
                    return gradient;
                }.bind(this));
            }.bind(this))
            .enter()
            .append('stop')
            .attr('offset', (d) => d.offset)
            .attr('stop-color', function(d) {
                var color = d3.color(d.color);
                color.opacity = 1;
                return color;
            }).attr('stop-opacity', function(d, i) {
                return d3.color(d.color).opacity;
            });
    }


    /**
     * @public
     */
    resize() {

        var dimension = this.getDimension();
        var margin = this.getMargin();

        this._svg
            .attr('width', dimension.width)
            .attr('height', dimension.height || 400);

        this._canvas
            .attr('transform', 'translate(0, ' + margin.top + ')');
    }
}
