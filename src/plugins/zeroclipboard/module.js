define(function(require, exports, module) {
    var g = window;

    var ZeroClipboard = require("./2.2.0/ZeroClipboard");

    ZeroClipboard.config({
        swfPath: pagurian.path.app + "plugins/zeroclipboard/2.2.0/ZeroClipboard.swf"
    });

    function Copy(seletor, options) {

        var $seletor = (seletor instanceof jQuery) ? seletor : $(seletor);
        var that = this;
        this.client = new ZeroClipboard($seletor);

        this.client.on('ready', function(event) {

            //复制的执行的方法，把复制内容存储到剪切板
            that.client.on('copy', function(event) {
                event.clipboardData.setData('text/plain', $p.tool.isFunction(options.copy) ? options.copy(event) : function() {});
            });

            //复制完成执行的回调方法
            that.client.on('aftercopy', function(event) {
                if ($p.tool.isFunction(options.afterCopy)) {
                    options.afterCopy(event);
                }
            });

        });

        //复制错误执行的回调方法
        this.client.on('error', function(event) {
            if ($p.tool.isFunction(options.error)) {
                options.error(event);
            }
            ZeroClipboard.destroy();
        });

    }

    g[PagurianAlias].copy = function(seletor, options) {
        return new Copy(seletor, options);
    };

});
