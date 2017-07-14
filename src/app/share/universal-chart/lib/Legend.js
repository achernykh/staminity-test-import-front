import {View} from './View.js';
import {UChart} from './UChart.js';
import {ColumnLegend} from './legend/ColumnLegend.js';
import {RowLegend} from './legend/RowLegend.js';
import {Color} from './Color.js';
import * as d3 from 'd3';


/**
 * @public
 * @class
 */
class Legend extends View {
    /**
     * @private
     * @constructor
     * @param {Object} config
     * @param {UChart} uChart
     */
    constructor(config, uChart) {

        super(config, uChart);

        this._size = 15;
        this._gap = 2;
        this._margin = 5;
    }


    /**
     * @public
     * @static
     * @param {Object} config={}
     * @param {UChart} uChart
     * @returns {Legend}
     */
    static getInstance(config = {}, uChart) {

        if (uChart.getConfig().get('options.legend.type', 'column') == 'column') {
            return new ColumnLegend(config, uChart);
        } else {
            return new RowLegend(config, uChart);
        }
    }


    /**
     * @public
     * @returns {Number}
     */
    getWidth() {

        return this._container.node().getBoundingClientRect().width;
    }


    /**
     * @public
     * @returns {Number}
     */
    getHeight() {

        return this._container.node().getBoundingClientRect().height;
    }


    getMargin() {

        return this._margin;
    }


    /**
     * @public
     * @abstract
     * @returns {Object[]}
     */
    getData() {

        var config = this._uChart.getConfig().getOptions();
        var domain = this._uChart.getSeriesScale().domain();

        if (config.series[0].legend) {
            return _(config.metrics).map(function(d) {
                return d[config.series[0].idx];
            }.bind(this))
            .uniq()
            .map(function(d, i) {
                return {
                    value: d,
                    color: Color.getColor(i, domain.length, config.series[0], this._uChart)
                }
            }.bind(this))
            .value();
        } else if (config.series[1] && config.series[1].legend) {
            return _(config.metrics).map(function(d) {
                return d[config.series[1].idx];
            }.bind(this))
            .uniq()
            .map(function(d, i) {
                return {
                    value: d,
                    color: Color.getColor(i, domain.length, config.series[1], this._uChart)
                }
            }.bind(this))
            .value();
        } else {
            return this._uChart.getViews()
                .map(v => v.getConfig().getOptions())
                .filter(d => d.legend)
                .map(function(d) {
                    return {
                        value: d.label,
                        color: d.markerColor
                    };
                });
        }
    }


    /**
     * @public
     * @returns {View}
     */
    render() {

        var legendData = this.getData();

        this._container = this._uChart._svg.append('g')
            .attr('class', 'legend')
        this._legendBase = this._container.append('rect')
            .attr('class', 'legend-base')

        this._items = this._container.selectAll('g.legend-item')
            .data(legendData)
            .enter()
            .append('g')
            .attr('class', 'legend-item');

        this._rects = this._items.append('rect')
            .style('fill', function(d) {
                return d.color;
            });

        this._labels = this._items.append('text')
            .attr('class', 'legend-text')
            .text(function(d) {
                return d.value;
            });
    }


    resize() {

        this._rects
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', this._size)
            .attr('height', this._size)
            .attr('rx', this._size / 2);

        this._labels
            .attr('x', this._size + 5)
            .attr('y', function(d, i) {
                return 12;
            });

        this._container
            .attr('transform', 'translate(' + this._getTranslate() + ')');
    }
}


module.exports.Legend = Legend;