define(function(require, exports, module) {

    var app = require('../../lib/app');
    var model = require('./model');


    require('../../plugins/datatables/module');

    app.page.dataTable = function() {

        $p.ui.dataTable("#my_table", {
            "dataSource": model.getDataList,
            "sClass": "table-fixed",
            "aaSorting": [
                [2, "desc"]
            ],
            "fnParams": function() {
                return {};
            },
            "aoColumns": [{
                "bSortable": false,
                "mData": "keywords",
                "sTitle": "关键字",
                mRender: function(data, type, full) {
                    return '<span title="' + full.keywords + '">' + full.keywords + '</span>';
                }
            }, {
                "bSortable": false,
                "sTitle": "搜索引擎",
                "mData": "searchEngine"
            }, {
                "sClass": "t-a-r",
                "sTitle": "浏览量(PV)",
                "mData": "pageViews"
            }, {
                "sClass": "t-a-r",
                "sTitle": "独立访问者(UV)",
                "mData": "uniqueVisitors"
            }, {
                "sClass": "t-a-r",
                "sTitle": "访问次数(VV)",
                "mData": "visitViews"
            }]
        });
    };


    module.exports = app;

});