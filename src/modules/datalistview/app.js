/**
 * Created by yangguo on 2015/9/9 0009.
 */
define(function (require, exports, module) {
    
    var app = require("../../lib/app");
    var model = require('./model');

    require('../../widgets/datalistview/module');

    app.page.dataListView = function () {
        var tpl = $("#dataListViewTpl").html();
        var oDataListView = $p.dataListView("#dataListView", {
            "dataSource": model.getDataList,
            "tplHtml": tpl,
            "sDom": ["T", "D", "S", "P"],
            "fnParams": function () {
                return {};
            },
            "fnFormat": function (row) {
                return $p.tpl(tpl, row);
            }
        });
    };

    module.exports = app;
});
