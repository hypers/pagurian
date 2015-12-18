/**
 * [demo]
 * $p.alert.success("报表保持成功");
 * $p.alert.info("您有5条系统提醒未读");
 * $p.alert.warn("您将要删除该项目");
 * $p.alert.error("找不到您筛选的数据,请尝试刷新页面!");
 */
define(function(require, exports, module) {

    var g = window;
    var types = ["success", "info", "error", "warn"];

    function Alert() {

        var timer;
        this.show = function(message, type) {

            var className = type || "success";
            var $headerMessage = $(".global-message").length > 0 ?
                $(".global-message").html(message).removeClass().addClass("global-message " + className) :
                $('<div class="global-message ' + className + '">' + message + '</div>');

            //在Modal中显示消息
            var visibleModal = false;
            $(".modal").each(function() {
                if ($(this).hasClass("in")) {
                    $(this).find(".modal-message").html('<div class="global-message ' + className + '">' + message + '</div>');
                    visibleModal = true;
                }
            });
            if (visibleModal) {
                return this;
            }

            //在页面顶部显示
            $("body").append($headerMessage);
            $headerMessage.css({
                "margin-left": "-" + ($headerMessage.outerWidth() / 2) + "px"
            });

            clearTimeout(timer);
            timer = setTimeout(function() {
                $headerMessage.remove();
            }, 3000);

            return this;
        };
    }

    //$p.alert("Hello","success");
    g[PagurianAlias].alert = function(message, type) {
        return new Alert().show(message, type);
    };

    //$p.alert.success("Hello");
    $.each(types, function(index, type) {
        g[PagurianAlias].alert[type] = function(message) {
            g[PagurianAlias].alert(message, type);
        };
    });
});
