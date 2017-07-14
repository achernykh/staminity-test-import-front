import {UChart} from '../UChart.js';
import {TableView} from '../views/TableView.js';
import * as d3 from 'd3';


/**
 * @public
 * @abstract
 * @class
 */
class UHtmlChart extends UChart {
    /**
     * @public
     * @param {String|HTMLElement} selector
     * @returns {UChart}
     */
    renderTo(selector) {

        super.renderTo(selector);

        var measureConfig = this.getConfig().get('measures.0');
        var view = TableView.getInstance(measureConfig, this)
            .render();

        this._views.push(view);

        return this;
    }
}


module.exports.UHtmlChart = UHtmlChart;