/**
 * Created by yangguo on 2015/9/9 0009.
 */
define(function (require, exports, module) {
    var app = require('../../lib/app');
    var model = require('./model');

    require('../../widgets/summary/module');

    app.page.summary = function () {
        var getColumns = function () {
            var columns = [];

            columns.push({
                "cName": "showCounts",
                "title": "展示次数"
            });

            columns.push({
                "cName": "clickCounts",
                "title": "点击次数(CLK)"
            });

            columns.push({
                "cName": "viewCounts",
                "title": "访问次数(VV)"
            });

            columns.push({
                "cName": "pageView",
                "title": "浏览量(PV)"
            });

            columns.push({
                "cName": "bounceRate",
                "title": "跳出率"
            });

            columns.push({
                "cName": "avgDayView",
                "title": "平均日浏览次数"
            });

            columns.push({
                "cName": "avgViewDeep",
                "title": "平均页面访问深度"
            });

            return columns;
        };

        var getRows = function () {
            var rows = [];
            rows.push({
                "dataName": "title",
                "isTitle": true,
                "klass": "summary-span-title"
            });

            rows.push({
                "dataName": "value",
                "klass": "summary-span-value"
            });

            rows.push({
                "dataName": "increase",
                "tpl": "增长数:{0}"
            });

            rows.push({
                "dataName": "rate",
                'render': function (data, full) {
                    var num = (Math.round(data * 10000) / 100).toFixed(2),
                        _html = "";
                    _html = num >= 0 ? ('<span class="summary-span-rate add">+' + num + '%</span>') :
                        ('<span class="summary-span-rate reduce">' + num + '%</span>');
                    return _html;
                }
            });

            return rows;
        };

        var option = {
            //最大列数
            "maxNum": 5,
            //最小列数
            "minNum": 3,
            //数据key
            "cName": "cName",
            //列
            "allColumns": getColumns(),
            //行
            "allRows": getRows(),
            //数据源的参数
            "dataParams": {},
            //数据源
            "dataSource": model.getSummaryData,
            "callbackOpen": function () {
                console.log("callbackOpen");
            },
            //确定按钮的回调
            "callbackSubmit": function (showColumns, datas) {
                console.log("callbackSubmit");
            },
            //取消按钮的回调
            "callbackCancel": function () {
                console.log("callbackCancel");
            }
        };
        var summary = $p.plugin.summary("#summaryTest", option);
    };

    app.page.summaryPro = function () {
        var getColumns = function () {
            var columns = [];

            columns.push({
                "cName": "showCounts",
                "title": "展示次数"
            });

            columns.push({
                "cName": "clickCounts",
                "title": "点击次数(CLK)"
            });

            columns.push({
                "cName": "viewCounts",
                "title": "访问次数(VV)"
            });

            columns.push({
                "cName": "pageView",
                "title": "浏览量(PV)"
            });

            columns.push({
                "cName": "bounceRate",
                "title": "跳出率"
            });

            columns.push({
                "cName": "avgDayView",
                "title": "平均日浏览次数"
            });

            columns.push({
                "cName": "avgViewDeep",
                "title": "平均页面访问深度"
            });

            return columns;
        };

        var getRows = function () {
            var rows = [];
            rows.push({
                "dataName": "title",
                "isTitle": true,
                "klass": "summary-span-title"
            });

            rows.push({
                "dataName": "value",
                "klass": "summary-span-value"
            });

            rows.push({
                "dataName": "increase",
                "tpl": "增长数:{0}"
            });

            rows.push({
                "dataName": "rate",
                'render': function (data, full) {
                    var num = (Math.round(data * 10000) / 100).toFixed(2),
                        _html = "";
                    _html = num >= 0 ? ('<span class="summary-span-rate add">+' + num + '%</span>') :
                        ('<span class="summary-span-rate reduce">' + num + '%</span>');
                    return _html;
                }
            });

            return rows;
        };

        var option = {
            //最大列数
            "maxNum": 5,
            //最小列数
            "minNum": 3,
            //可以切换
            "canChoose": true,
            //数据key
            "cName": "cName",
            //列
            "allColumns": getColumns(),
            //行
            "allRows": getRows(),
            //数据源的参数
            "dataParams": {},
            //数据源
            "dataSource": model.getSummaryData,
            "callbackOpen": function () {
                console.log("callbackOpen");
            },
            //确定按钮的回调
            "callbackSubmit": function (showColumns, datas) {
                console.log("callbackSubmit");
            },
            //取消按钮的回调
            "callbackCancel": function () {
                console.log("callbackCancel");
            },
            //点击面板的回调
            "callBackPanel": function (columnName, columnData, columnsData) {
                console.log(columnName);
                console.log(columnData);
                console.log(columnsData);
            }
        };
        var summary = $p.plugin.summary("#summaryTest", option);
    };

    module.exports = app;
});
