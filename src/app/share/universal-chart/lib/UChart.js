import {Config} from './Config.js';
import {Util} from './Util.js';
import * as d3 from 'd3';

/**
 * @public
 * @abstract
 * @class
 * Главный класс библиотеки и единственная точка для взаимодействия с её функционалом.
 */
class UChart {
    /**
     * @public
     * @constructor
     * @param {Object[]} options
     */
    constructor(options) {

        this._input = options;
        this._config = new Config(options[0]);

        this._id = Util.getUniqueId();
        this._views = [];

        d3.select(window).on('resize.' + this._id, function() {
            this.resize();
        }.bind(this))
    }


    /**
     * @public
     * @static
     * @param {Object} options
     * @returns {UChart}
     */
    static getInstance(options) {

        if (options == undefined) {
            return new UChart([]);
        } else if (! Array.isArray(options)) {
            options = [options];
        }

        if (options[0].measures[0].chartType == 'table') {
            return new UHtmlChart(options);
        } else if (['pie', 'donut'].indexOf(options[0].measures[0].chartType) >= 0) {
            return new U1DChart(options);
        } else if (Orientation.isVertical(options)) {
            return new U2DVerticalChart(options);
        } else {
            return new U2DHorizontalChart(options);
        }
    }


    /**
     * @public
     * @returns {View[]}
     */
    getViews() {

        return this._views;
    }


    /**
     * Remove chart.
     * @public
     */
    remove() {

        if (this._container) {
            this._container.selectAll('*').remove();
        }
    }


    /**
     * @public
     * @returns {Config}
     */
    getConfig() {

        return this._config;
    }


    /**
     * @public
     * @returns {Object}
     */
    getOriginalConfig() {

        return this._originalConfig;
    }


    getContainer() {

        return this._container;
    }


    /**
     * @public
     * @returns {Object}
     */
    getMargin() {

        return this._margin;
    }


    /**
     * Получить размеры контейнера.
     * @public
     * @returns {Object}
     */
    getDimension() {

        return this._container.node().getBoundingClientRect();
    }


    getOuterWidth() {

        return this.getDimension().width;
    }


    getInnerWidth() {

        return this.getOuterWidth() - this._margin.left - this._margin.right;
    }


    getOuterHeight() {

        return this.getDimension().height;
    }


    getInnerHeight() {

        return this.getOuterHeight() - this._margin.top - this._margin.bottom;
    }


    getData() {

        return this.getConfig().get('metrics');
    }


    getIdx(index) {

        return this.getSeries(index).idx;
    }


    /**
     * @public
     * @param {Integer} [index]
     * @returns {Object[]|Obect}
     */
    getSeries(index) {

        if (Number.isInteger(index)) {
            return this.getConfig().get('series')[index];
        } else {
            return this.getConfig().get('series');
        }
    }


    /**
     * @public
     * @returns {Mixed[]}
     */
    getSeriesRange() {

        return [0, 1];
    }


    /**
     * @public
     * @returns {Mixed[]}
     */
    getSeriesDomain() {

        return _.uniq(this._views.reduce(function(domain, view) {
            return domain.concat(view.getX());
        }, []));
    }


    /**
     * @public
     * @returns {d3.scale}
     */
    getSeriesScale() {

      return d3.scaleBand()
          .domain(this.getSeriesDomain())
          .range(this.getSeriesRange())
          .padding(0.1);
    }


    getScopes() {

        return this.getViews().reduce(function(scopes, view) {
            var scope = view.getScope();

            if (scopes.indexOf(scope) < 0) {
                scopes.push(scope);
            }

            return scopes;
        }, []);
    }


    /**
     * @public
     * @returns {Object[]}
     */
    getMeasures() {

        return this.getScopes().reduce(function(measures, scope) {
            var scopeMeasures = scope.getMeasures();

            scopeMeasures.forEach(function(measure) {
                if (measures.indexOf(measure) < 0) {
                    measures.push(measure)
                }
            })

            return measures;
        }, []);
    }


    /**
     * @public
     * @returns {Mixed[][]}
     */
    getMetrics() {

        return this.getConfig().get('metrics');
    }


    /**
     * @public
     * @param {Integer} index
     * @returns {Mixed[]}
     */
    getMetric(index) {

        return this.getMetrics().map(function(d) {
            return d[index];
        });
    }


    /**
     * @public
     * @param {String|HTMLElement} selector
     * @returns {UChart}
     */
    renderTo(selector) {

        this._container = d3.select(selector);

        var extensionMap = {};

        this._input.forEach(function(scopeConfig, i) {
            scopeConfig.measures.forEach(function(measureConfig, j) {
                if (Util.isEmpty(measureConfig.id)) {

                } else if (measureConfig.id in extensionMap) {
                    extensionMap[measureConfig.id].push({
                        scope: scopeConfig,
                        measure: measureConfig
                    });
                    delete this._input[i].measures[j];
                } else {
                    extensionMap[measureConfig.id] = [];
                }
            }, this);

            scopeConfig.measures = scopeConfig.measures.filter(function(measureConfig) {
                return measureConfig;
            })
        }, this);

        var barChartsCounter = 0;

        this._input.forEach(function(scopeConfig, i) {
            var scope = new Scope(this, scopeConfig);
            scopeConfig.measures.forEach(function(measureConfig, j) {

                var view;

                if (measureConfig.id in extensionMap) {
                    var extendedScope = scope.replicate(extensionMap[measureConfig.id], measureConfig);
                    view = View.getInstance(measureConfig, this, extendedScope);
                    extendedScope.setView(view);
                } else {
                    view = View.getInstance(measureConfig, this, scope);
                    scope.setView(view);
                }

                if (view instanceof BarView) {
                    view.setSequenceNumber(barChartsCounter ++);
                }

                this._views.push(view);

            }, this);
        }, this);

        return this;
    }


    /**
     * @public
     */
    resize() {

    }
}

module.exports.UChart = UChart;
