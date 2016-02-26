define(function(require, exports, module) {

    var app = require("../../lib/app");
    var model = require('./model');


    require('../../plugins/datatables/module');

    app.page.dataTable = function() {

        $p.dataTable("#my_table", {
            "fnDataSource": model.getDataList,
            "sClass": "table-fixed",
            "aaSorting": [
                [2, "desc"]
            ],
            "fnParams": function() {
                return {};
            },
            "oParamName": {
                "sPage": "currentPage"
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


    app.page.dataTableExtend = function() {

        var oTable = $p.dataTable("#my_table", {
            "fnDataSource": model.getDataList,
            "sClass": "table-fixed",
            "aaSorting": [
                [2, "desc"]
            ],
            "fnParams": function() {
                return {};
            },
            "fnExtendDetails": function(oTable, nTr, fnCallback) {

                var aData = oTable.fnGetData(nTr);
                var sOut = '<table class="table"><tbody>';
                sOut += '<tr><td class="w60"></td><td >' + aData.keywords + '-细分</td><td class="w150">' + aData.searchEngine + '</td><td class="w150 t-a-r ">123</td><td class="w150 t-a-r ">456</td><td class="w150 t-a-r ">212</td></tr>';
                sOut += '<tr><td class="w60"></td><td >' + aData.keywords + '-细分</td><td class="w150">' + aData.searchEngine + '</td><td class="w150 t-a-r ">123</td><td class="w150 t-a-r ">456</td><td class="w150 t-a-r ">212</td></tr>';
                sOut += '<tr><td class="w60"></td><td >' + aData.keywords + '-细分</td><td class="w150">' + aData.searchEngine + '</td><td class="w150 t-a-r ">123</td><td class="w150 t-a-r ">456</td><td class="w150 t-a-r ">212</td></tr>';
                sOut += '</tbody></table>';

                fnCallback(sOut);
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
                "sClass": "w150",
                "mData": "searchEngine"
            }, {
                "sClass": "t-a-r w150",
                "sTitle": "浏览量(PV)",
                "mData": "pageViews"
            }, {
                "sClass": "t-a-r w150",
                "sTitle": "独立访问者(UV)",
                "mData": "uniqueVisitors"
            }, {
                "sClass": "t-a-r w150",
                "sTitle": "访问次数(VV)",
                "mData": "visitViews"
            }]
        });
    };


    app.page.dataTableSummary = function() {

        $p.dataTable("#my_table", {
            "fnDataSource": model.getDataList,
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
                "sTitle": "关键字"
            }, {
                "sTitle": "搜索引擎",
                "mData": "searchEngine"
            }, {
                "bShowSummary": true,
                "sClass": "t-a-r",
                "sTitle": "浏览量(PV)",
                "sSubtitle": "--",
                "mData": "pageViews"
            }, {
                "sClass": "t-a-r",
                "bShowSummary": true,
                "fnSummaryFormat": function(value) {
                    return value + ".00";
                },
                "sTitle": "独立访问者(UV)",
                "sSubtitle": "--",
                "mData": "uniqueVisitors"
            }, {
                "sClass": "t-a-r",
                "bShowSummary": true,
                "sTitle": "访问次数(VV)",
                "sSubtitle": "副标题",
                "mData": "visitViews"
            }]
        });
    };

    app.page.dataTableSearch = function() {

        $p.dataTable("#my_table", {
            "fnDataSource": model.getDataList,
            "sClass": "table-fixed",
            "aaSorting": [
                [2, "desc"]
            ],
            "fnParams": function() {
                return {};
            },
            "oSearch": {
                "sInput": "#txt_search",
                "sParamName": "word",
                "fnCallback": function(value) {
                    $p.log(value);
                }
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
