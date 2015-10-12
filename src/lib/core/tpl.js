define(function(require, exports, module) {

    var g = window;
    var FN = {};
    var ESCAPING_MAP = {
        "\\": "\\\\",
        "\n": "\\n",
        "\r": "\\r",
        "\u2028": "\\u2028",
        "\u2029": "\\u2029",
        "'": "\\'"
    };


    function Tpl() {

        this.render = function(template, data) {
            if (!template) return '';

            FN[template] = FN[template] || new Function("_",
                "return '" + template.replace(/[\\\n\r\u2028\u2029']/g, function(escape) {
                    return ESCAPING_MAP[escape];
                }).replace(/\{\s*(\w+)\s*\}/g, "'+(_.$1?(_.$1+'').replace(/[&\"<>]/g,function(e){return e}):(_.$1===0?0:''))+'") + "'"
            );
            return FN[template](data);
        };

    }

    g[PagurianAlias].tpl = function(template, data) {
        var tpl = new Tpl();
        return tpl.render(template, data);
    };

});
