import {TooltipState} from './TooltipState.js';
import {Formatter} from '../Formatter.js';
import {Util} from '../Util.js';
import * as d3 from 'd3';


/**
 * @private
 * @class
 */
class TooltipCombinedState extends TooltipState {
    /**
     * @public
     * @param {Mixed} xValue0
     */
    getContent(xValue0) {

        var config = this._uChart.getTooltipData();
        config[0].value = xValue0;

        var html = '';
        var isEmpty = [];

        config.forEach(function(config) {
              if (config.source == 'series') {
                  html += '<tr>' +
                      '<td>' + this._getKey(config) + '</td>' +
                      '<td>' + Formatter.format(config.value, config) + '</td>' +
                  '</tr>';
              } else {
                  config.getDataAt(xValue0).forEach(function(d) {
                      config = config.getConfig().getOptions();

                      var isNull = d.y === null;
                      isEmpty.push(isNull);

                      if (! isNull) {
                          html += '<tr>' +
                              '<td>' + this._getKey(config, d) + '</td>' +
                              '<td>' + (Formatter.format(d.y, config) + ' ' + Util.toString(config.unit)) + '</td>' +
                          '</tr>';
                      }
                  }, this)
              }
        }, this);

        return isEmpty.filter(d => d === false).length == 0 ? false : html;
    }
}


module.exports.TooltipCombinedState = TooltipCombinedState;