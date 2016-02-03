/**
 * [demo]
 * $p.ui.alert("报表保持成功", "success");
 * $p.ui.alert("您有5条系统提醒未读", "info");
 * $p.ui.alert("您将要删除该项目", "warning");
 * $p.ui.alert("找不到您筛选的数据,请尝试刷新页面!", "error");
 */
define(function(require, exports, module) {

    var g = window;

    function Portlet(selector, options) {

        if (selector instanceof jQuery) {
            this.element = selector;
        } else {
            this.element = $(selector);
        }

        this.options = {};

        this.val = function(data) {

            var fields_list = this.element.find("[data-field]");
            fields_list.each(function() {
                var o = $(this);
                for (var key in data) {

                    if (o.data("field") === key) {
                        if (o.is("textarea") || o.is("input")) {
                            o.val(data[key]);
                            continue;
                        }
                        var v = "--";
                        if (data[key] || data[key] === 0) {
                            v = data[key];
                        }

                        o.html(v);
                    }
                }
            });
            return this;
        };
        this.reset = function() {

            var fields_list = this.element.find("[data-field]");
            fields_list.each(function() {
                var o = $(this);
                if (o.is("textarea") || o.is("input")) {
                    o.val("");
                } else {
                    o.html("--");
                }
            });

            return this;
        };
    }

    g[PagurianAlias].portlet = function(selector, options) {
        return new Portlet(selector, options);
        
    };

});
