import {SvgView} from './SvgView.js';


/**
 * @public
 * @class
 */
class View1D extends SvgView {
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
}


module.exports.View1D = View1D;