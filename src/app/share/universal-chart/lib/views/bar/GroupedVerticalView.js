import {GroupedView} from './GroupedView.js';
import * as d3 from 'd3';


/**
 * @public
 * @class
 */
class GroupedVerticalView extends GroupedView {
    /**
     * @public
     * @override
     */
    render() {

        super.render();

        this._groups = this.getViewsContainer()
            .append('g')
            .attr('class', 'view bar-view')
            .selectAll('g.group')
            .data(this.getData())
            .enter()
            .append('g')
            .attr('class', 'group');

        this._bars = this._groups
            .selectAll('rect.bar')
            .data(function(d) {
                return d;
            }).enter()
            .append('rect')
            .attr('class', 'bar');

        this._customize(this._bars);

        return this;
    }


    /**
     * @public
     * @override
     */
    resize() {

      var xScale = this.getSeriesScale();
      var yScale = this.getMeasureScale();
      var gScale = this._getGroupScale();

      var diff = xScale.step() - xScale.bandwidth();

      this._groups
          .attr('transform', function(d, i) {
              return 'translate(' + (xScale(d[0].x0) - diff / 2) + ', 0)';
          });

      this._bars
          .attr('width', function(d) {
              return gScale.bandwidth();
          }).attr('height', function(d) {
              return this._uChart.getInnerHeight() - yScale(d.y);
          }.bind(this))
          .attr('x', function(d) {
              return gScale(d.x1);
          }).attr('y', function(d) {
              return yScale(d.y);
          });
    }
}


module.exports.GroupedVerticalView = GroupedVerticalView;