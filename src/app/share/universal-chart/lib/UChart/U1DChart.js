import {USvgChart} from './USvgChart.js';


/**
 * @public
 * @class
 */
class U1DChart extends USvgChart {
    /**
     * @public
     * @constructor
     * @param {Object} options
     * @param {Object} originalOptions
     */
    constructor(options, originalOptions) {

        super(options, originalOptions);

    }


    /**
     * @public
     * @override
     * @param {container} d3.selection
     */
    renderTo(container) {

        super.renderTo(container);

        this.getViews().forEach(function(view) {
            view.render();
        }, this);

        this._legend.render();
        this._mManager.set(this._legend)

        this._legend.resize();
        this._margin = this._getMargin();

        this.resize();

        return this;
    }


    /**
     * @public
     * @override
     */
    resize() {

        this._legend.resize();
        this._margin = this._getMargin();

        super.resize();

        this.getViews().forEach(function(view) {
            view.resize();
        });
    }
}


module.exports.U1DChart = U1DChart;