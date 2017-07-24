import {LineView} from './LineView.js';
import {View} from '../View.js';
import {LineStateFactory} from './line/LineStateFactory.js';


/**
 *
 */
class AreaView extends LineView {
    /**
     * @public
     * @override
     */
    render() {

        super.render();

        this._container
          .attr('class', 'view area-view ' + this._config.measureName + '-area-view');

        var measureIndexMap = this._getMeasureMap();

        this._line
            .style('stroke', null)
            .style('fill', function(d, i) {
                var config = this.getScope().getMeasureConfig(this, measureIndexMap[i]);
                return this._getColor(
                    d[measureIndexMap[i]],
                    undefined,
                    config.fillType == 'gradient' ? i : measureIndexMap[i]
                );
            }.bind(this));

        this._strokes = this._container
            .selectAll('path.stroke')
            .data(this.getData())
            .enter()
            .append('path')
            .attr('class', 'stroke')
            .style('fill', 'none')
            .style('stroke', function(d, i) {
                return View.getStrokeColor(this.getScope().getMeasureConfig(this, measureIndexMap[i]));
            }.bind(this))
            .style('stroke-dasharray', function(d, i) {
                return View.getStrokeDashArray(this.getScope().getMeasureConfig(this, measureIndexMap[i]));
            }.bind(this))
            .style('stroke-width', function(d, i) {
                return View.getStrokeWidth(this.getScope().getMeasureConfig(this, measureIndexMap[i]));
            }.bind(this))
            .attr('clip-path', function(d, i) {
                return 'url(#' + this._id + i + ')'
            }.bind(this));

        return this;
    }


    /**
     * @public
     * @override
     */
    resize() {

        super.resize();

        var lineGenerator = LineStateFactory.getInstance(this, 'line')
            .getLineGenerator();

        this._strokes
            .attr('transform', 'translate(' + this._state.getTransform() + ')')
            .attr('d', lineGenerator);
    }


    /**
     * Get groups list.
     * @public
     * @returns {String[]}
     */
    getGroups() {

        return [0];
    }
}


module.exports.AreaView = AreaView;