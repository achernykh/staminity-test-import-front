/**
 * @public
 * @class
 */
class SvgView extends View {
    /**
     * @public
     * @constructor
     * @param {Object} config
     * @param {UChart} uChart
     * @param {Scope} scope
     */
    constructor(config, uChart, scope) {

        super(config, uChart, scope);
    }


    getSvg() {

        return this._uChart.getSvg();
    }


    getDefs() {

        return this._uChart.getDefs();
    }


    getCanvas() {

        return this._uChart.getCanvas();
    }


    getViewsContainer() {

        return this._uChart.getViewsContainer();
    }


    /**
     * @public
     * @returns {Mixed[]}
     */
    getX() {

        return this._scope.getX(this);
    }


    /**
     * @public
     * @returns {Mixed[]}
     */
    getY() {

        return this._scope.getY(this);
    }
}
