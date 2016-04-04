define(function(require, exports, module) {

    var g = window;
    var FlashClipboard = require("./part/FlashClipboard");
    var TextareaClipboard = require("./part/TextareaClipboard");
    var isIE = !!navigator.userAgent.match(/MSIE/);

    g[PagurianAlias].clipboard = function(selector, options) {
        //如果是IE浏览器采用execCommand('copy') 命令复制Textarea中选中的文本
        //否则采用ZeroClipboard的Flash复制到剪切板
        if (isIE) return new TextareaClipboard(selector, options);
        return new FlashClipboard(selector, options);
    };

});
