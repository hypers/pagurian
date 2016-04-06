/**
 * 在IE浏览器 采用 execCommand('copy') 复制剪切板
 */
define(function(require, exports, module) {

    var ZeroClipboard = require("../vendor/zeroclipboard/2.0.0/ZeroClipboard");

    ZeroClipboard.config({
        swfPath: pagurian.path.app + "plugins/clipboard/vendor/zeroclipboard/2.0.0/ZeroClipboard.swf"
    });

    function FlashClipboard(selector, options) {

        var $selector = (selector instanceof jQuery) ? selector : $(selector);
        var self = this;
        var data;

        this.client = new ZeroClipboard($selector);
        this.client.on('ready', function(event) {

            //复制的执行的方法，把复制内容存储到剪切板
            self.client.on('copy', function(event) {
                if (options.copy !== undefined) data = options.copy(event, $selector);
                event.clipboardData.setData('text/plain', data);
            });

            //复制完成执行的回调方法
            self.client.on('aftercopy', function(event) {
                if (options.afterCopy !== undefined) options.afterCopy(event, $selector);
            });
        });

        //复制错误执行的回调方法
        this.client.on('error', function(event) {
            ZeroClipboard.destroy();
            $(selector).click(function() {
                if (options.error !== undefined) options.error(event, $selector);
            });
        });
    }

    module.exports = FlashClipboard;
});
