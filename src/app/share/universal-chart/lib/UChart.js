import {Config} from './Config.js';
import {Util} from './Util.js';
import {Scope} from './Scope.js';
import {ViewFactory} from './views/ViewFactory.js';
import {BarView} from './views/BarView.js';
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

        this._margin = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        };

        this._icons = [];
        this._preloadIcons();

        d3.select(window).on('resize.' + this._id, function() {
            this.resize();
        }.bind(this))
    }


    /**
     * Подгружаем все иконки которые могут быть использованы в графике.
     * @private
     */
    _preloadIcons() {

        this._input.forEach(function(scopeConfig) {
            scopeConfig.series.forEach(function(series) {
                var image = new Image();
                image.src = Util.getIconPathName(series.measureName, this);
                this._icons.push(image);
            }, this);
            scopeConfig.measures.forEach(function(measure) {
                var image = new Image();
                image.src = Util.getIconPathName(measure.measureName, this);
                this._icons.push(image);
            }, this);
        }, this);
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
                    view = ViewFactory.getInstance(measureConfig, this, extendedScope);
                    extendedScope.setView(view);
                } else {
                    view = ViewFactory.getInstance(measureConfig, this, scope);
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