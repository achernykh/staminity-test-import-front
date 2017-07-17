import {UChart} from '../UChart.js';
import {Scope} from '../Scope.js';
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

        var scope = new Scope(this, this._input[0]);

        var measureConfig = scope.getConfig().get('measures.0');
        var view = new TableView(measureConfig, this, scope)
            .render();

        scope.setView(view);

        this._views.push(view);

        return this;
    }
}


module.exports.UHtmlChart = UHtmlChart;