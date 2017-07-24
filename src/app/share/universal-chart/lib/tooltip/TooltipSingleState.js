import {TooltipState} from './TooltipState.js';
import {Formatter} from '../Formatter.js';
import * as d3 from 'd3';


/**
 * @private
 * @class
 */
class TooltipSingleState extends TooltipState {
    /**
     * @public
     * @param {Element} node
     * @param {Object} data
     * @param {Integer} i
     * @param {View} view
     */
    getContent(node, data, i, view) {

        var config = this._uChart.getTooltipData()
            .filter(d => d.source == 'series');

        config.push(view);

        var html = '';

        config.forEach(function(config, i) {
            if (config.source == 'series') {
                html += '<tr>' +
                    '<td>' + this._getKey(config) + '</td>' +
                    '<td>' + Formatter.format(data['x' + i], config) + '</td>' +
                '</tr>';
            } else {
                config = config.getConfig().getOptions();
                html += '<tr>' +
                    '<td>' + this._getKey(config, {}, node) + '</td>' +
                    '<td>' + (Formatter.format(data.y, config) + ' ' + config.unit) + '</td>' +
                '</tr>';
            }
        }, this);

        return html;
    }


    /**
     * Get color.
     * @private
     * @param {Object} config
     * @param {Object} defaults
     * @param {Element} node
     * @returns {String}
     */
    _getColor(config, defaults, node) {

        if (config.fillType == 'gradient') {
            return config.markerColor;
        } else {
            return d3.select(node).style('fill');
        }
    }
}


module.exports.TooltipSingleState = TooltipSingleState;