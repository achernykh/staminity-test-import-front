/**
 *
 */
class AreaView extends LineView {
    /**
     * @public
     * @static
     * @param {Object} object - measure config
     * @param {UChart} uChart
     * @returns {AreaView}
     */
    static getInstance(config, uChart) {

        return new AreaView(config, uChart);
    }


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
