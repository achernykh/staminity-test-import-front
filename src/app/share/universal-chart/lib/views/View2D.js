import {SvgView} from './SvgView.js';
import {OrientationFactory} from '../orientations/OrientationFactory.js';
import {Util} from '../Util.js';
import * as d3 from 'd3';


/**
 *
 */
class View2D extends SvgView {
    /**
     * @public
     * @constructor
     * @param {Object} config
     * @param {UChart} uChart
     * @param {Scope} scope
     */
    constructor(config, uChart, scope) {

        super(config, uChart, scope);

        this._orientation = OrientationFactory.getInstance(config, uChart);
        this._meanLine = d3.select();
    }


    /**
     * @public
     * @override
     * @returns {Object[]}
     */
    getData() {

        return this._scope.getData(this);
    }


    /**
     * @public
     */
    renderMeanLine() {

        if (! this._config.avgValueLine) {
            return;
        }

        this._meanLine = this._container.append('line')
            .style('stroke', this._config.avgValueLineColor || '#000')
            .style('stroke-width', Util.isEmpty(this._config.avgValueLineWidth) ? 1 : this._config.avgValueLineWidth)
            .style('stroke-dasharray', Util.getStrokeDashArray(this._config.avgValueLineStyle));

        return this;
    }


    /**
     * @public
     * @returns {d3.scale}
     */
    getMeasureScale() {

        return this._uChart.getMeasureScale(this);
    }


    /**
     * @public
     * @abstract
     * @returns {d3.scale}
     */
    getSeriesScale() {

        return this._uChart.getSeriesScale();
    }


    /**
     * @protected
     * @param {Object} d
     * @param {Integer} [i = 0]
     * @param {Integer} [replicaNumber = 0]
     * @returns {String}
     */
    _getColor(d, i = 0, replicaNumber = 0) {

        var config = this._scope.getMeasureConfig(this, replicaNumber);

        if (config.fillType == 'gradient') {
            return window.hasOwnProperty('ionic') ?
                `url(#${this.getGradientId(i, replicaNumber)})` :
                `url(${window.location.protocol}//${window.location.host}${window.location.pathname}#${this.getGradientId(i, replicaNumber)})`;
        } else {
            return d.color;
        }
    }


    /**
     * @override
     */
    render() {

    }


    /**
     * @public
     * @param {Integer} i - gradient index
     * @param {Integer} [replicaNumber] - replica number
     * @returns {String}
     */
    getGradientId(i, replicaNumber) {

        if (replicaNumber == undefined) {
            replicaNumber = this._replicaNumber;
        }

        if (this.getGroups().length == 1) {
            return 'gradient:' + this._id + ':' + replicaNumber;
        } else {
            return 'gradient:' + this._id + ':' + i + ':' + replicaNumber;
        }
    }


    /**
     * @public
     * @override
     * @param {Mixed} xValue0
     * @returns {Object[]}
     */
    getDataAt(xValue0) {

        var value = _(this.getData())
            .flatten()
            .find(d => d.x0 == xValue0);

        if (value == undefined) {
            value = {
                x0: xValue0,
                x1: undefined,
                y: null,
            }
        }

        value.color = this._config.markerColor;

        return [value];
    }
}


module.exports.View2D = View2D;