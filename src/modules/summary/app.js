/**
 * Created by yangguo on 2015/9/9 0009.
 */
define(function (require, exports, module) {
    var app = require("../../lib/app");
    var model = require('./model');

    require('../../widgets/summary/module');
    require("../../plugins/echarts/module");

    var summaryDemo;

    app.events.resize = function () {
        summaryDemo.resize();
    };

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
            //列
            "allColumns": getColumns(),
            //行
            "allRows": getRows(),
            //数据源
            "dataSource": model.getSummaryData,

        };

        summaryDemo = $p.summary("#summaryTest", option);
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

        var chartData = {
            "clickCounts": {
                columns: ['2014-07-05', '2014-07-06', '2014-07-07', '2014-07-08', '2014-07-09', '2014-07-10', '2014-07-11'],
                rows: [{
                    name: "点击次数(CLK)",
                    data: [120, 132, 101, 134, 90, 230, 210]
                }]
            },
            "viewCounts": {
                columns: ['2014-07-05', '2014-07-06', '2014-07-07', '2014-07-08', '2014-07-09', '2014-07-10', '2014-07-11'],
                rows: [{
                    name: "访问次数(VV)",
                    data: [120, 312, 101, 134, 90, 230, 210]
                }]
            },
            "pageView": {
                columns: ['2014-07-05', '2014-07-06', '2014-07-07', '2014-07-08', '2014-07-09', '2014-07-10', '2014-07-11'],
                rows: [{
                    name: "浏览量(PV)",
                    data: [789, 132, 101, 41, 90, 230, 210]
                }]
            },
            "bounceRate": {
                columns: ['2014-07-05', '2014-07-06', '2014-07-07', '2014-07-08', '2014-07-09', '2014-07-10', '2014-07-11'],
                rows: [{
                    name: "跳出率",
                    data: [56, 132, 431, 134, 90, 230, 210]
                }]
            },
            "showCounts": {
                columns: ['2014-07-05', '2014-07-06', '2014-07-07', '2014-07-08', '2014-07-09', '2014-07-10', '2014-07-11'],
                rows: [{
                    name: "展示次数",
                    data: [120, 132, 101, 134, 120, 321, 210]
                }]
            },
            "avgDayView": {
                columns: ['2014-07-05', '2014-07-06', '2014-07-07', '2014-07-08', '2014-07-09', '2014-07-10', '2014-07-11'],
                rows: [{
                    name: "平均日浏览次数",
                    data: [345, 132, 101, 465, 90, 230, 123]
                }]
            },
            "avgViewDeep": {
                columns: ['2014-07-05', '2014-07-06', '2014-07-07', '2014-07-08', '2014-07-09', '2014-07-10', '2014-07-11'],
                rows: [{
                    name: "平均页面访问深度",
                    data: [120, 14, 101, 134, 90, 230, 210]
                }]
            }
        };

        var chart = $p.echarts("my_chart", {
            type: "line",
            title: {
                text: '数据分析',
                subtext: '最近一周数据'
            }
        });

        var option = {
            //保存状态到cookie
            "saveState": true,
            //最大列数
            "maxNum": 5,
            //最小列数
            "minNum": 3,
            //可以切换
            "canChoose": true,
            //显示setting按钮
            "showSetting": true,
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
            "callBackPanel": function (columnName, columnData, allDatas) {
                $p.alert("【columnName】:" + columnData.cNameTitle + "(" + columnName + ")-" + columnData.value, "success");
                chart.load(chartData[columnName]);
                console.log(columnName);
                console.log(columnData);
                console.log(allDatas);
            },
            //加载完数据的回调
            "callBackGetData": function (chooseColumnsName, chooseColumnsData, allDatas) {
                chart.load(chartData[chooseColumnsName]);
            }
        };

        summaryDemo = $p.summary("#summaryProTest", option);
    };

    module.exports = app;
});
