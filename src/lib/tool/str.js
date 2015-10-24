define(function(require, exports, module) {

    var g = window;

    function Str() {

        //将驼峰式命名的字符串转换为下划线大写方式
        this.underscoreName = function(name) {
            return name.replace(/([A-Z])/g, "_$1").toLowerCase();
        };

        //将下划线大写方式命名的字符串转换为驼峰式
        this.camelName = function(name) {
            return name.replace(/\-(\w)/g, function(x) {
                return x.slice(1).toUpperCase();
            });
        };

    }


    var str = new Str();

    g[PagurianAlias].str = str;

});
