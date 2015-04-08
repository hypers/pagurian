define(function(require, exports, module) {

    var g = window;

    function Select() {
        this.init = function(seletor, options) {

            var dataList = options.data;
            var elements = $(seletor);
            elements.empty();
            var selected = "";

            for (var i = 0; i < dataList.length; i++) {
                selected = "";
                if (options.active == dataList[i].id) {
                    selected = 'selected="selected"';
                }
                elements.append("<option value='" + dataList[i].id + "' " + selected + ">" + dataList[i].name + "</option>");
            }
            return this;
        }
    }

    g[PagurianAlias].ui.select = function(seletor, options) {
        var obj = new Select();
        obj.init(seletor, options);

        return obj;
    }
});