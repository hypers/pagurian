/**
 * Created by YangGuo on 2016/5/23 0023.
 */
define(function(require, exports, module) {
    var g = window;

    require('./4.0.2/select2');
    require('./4.0.2/css/select2.css');
    require('./4.0.2/i18n/zh-CN');

    function Select2(selector, options) {
        var _this = this;
        this.container = (selector instanceof jQuery) ? selector : $(selector);

        this.options = $.extend(true, {}, options);

        this.container.select2 = this.container.select2(options);

        this.init = function() {
            this.container.select2(_this.options);
        };

        this.destroy = function() {
            this.container.select2('destroy');
        }

        this.open = function() {
            this.container.select2('open');
        }

        this.close = function() {
            this.container.select2('close');
        }

        this.setValue = function() {
            this.container.select2.val(arguments[0]).trigger("change");
        }

        this.clearValue = function() {
            this.container.select2.val(null).trigger("change");
        }
    }

    g[PagurianAlias].select2 = function(selector, options) {
        return new Select2(selector, options);
    };
});
