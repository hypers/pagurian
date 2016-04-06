/**
 * 在IE浏览器 采用 execCommand('copy') 复制剪切板
 */
define(function(require, exports, module) {

    function TextareaClipboard(selector, options) {

        var self = this;
        var $button = $(selector); //触发复制的按钮
        var $cache = $("<textarea></textarea>"); //缓存区：textarea
        var $container = $(".modal-body:visible").length ? $(".modal-body:visible") : $("body");
        var data; //复制的值
        var css = {
            "position": "fixed",
            "top": "0px",
            "left": "0px",
            "width": "0px",
            "height": "0px",
            "padding": 0,
            "border": "none",
            "outline": "none",
            "boxShadow": "none",
            "background": "transparent"
        };

        $button.click(function(event) {
            if (options.copy !== undefined) data = options.copy(event, $(this));
            self.copy(data, event);
            if (options.afterCopy !== undefined) options.afterCopy(data, $(this));
        });

        this.copy = function(data, event) {

            $cache.css(css);
            $cache.val(data);
            $container.append($cache);
            $cache.select();

            try {
                document.execCommand('copy');
            } catch (err) {
                if (options.error !== undefined) options.error(event, $button);
            }

            $cache.remove();
        };
    }

    module.exports = TextareaClipboard;
});
