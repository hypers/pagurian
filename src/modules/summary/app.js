/**
 * Created by yangguo on 2015/9/9 0009.
 */
define(function (require, exports, module) {
    var app = require('../../lib/app');
    var model = require('./model');

    require('../../widgets/summary/module');

    app.page.summary = function () {
        var tpl = $("#dataListViewTpl").html();
        var summary = $p.plugin.summary("#summary");
    };

    module.exports = app;
});
