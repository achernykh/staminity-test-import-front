import {Config} from './Config.js';
import {OrientationFactory} from './orientations/OrientationFactory.js';
import {Color} from './Color.js';
import * as d3 from 'd3';


/**
 * @public
 * @class
 */
class Scope {
    /**
     * @public
     * @constructor
     * @param {UChart} uChart
     * @param {Object} config
     */
    constructor(uChart, config) {

        this._uChart = uChart;
        this._config = new Config(config);
        this._orientation = OrientationFactory.getInstance(uChart.getConfig().getOptions(), uChart);
        this._views = [];
        this._isReplicated = false;
    }


    isReplicated() {

        return this._isReplicated;
    }


    replicate(replicaData, measureConfig) {

        var scopeConfig = JSON.parse(JSON.stringify(this._config.getOptions()));
        scopeConfig.measures = [measureConfig];

        scopeConfig.metrics.forEach(function(row) {
            row.measureIndex = 0;
        });

        replicaData.forEach(function(d, i) {
            scopeConfig.measures.push(d.measure);
            scopeConfig.metrics = scopeConfig.metrics.concat(d.scope.metrics.map(function(row) {
                row.measureIndex = i + 1;
                return row;
            }))
        })

        var scope = new Scope(this._uChart, scopeConfig);
        scope._isReplicated = true;

        return scope;
    }


    /**
     * Add view to scope.
     * @public
     * @param {View} view
     * @returns {Scope}
     */
    setView(view) {

        this._views.push(view);
        return this;
    }


    /**
     * @public
     * @param {Boolean} [fromConfig=false]
     * @returns {View[]}
     */
    getViews(fromConfig = false) {

        return this._views;
    }


    /**
     * Get config.
     * @public
     * @returns {Config}
     */
    getConfig() {

        return this._config;
    }


    /**
     * @public
     * @param {Integer} [index]
     * @returns {Object[]|Obect}
     */
    getExtent() {

        var extent = [];

        var id  = this._config.get('series.0.idx');

        _(this._config.get('metrics'))
            .groupBy(d => d.measureIndex)
            .forEach(function(group) {
                var first = group[0];
                var last = group[group.length - 1];
                extent.push([first[id], last[id]])
            });

        return extent;
    }


    getMeasures() {

        return this.getConfig().get('measures');
    }


    getMeasureConfig(view, i) {

        if (! this._isReplicated) {
            return view.getConfig().getOptions();
        }

        var metrics = this.getConfig().get('metrics');
        var measures = this.getConfig().get('measures');

        return measures[metrics[i].measureIndex];
    }


    getData(view) {

        var metrics = this.getConfig().get('metrics');
        var measures = this.getConfig().get('measures');

        return _.zip(this.getX(), this.getY(view))
            .map(function(d, i) {

                var color;
                if (this._isReplicated) {
                    color = Color.getColor(0, 1, measures[metrics[i].measureIndex], this);
                } else {
                    color = Color.getColor(0, 1, view.getConfig().getOptions(), this);
                }

                return {
                    x0: d[0],
                    x1: undefined,
                    y: d[1],
                    color: color,
                    measureIndex: metrics[i].measureIndex
                }
            }, this);
    }


    getX() {

        var id  = this._config.get('series.0.idx');
        return this._config.get('metrics').map(function(row) {
            return row[id];
        });
    }


    getY(view) {

        var id = view.getConfig().get('idx');
        var y = this._config.get('metrics').map(function(row) {
            return row[id];
        });

        if (view.getConfig().get('cumulative', false)) {
            y = y.map(function(value, index, set) {
                return set.slice(0, index + 1).reduce(function(sum, value) {
                    return sum + value;
                }, 0);
            })
        }

        return y;
    }
}


module.exports.Scope = Scope;