import {View} from '../View.js';
import {Formatter} from '../Formatter.js';
import {Util} from '../Util.js';
import * as d3 from 'd3';


/**
 * @public
 * @class
 */
class TableView extends View {
    /**
     * @public
     * @override
     * @returns {View}
     */
    render() {

        var container = this._uChart.getContainer();
        var data = this.getData();

        var table = container.append('table')
            .attr('class', 'table table-bordered')
            .append('tbody')
            .selectAll('tr')
            .data(data)
            .enter()
            .append('tr')
            .attr('class', d => d.type)
            .selectAll('td')
            .data(function(d) {
                return d.row;
            }).enter()
            .append('td')
            .text(String);

        return this;
    }


    /**
     * @public
     * @abstract
     * @returns {Mixed[]}
     */
    getData() {

        var idxList = [];

        var series = this._uChart.getSeries();
        var measures = this._uChart.getViews()
            .map(v => v.getConfig().getOptions());

        var data = this._uChart.getData();

        var thead = [];

        series.forEach(function(series) {
            idxList.push(series);
            thead.push(series.label + (series.unit ? ', ' + series.unit : ' '));
        });

        measures.forEach(function(measure) {
            idxList.push(measure);
            thead.push(measure.label + (measure.unit ? ', ' + measure.unit : ' '));
        });

        var table = [];
        table.push({
            row: thead,
            type: 'thead'
        });

        var tableData = [];
        var tableBody = [];
        data.forEach(function(d) {
            var row = idxList.map(function(config) {
                return Formatter.format(d[config.idx], config);
            });

            tableData.push(row);
            tableBody.push({
                row: row,
                type: 'tbody'
            });
        });

        var hasSummary = measures.some(function(measure) {
            return ! (Util.isEmpty(measure.calculateTotals) || measure.calculateTotals == 'none');
        });

        if (hasSummary) {
            var xxx = _.groupBy(tableData, function(d) {
                return d[0];
            });

            for (var i = 1; i < series.length; i ++) {
                var k = 1;
                for (var j in xxx) {
                    var summary = this._getSummary(xxx[j], xxx[j][0].slice(0, i));
                    tableBody.splice(xxx[j].length * k + k - 1, 0, {
                        row: summary,
                        type: 'tfoot'
                    })
                    k ++;
                }

                xxx = _.groupBy(tableData, function(d) {
                    return d[i];
                });
            }
        }

        tableBody.forEach(function(d) {
            table.push(d);
        });

        if (hasSummary) {
            table.push({
                row: this._getSummary(data),
                type: 'tfoot'
            });
        }

        return table;
    }


    /**
     * @private
     * @param {Mixed[][]} data
     * @param {Mixed[]} [titles = []]
     * @returns {Mixed[]}
     */
    _getSummary(data, titles = []) {

        var summary = this._uChart.getSeries().map((d, i) => i in titles ? titles[i] : '');

        this._uChart.getViews()
            .map(v => v.getConfig().getOptions())
            .forEach(function(measure) {
                if (Util.isEmpty(measure.calculateTotals) || measure.calculateTotals == 'none') {
                    summary.push('');
                } else {
                    summary.push(Formatter.format(
                        Util.calculateTotals(data.map(d => d[measure.idx]), measure.calculateTotals),
                        measure
                    ));
                }
            });

        return summary;
    }
}


module.exports.TableView = TableView;