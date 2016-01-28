define(function(require, exports, module) {
    require('./3.2.1/themes/default/style.css');
    require('./3.2.1/jstree');
    var g = window;


    function DataTree(seletor, options) {

        this.container = $(seletor);
        this.container.jstree($.extend({

        }, options));

        //JS

    }


    g[PagurianAlias].dataTree = function(seletor, options) {
        return new DataTree(seletor, options);
    };
});
