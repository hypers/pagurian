define(function(require, exports, module) {

    var g = window;

    require('./js/ion.rangeSlider');

    function Slider(seletor, options) {

        this.init = function() {

            return $(seletor).ionRangeSlider($.extend({
                hide_min_max: false,
                keyboard: true,
                min: 0,
                max: 100
            }, options));

        };
    }

    g[PagurianAlias].slider = function(seletor, options) {
        return new Slider(seletor, options).init();
    };

});
