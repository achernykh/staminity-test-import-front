/**
 * @public
 * @class
 */
class Tooltip {
    /**
      * @public
      * @param {UChart} uChart
      */
    constructor(uChart) {

        this._uChart = uChart;
        this._state = TooltipState.getInstance(this);

        this._offset = [0, 0];
        this._align = false;

        this._tip = d3.select('body')
            .append('div')
            .attr('class', 'universal-chart-tooltip')
            .style('display', 'none');
    }


    getContainer() {

        return this._tip;
    }


    /**
     * Remove tooltip container.
     * @public
     */
    remove() {

        this._tip.remove();
    }


    /**
     * @private
     * @returns {Orientation}
     */
    _getOrientation() {

        return this._uChart._orientation;
    }


    /**
     * @public
     * @returns {Boolean}
     */
    isCombined() {

        return this._state.constructor.name == 'TooltipCombinedState';
    }


    /**
     * @public
     * @param {Number[]} xy
     * @param {Boolean} align
     * @returns {Tooltip}
     */
    setXY(xy, align) {

        this._x = xy[0];
        this._y = xy[1];

        this._align = align;

        return this;
    }


    /**
     * Get tooltip content.
     * Из-за различий в реализации combined и single режимах тултипа
     * метод принимает переменное количество разных параметров называть
     * которые разумными именами нет смысла. Для деталей смотрите
     * конкретные реализации.
     * @public
     * @param {Mixed} a
     * @param {Mixed} b
     * @param {Mixed} c
     * @param {Mixed} d
     * @returns {String}
     */
    getContent(a, b, c, d) {

        return this._state.getContent(a, b, c, d);
    }


    /**
     * @public
     * @param {String} content
     * @returns {Tooltip}
     */
    setContent(content) {

        this._content = content;
        return this;
    }


    /**
     * @public
     * @param {Number[]} offset
     * @returns {Tooltip}
     */
    setOffset(offset) {

        this._offset = offset;
        return this;
    }


    /**
     * @public
     * @param {Boolean} [asIs=false]
     */
    show(asIs = false) {

        this._tip.html(
            '<table>' +
                '<tbody>' +
                this._content +
                '</tbody>' +
            '</table>'
        ).style('display', 'block');

        var dimension = this._tip.node().getBoundingClientRect();
        var yOffset = $(window).scrollTop();
        var x;
        var y = yOffset;

        if (asIs) {
            x = this._x;
            y = this._y;
        } else if (this._align) {
            var xy = this._getOrientation().adjustTooltipPosition([this._x, this._y], this._offset, this._tip.node());
            x = xy[0];
            y += xy[1];
        } else {
            x = Math.max(5, this._x - dimension.width / 2 + this._offset[0]);
            y += Math.max(5, this._y - dimension.height - this._offset[1]);
        }

        this._tip.style('left', x + 'px')
          .style('top', y + 'px');

        return this;
    }


    /**
     * @public
     */
    hide() {

        this._tip.style('display', 'none');
    }
}
