import {TooltipState} from './TooltipState.js';
import {Formatter} from '../Formatter.js';
import {Util} from '../Util.js';


/**
 * @private
 * @class
 */
class TooltipCombinedState extends TooltipState {
    /**
     * @public
     * @constructor
     * @param {Tooltip} tooltip
     */
    constructor(tooltip) {

        super(tooltip);
        this._currentXValue = undefined;
    }


    /**
     * @public
     * @param {Mixed} xValue0
     * @returns {null|false|String}
     */
    getContent(xValue0) {

        if (xValue0 === this._currentXValue) {
            return null;
        } else {
            this._currentXValue = xValue0;
        }
        console.log('getContent(' + xValue0 + ')');

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
                      var data = config.getConfig().getOptions();

                      var isNull = d.y === null;
                      isEmpty.push(isNull);

                      if (! isNull) {
                          html += '<tr>' +
                              '<td>' + this._getKey(data, d) + '</td>' +
                              '<td>' + (Formatter.format(d.y, data) + ' ' + Util.toString(data.unit)) + '</td>' +
                          '</tr>';
                      }
                  }, this)
              }
        }, this);

        return isEmpty.filter(d => d === false).length == 0 ? false : html;
    }
}


module.exports.TooltipCombinedState = TooltipCombinedState;