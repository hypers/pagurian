/**
 * [demo]
 * $p.ui.alert("报表保持成功", "success");
 * $p.ui.alert("您有5条系统提醒未读", "info");
 * $p.ui.alert("您将要删除该项目", "warning");
 * $p.ui.alert("找不到您筛选的数据,请尝试刷新页面!", "error");
 */
define(function(require, exports, module) {

    var g = window;

    function Alert() {
        this.show = function(info, type) {

            var type = type || "success";
            var obj = $(".global-message").length > 0 ?
                $(".global-message").html(info).removeClass().addClass("global-message " + type) :
                $('<div class="global-message ' + type + '">' + info + '</div>');
            $('body').append(obj);
            var margin = obj.outerWidth() / 2;
            obj.css({
                "margin-left": "-" + margin + "px"
            });
            setTimeout(function() {
                obj.remove();
            }, 3000);

            return this;
        }
    }

    g[PagurianAlias].ui.alert = function(info, type) {
        var obj = new Alert();
        obj.show(info, type);
        return obj;
    }

});