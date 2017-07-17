import * as d3 from 'd3';


/**
 * Margin manager.
 * @public
 * @class
 */
class MMargin {

    constructor(margin = {}) {

        this._margins = [];

        this._margin = this._add({
            left: 5,
            top: 5,
            right: 5,
            bottom: 5
        }, margin);
    }


    _add(a, b) {

        for (var i in b) {
            a[i] += b[i];
        }

        return a;
    }


    addBottom(margin) {

        this._margin.bottom += margin;
        return this;
    }


    set(item) {

        this._margins.push(item);
        return this;
    }


    getMargin() {

        return this._margins.reduce(function(margin, item) {
            return this._add(margin, item.getMargin());
        }.bind(this), JSON.parse(JSON.stringify(this._margin)));
    }
}


module.exports.MMargin = MMargin;