define(function(require, exports, module) {

    var g = window;

    require('./3.1.1/jquery.bootstrap-touchspin.css');
    require('./3.1.1/jquery.bootstrap-touchspin');

    function NumberSpinner(seletor, options) {

        this.init = function() {

            return $(seletor).TouchSpin($.extend({
                verticalbuttons: true
            }, options));

        };

    }

    g[PagurianAlias].numberSpinner = function(seletor, options) {
        return new NumberSpinner(seletor, options).init();
    };

});
