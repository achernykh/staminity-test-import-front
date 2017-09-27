import {BarView} from '../BarView.js';
import {Color} from '../../Color.js';
import * as d3 from 'd3';


/**
 * @abstract
 * @class
 */
class StackedView extends BarView {
    /**
     * Get bar width.
     * @public
     * @returns {Number}
     */
    getBarWidth() {

        return Math.min(this.getSeriesScale().bandwidth(), 100);
    }


    /**
     * Get measure domain.
     * Из-за того что в стековой структуре столбцы рисуются один над другим
     * формула вычислений домена (допустимых значений) должна быть пересчитана
     * (в отличае от стандартного способа).
     * @public
     * @returns {Mixed[]}
     */
    _getMeasureDomain() {

        var index = this._uChart.getSeries(0).idx;

        var max = _(this._uChart.getMetrics()).groupBy(function(d) {
            return d[index];
        }).map(function(group) {
            return group.reduce(function(sum, d) {
                return sum + d[2];
            }, 0);
        }).max();

        return [0, max];
    }


    /**
     * @public
     * @override
     * @returns {d3.scale}
     */
    getMeasureScale() {

        return super.getMeasureScale()
            .domain(this._getMeasureDomain());
    }


    /**
     * @public
     * @param {Mixed} xValue0
     * @returns {Object[]}
     */
    getDataAt(xValue0) {

          return this.getData()
              .map(function(set) {
                  return set.find(function(d) {
                      return d.x0 == xValue0;
                  })
              });
    }


    /**
     * Get bar offset.
     * @protected
     * @returns {Number}
     */
    _getBarOffset() {

        var bandWidth = this.getBarWidth();
        return (this.getSeriesScale().bandwidth() - bandWidth) / 2;
    }


    /**
     * @public
     * @override
     * @returns {Object[]}
     */
    getData() {

        var index = this._uChart.getSeries(0).idx;
        var data = _(this._uChart.getMetrics()).groupBy(function(d) {
            return d[index];
        }).map(function(group) {
            var item = {};

            item['x'] = group[0][0];
            group.forEach(function(d) {
                item[d[1]] = d[2];
            });

            return item;
        }).value();

        var x0Domain = this._uChart.getSeriesScale().domain();
        var x1Domain = this.getGroups();

        var stack = d3.stack()
            .keys(x1Domain)
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);

        var self = this;
        return stack(data).map(function(series, i, set) {
            return series.map(function(d, j) {
                return {
                    x0: x0Domain[j],
                    x1: x1Domain[i],
                    y: d[1] - d[0],
                    y0: d[0],
                    y1: d[1],
                    color: Color.getColor(i, set.length, self._config, self._uChart),
                    config: this._config,
                    configIndex: 0
                }
            }, this);
        }, this);
    }


    /**
     * @public
     * @override
     */
    renderMeanLine() {

        return this;
    }
}


module.exports.StackedView = StackedView;