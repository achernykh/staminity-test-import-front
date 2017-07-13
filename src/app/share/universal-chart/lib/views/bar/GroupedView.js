/**
 * @abstract
 * @class
 */
class GroupedView extends BarView {
    /**
     * @protected
     * @returns {d3.scale}
     */
    _getGroupScale() {

        return d3.scaleBand()
            .domain(this.getGroups())
            .range([0, this.getSeriesScale().step()])
            .paddingOuter(1)
            .paddingInner(0.1)
    }


    /**
     * @public
     * @param {Mixed} xValue0
     * @returns {Object[]}
     */
    getDataAt(xValue0) {

          var index = this._uChart.getIdx(0);
          return _.groupBy(this._uChart.getData(), function(d) {
              return d[index];
          }.bind(this))[xValue0]
          .map(function(d, i) {
              return {
                  x0: d[0],
                  x1: d[1],
                  y: d[2],
                  color: Color.getColor(i, this.getGroups().length, this._config, this._uChart)
              };
          }, this);
    }


    /**
     * @public
     * @override
     * @returns {Object[]}
     */
    getData() {

        var self = this;
        var index = this._uChart.getSeries(0).idx;

        return _(this._uChart.getMetrics()).groupBy(function(d) {
            return d[index];
        }).map(function(group) {
            return group.map(function(d, i, set) {
                return {
                    x0: d[0],
                    x1: d[1],
                    y: d[2],
                    color: Color.getColor(i, set.length, self._config, self._uChart),
                    config: self._config,
                    configIndex: 0
                };
            })
        }).value();
    }


    /**
     * @public
     * @override
     */
    renderMeanLine() {

        return this;
    }
}
