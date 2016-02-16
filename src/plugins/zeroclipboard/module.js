define(function(require, exports, module) {
    var g = window;

    var ZeroClipboard = require("./2.2.0/ZeroClipboard");

    ZeroClipboard.config({
        swfPath: pagurian.path.app + "plugins/zeroclipboard/2.2.0/ZeroClipboard.swf"
    });

    function Copy(selector, options) {

        var $selector = (selector instanceof jQuery) ? selector : $(selector);
        var that = this;
        this.client = new ZeroClipboard($selector);

        this.client.on('ready', function(event) {

            //复制的执行的方法，把复制内容存储到剪切板
            that.client.on('copy', function(event) {
                event.clipboardData.setData('text/plain', $.isFunction(options.copy) ? options.copy(event) : function() {});
            });

            //复制完成执行的回调方法
            that.client.on('aftercopy', function(event) {
                if ($.isFunction(options.afterCopy)) {
                    options.afterCopy(event);
                }
            });

        });

        //复制错误执行的回调方法
        this.client.on('error', function(event) {
            ZeroClipboard.destroy();
            $(selector).click(function() {
                if ($p.tool.isFunction(options.error)) {
                    options.error(event, $selector);
                }
            });
        });

    }

    g[PagurianAlias].copy = function(selector, options) {
        return new Copy(selector, options);
    };

});
