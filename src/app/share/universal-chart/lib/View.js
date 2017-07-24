import {Util} from './Util.js';
import {ViewFactory} from './views/ViewFactory.js';
import {Config} from './Config.js';


/**
 * View main class.
 */
class View {
    /**
     * @public
     * @constructor
     * @param {Object} config
     * @param {UChart} uChart
     * @param {Scope} scope
     */
    constructor(config, uChart, scope) {

        this._config = config;
        this._scope = scope;
        this._uChart = uChart;
        this._id = Util.getUniqueId();
        this._replicsCounter = 0;
        this._replicaNumber = 0;
    }


    static getStrokeColor(config) {

        if (Util.hasStroke(config)) {
            return config.lineColor || '#000';
        } else {
            return null;
        }
    }


    static getStrokeWidth(config) {

        if (Util.hasStroke(config)) {
            return Util.isEmpty(config.lineWidth) ? 1 : config.lineWidth;
        } else {
            return null;
        }
    }


    static getStrokeDashArray(config) {

        if (Util.hasStroke(config)) {
            return Util.getStrokeDashArray(config.lineStyle);
        } else {
            return null;
        }
    }


    /**
     * Replicate chart.
     * @public
     * @param {Object} config - measure config.
     * @returns {View}
     */
    getReplics(config) {

        var replics = [];

        this.getScope().getConfig()
            .get('measures')
            .forEach(function(measureConfig) {
                var replica = ViewFactory.getInstance(measureConfig, this._uChart)
                    ._setId(this._id)
                    ._setReplicaNumber(this._replicsCounter);
                this._replicsCounter ++;

                replics.push(replica)
            }, this);

        this._replicsCounter = 0;

        return replics;
    }


    /**
     * Set view id.
     * @private
     * @returns {View}
     */
    _setId(id) {

        this._id = id;
        return this;
    }


    /**
     * @private
     * @param {Integer} number - replica number.
     * @returns {View}
     */
    _setReplicaNumber(number) {

        this._replicaNumber = number;
        return this;
    }


    /**
     * @public
     * @returns {Tooltip}
     */
    getTooltip() {

        return this._uChart.getTooltip();
    }


    /**
     * Get scope.
     * @public
     * @returns {Scope}
     */
    getScope() {

        return this._scope;
    }


    /**
     * @public
     * @returns {Number}
     */
    getWidth() {

        return this._uChart.getInnerWidth();
    }


    /**
     * @public
     * @returns {Number}
     */
    getHeight() {

        return this._uChart.getInnerHeight();
    }


    /**
     * @public
     * @abstract
     */
    resize() {

        throw new Error('Method resize() not implemented for ' + this.constructor.name);
    }


    /**
     * @public
     * @abstract
     * @returns {Object[]}
     */
    getData() {

        throw new Error('Method getData() not implemented for ' + this.constructor.name);
    }


    /**
     * @public
     * @abstract
     * @param {Mixed} xValue0
     * @returns {Object[]}
     */
    getDataAt(xValue0) {

        throw new Error('Method getDataAt() not implemented for ' + this.constructor.name);
    }


    /**
     * @public
     * @abstract
     * @returns {View}
     */
    render() {

        throw new Error('Method render() not implemented for ' + this.constructor.name);
    }


    /**
     * @public
     * @returns {Object}
     */
    getConfig() {

        return new Config(this._config);
    }
}


module.exports.View = View;