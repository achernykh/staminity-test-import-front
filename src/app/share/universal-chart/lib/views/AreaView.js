import {LineView} from './LineView.js';


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
                return this._getColor(
                    this.getScope().getMeasureConfig(this, measureIndexMap[i]),
                    undefined,
                    i
                );
            }.bind(this));

        return this;
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