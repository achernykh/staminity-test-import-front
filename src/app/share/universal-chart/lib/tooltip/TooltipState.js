import {TooltipCombinedState} from './TooltipCombinedState.js';
import {TooltipSingleState} from './TooltipSingleState.js';
import {Util} from '../Util.js';
import * as d3 from 'd3';


class TooltipState {


    constructor(tooltip) {

        this._tooltip = tooltip;
        this._uChart = tooltip._uChart;
        this._orientation = tooltip._uChart.getOrientation();
    }


    static getInstance(tooltip) {

        if (tooltip._uChart._config.get('options.tooltip.combined', false)) {
            return new TooltipCombinedState(tooltip);
        } else {
            return new TooltipSingleState(tooltip);
        }
    }


    getContent(node, data, index, nodeList) {

        throw new Error('Method getContent() not implemented in ' + this.constructor.name);
    }


    /**
     * Get color.
     * @private
     * @param {Object} config
     * @param {Object} defaults
     * @returns {String}
     */
    _getColor(config, defaults) {

        if ('color' in config && config.color) {
            return config.color;
        } else {
            return defaults.color;
        }
    }


    /**
     * Get tooltip label value.
     * @param {Object} config
     * @param {Object} [defaults]
     * @param {Element} [node]
     * @returns {String}
     */
    _getKey(config, defaults, node) {

        var key;

        if (config.tooltipType == 'label') {
            key = Util.toString(config.tooltipLabel);
            if (key) {
                key += ':';
            }
        } else if (config.tooltipType == 'icon') {
            key = '<img class="' + config.measureName + '" src="img/icons/' + config.measureName + '.svg" height="20px" width="20px" />';
        } else {
            key = '<div class="color-label" style="background-color: ' + this._getColor(config, defaults, node) + ';"></div>'
        }

        return key;
    }
}


module.exports.TooltipState = TooltipState;