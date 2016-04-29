define(function(require, exports, module) {

    var g = window;

    require('./3.1.1/jquery.bootstrap-touchspin.css');
    require('./3.1.1/jquery.bootstrap-touchspin');

    function NumberSpinner(selector, options) {

        this.container = (selector instanceof jQuery) ? selector : $(selector);

        this.container.TouchSpin($.extend({
            verticalbuttons: true
        }, options));

        this.destroy = function() {
            this.container.TouchSpin("destroy");
        };

        if ($.isFunction(options.change)) {
            
            this.container.on("change", function(entity) {
                var data = $(entity.target).val();
                options.change(data, entity);
            });
        }

    }

    g[PagurianAlias].numberSpinner = function(selector, options) {
        return new NumberSpinner(selector, options);
    };

});
