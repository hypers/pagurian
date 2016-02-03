define(function(require, exports, module) {

    var g = window;

    require('./2.1.2/ion.rangeSlider');

    function Slider(selector, options) {

        this.init = function() {

            return $(selector).ionRangeSlider($.extend({
                hide_min_max: false,
                keyboard: true,
                min: 0,
                max: 100
            }, options));

        };
    }

    g[PagurianAlias].slider = function(selector, options) {
        return new Slider(selector, options).init();
    };

});
