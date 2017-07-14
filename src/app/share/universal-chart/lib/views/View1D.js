import {SvgView} from './SvgView.js';
import {UChart} from '../UChart.js';
import {Scope} from '../Scope.js';
import * as d3 from 'd3';


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