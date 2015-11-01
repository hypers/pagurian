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
                "title": "展示次数展示次数展示次数展示次数展示次数展示次数展示次数"
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
        }

        var getRows = function () {
            var rows = [];
            rows.push({
                "dataName": "title",
                "isTitle": true,
                "class": "summary-span-title"
            });

            rows.push({
                "dataName": "value",
                "class": "summary-span-value"
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
            "callbackSubmit": function (showColumns, datas) {
                console.log("callbackSubmit");
            },
            "callbackCancel": function () {
                console.log("callbackCancel");
            }
        };
        var summary = $p.plugin.summary("#summaryTest", option);
    };

    module.exports = app;
});
