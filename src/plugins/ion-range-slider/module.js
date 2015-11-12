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

    g[PagurianAlias].plugin.slider = function(seletor, options) {
        var slider = new Slider(seletor, options);
        return slider.init();
    };

});
