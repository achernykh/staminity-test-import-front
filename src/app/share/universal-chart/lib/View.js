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
                var replica = View.getInstance(measureConfig, this._uChart)
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
     * @public
     * @static
     * @param {Object} object - measure config
     * @param {UChart} uChart
     * @param {Scope} scope
     * @returns {View}
     */
    static getInstance(config, uChart, scope) {

        switch (config.chartType) {
            case 'bar': return BarView.getInstance(config, uChart, scope);
            case 'line': return new LineView(config, uChart, scope);
            case 'area': return new AreaView(config, uChart, scope);
            case 'dot': return new DotView(config, uChart, scope);
            case 'pie': return new PieView(config, uChart, scope);
            case 'donut': return new DonutView(config, uChart, scope);
            case 'table': return new TableView(config, uChart, scope);
            default: throw new Error('Unexpected chart type [' + config.chartType + ']');
        }
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
