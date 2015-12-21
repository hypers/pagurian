define(function(require, exports, module) {

    var g = window;

    g[PagurianAlias].str = {
        //将驼峰式命名的字符串转换为下划线大写方式
        underscoreName: function(name) {
            return name.replace(/([A-Z])/g, "_$1").toLowerCase();
        },
        //将下划线大写方式命名的字符串转换为驼峰式
        camelName: function(name) {
            return name.replace(/\-(\w)/g, function(x) {
                return x.slice(1).toUpperCase();
            });
        }
    };

});
