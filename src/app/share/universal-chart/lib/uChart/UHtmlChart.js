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
