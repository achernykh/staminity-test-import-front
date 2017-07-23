import {View2D} from './View2D.js';
import {LineStateFactory} from './line/LineStateFactory.js';


/**
 *
 */
class DotView extends View2D {
    /**
     * @public
     * @param {Object} object - measure config
     * @param {UChart} uChart
     * @param {Scope} scope
     */
    constructor(config, uChart, scope) {

        super(config, uChart, scope);
        this._state = LineStateFactory.getInstance(this);
    }


    /**
     * @public
     * @override
     */
    render() {

        super.render();

        this._container = this.getViewsContainer().append('g')
            .attr('class', 'view dot-view');

        this._dots = this._container
            .selectAll('circle.dot')
            .data(this.getData())
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('r', function(d) {
                if (d.y == null) {
                    return 0;
                } else if (this._config.radius) {
                    return this._config.radius;
                } else {
                    return 5;
                }
            }.bind(this)).style('fill', function(d, i) {
                return this.getScope().getMeasureConfig(this, i).fillColor;
            }.bind(this));

        var self = this;
        var tooltip = this.getTooltip();

        if (! tooltip.isCombined()) {
          this._dots.on('mouseover', function(d, i, nodes) {
                  tooltip
                      .setOffset([0, 5])
                      .setContent(tooltip.getContent(this, d, i, nodes))
                      .setXY(self._getTooltipXY(this, d, i, nodes))
                      .show();
              }).on('mouseout', function() {
                  tooltip.hide();
              });
        }

        return this;
    }


    /**
     * @override
     */
    _getTooltipXY(node, data, index, nodeList) {

        var dimension = node.getBoundingClientRect();

        var x = dimension.left + dimension.width / 2;
        var y = dimension.top;

        return [x, y];
    }


    /**
     * @public
     * @override
     */
    resize() {

        var xScale = this._state.getXScale();
        var yScale = this._state.getYScale();

        var xAcessor = this._state.getX;
        var yAcessor = this._state.getY;

        this._dots
            .attr('transform', 'translate(' + this._state.getTransform() + ')')
            .attr('cx', function(d) {
                return xScale(xAcessor(d));
            }).attr('cy', function(d) {
                return yScale(yAcessor(d));
            });

        var meanLineData = this._state.getMeanLineData();

        this._meanLine
            .attr('x1', meanLineData.x1)
            .attr('y1', meanLineData.y1)
            .attr('x2', meanLineData.x2)
            .attr('y2', meanLineData.y2);
    }
}


module.exports.DotView = DotView;