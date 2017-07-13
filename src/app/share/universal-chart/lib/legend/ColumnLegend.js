/**
 * @public
 * @class
 */
class ColumnLegend extends Legend {
    /**
     * @public
     * @returns {Object}
     */
    getMargin() {

        if (this.getConfig().get('horizontal-align', 'left') == 'left') {
            return {
                left: this.getWidth() + this._margin,
                top: 0,
                right: 0,
                bottom: 0
            }
        } else {
            return {
                left: 0,
                top: 0,
                right: this.getWidth() + this._margin * 2,
                bottom: 0
            }
        }
    }


    /**
     * @public
     * @override
     */
    resize() {

        this._items
            .attr('transform', function(d, i) {
                return 'translate(0, ' + (i * this._size + i * this._gap) + ')';
            }.bind(this));

        super.resize();
    }


    /**
     * @private
     * @returns {Number[]}
     */
    _getTranslate() {

        const margin = this._uChart.getMargin();
        var translate = [this._margin, this._margin];

        const verticalAlign = this._config['vertical-align'];
        const horizontalAlign = this._config['horizontal-align'];

        if (verticalAlign == 'bottom') {
            translate[1] = this._uChart.getInnerHeight() - this.getHeight() + margin.top;
        }

        if (horizontalAlign == 'right') {
            translate[0] = this._uChart.getOuterWidth() - this.getWidth() - this._margin;
        }

        return translate;
    }
}
