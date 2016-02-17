define(function(require, exports, module) {

    var app = require("../../lib/app");
    require("../../plugins/echarts/module");

    var chart = {};
    app.page.bar = function() {

        chart = $p.echarts("my_chart", {
            type: "bar"
        });

        chart.load({
            columns: ['百度', '谷歌', '360搜索', '搜狗', '必应', '雅虎', '网易有道'],
            rows: [{
                name: "浏览量(PV)",
                value: [735, 310, 234, 135, 548, 148, 114]
            }, {
                name: "独立访客者(UV)",
                value: [435, 110, 84, 95, 108, 98, 74]
            }, {
                name: "访问总次数(VV)",
                value: [255, 120, 184, 195, 208, 198, 174]
            }]
        });
    };


    app.page.horizon = function() {

        chart = $p.echarts("my_chart", {
            type: "bar"
        });

        chart.load({
            name: "PV",
            //是否为水平显示,默认为false
            horizon: true,
            columns: ['百度', '谷歌', '360搜索', '搜狗', '必应', '雅虎', '网易有道'],
            rows: [{
                name: "浏览量(PV)",
                value: [735, 310, 234, 135, 548, 148, 114]
            }, {
                name: "独立访客者(UV)",
                value: [435, 110, 84, 95, 108, 98, 74]
            }, {
                name: "访问总次数(VV)",
                value: [255, 120, 184, 195, 208, 198, 174]
            }]
        });


    };

    app.page.horizon = function() {

        chart = $p.echarts("my_chart", {
            type: "bar"
        });

        chart.load({
            name: "PV",
            //是否为水平显示,默认为false
            horizon: true,
            columns: ['百度', '谷歌', '360搜索', '搜狗', '必应', '雅虎', '网易有道'],
            rows: [{
                name: "上海",
                value: [735, 310, 234, 135, 548, 148, 114]
            }, {
                name: "北京",
                value: [435, 110, 84, 95, 108, 98, 74]
            }, {
                name: "广州",
                value: [255, 120, 184, 195, 208, 198, 174]
            }]
        });
    };

    app.page.horizonStack = function() {

        chart = $p.echarts("my_chart", {
            type: "bar"
        });

        chart.load({
            name: "PV",
            //是否为水平显示,默认为false
            horizon: true,
            columns: ['百度', '谷歌', '360搜索', '搜狗', '必应', '雅虎', '网易有道'],
            rows: [{
                name: "上海",
                value: [735, 310, 234, 135, 548, 148, 114],
                stack: "浏览量(PV)"
            }, {
                name: "北京",
                value: [435, 110, 84, 95, 108, 98, 74],
                stack: "浏览量(PV)"
            }, {
                name: "广州",
                value: [255, 120, 184, 195, 208, 198, 174],
                stack: "浏览量(PV)"
            }]
        });

    };

    app.page.custom = function() {

        chart = $p.echarts("my_chart", {
            type: "bar"
        });


        chart.load({
            name: "PV",
            columns: ['百度', '谷歌', '360搜索', '搜狗', '必应', '雅虎', '网易有道'],
            rows: [{
                name: "浏览量(PV)",
                value: [735, 310, 234, 135, 548, 148, 114]
            }]
        }, function(option) {
            option.series[0].itemStyle.normal = {
                color: function(params) {
                    var colorList = [
                        '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                        '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                        '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                    ];
                    return colorList[params.dataIndex];
                }
            };
            return option;
        });

    };


    app.events.resize = function() {
        if (chart.chart && "function" === typeof chart.chart.resize) {
            chart.chart.resize();
        }
    };


    module.exports = app;

});
